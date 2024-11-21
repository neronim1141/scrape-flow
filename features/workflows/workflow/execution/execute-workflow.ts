import "server-only";
import {
  ExecutionPhase,
  executionPhaseTable,
  WorkflowExecution,
  workflowsExecutionTable,
  workflowsTable,
} from "@/features/database/schema";
import { db } from "@/features/database/db";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { TaskRegistry } from "../tasks/registry";
import { AppNode } from "../node/type";
import { ExecutionRegistry } from "../tasks/registry.server";
import { WorkflowEnvironment } from "./type";
import { LogCollector } from "../log/type";
import { Browser, Page } from "puppeteer-core";
import { Edge, ReactFlowJsonObject } from "@xyflow/react";
import { createLogCollector } from "../log/create-log-collector";
import { executionLogTable } from "@/features/database/schema/execution-log";

export const executeWorkflow = async (
  execution: WorkflowExecution & {
    phases: ExecutionPhase[];
  },
  flowDefinition: ReactFlowJsonObject<AppNode>
) => {
  if (!execution) throw new Error("execution not found");
  const environment = { phases: {} } satisfies WorkflowEnvironment;

  await initializeWorkflowExecution(execution.id, execution.workflowId);
  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      flowDefinition.edges
    );
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }
  await finalizeWorkflowExecution(
    execution.id,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  await cleanupEnvironment(environment);

  revalidatePath("/workflow/runs");
};

const initializePhaseStatuses = async (
  execution: WorkflowExecution & { phases: ExecutionPhase[] }
) => {
  await db
    .update(executionPhaseTable)
    .set({
      status: "PENDING",
    })
    .where(
      inArray(
        executionPhaseTable.id,
        execution.phases.map((p) => p.id)
      )
    );
};

const initializeWorkflowExecution = async (
  id: WorkflowExecution["id"],
  workflowId: WorkflowExecution["workflowId"]
) => {
  await db
    .update(workflowsExecutionTable)
    .set({
      startedAt: new Date(),
      status: "RUNNING",
    })
    .where(eq(workflowsExecutionTable.id, id));

  await db
    .update(workflowsTable)
    .set({
      lastRunAt: new Date(),
      lastRunId: id,
      lastRunStatus: "RUNNING",
    })
    .where(eq(workflowsTable.id, workflowId));
};
const finalizeWorkflowExecution = async (
  id: WorkflowExecution["id"],
  workflowId: WorkflowExecution["workflowId"],
  executionFailed: boolean,
  creditsConsumed: number
) => {
  await db
    .update(workflowsExecutionTable)
    .set({
      completedAt: new Date(),
      status: executionFailed ? "FAILED" : "COMPLETED",
      creditsConsumed,
    })
    .where(eq(workflowsExecutionTable.id, id));

  await db
    .update(workflowsTable)
    .set({
      lastRunStatus: executionFailed ? "FAILED" : "COMPLETED",
    })
    .where(
      and(eq(workflowsTable.id, workflowId), eq(workflowsTable.lastRunId, id))
    )
    .catch(() => {
      //ignore
    });
};

const executeWorkflowPhase = async (
  phase: ExecutionPhase,
  environment: WorkflowEnvironment,
  edges: Edge[]
) => {
  const logCollector = createLogCollector();

  const startedAt = new Date();
  setupEnviromentForPhase(phase.node, environment, edges);
  await db
    .update(executionPhaseTable)
    .set({
      status: "RUNNING",
      startedAt,
      inputs: environment.phases[phase.node.id].inputs,
    })
    .where(eq(executionPhaseTable.id, phase.id));
  const creditsRequired = TaskRegistry[phase.node.data.type].credits;

  const success = await executePhase(phase, environment, logCollector);
  const outputs = environment.phases[phase.node.id].outputs;
  await finalizePhase(phase.id, success, outputs, logCollector);
  return { success };
};

const finalizePhase = async (
  id: ExecutionPhase["id"],
  success: boolean,
  outputs: Record<string, string>,
  logCollector: LogCollector
) => {
  await db
    .update(executionPhaseTable)
    .set({
      status: success ? "COMPLETED" : "FAILED",
      completedAt: new Date(),
      outputs,
    })
    .where(eq(executionPhaseTable.id, id));
  const logs = logCollector.getAll().map((log) => ({
    ...log,
    executionPhaseId: id,
  }));
  if (logs.length > 0) await db.insert(executionLogTable).values(logs);
};

const executePhase = async (
  phase: ExecutionPhase,
  environment: WorkflowEnvironment,
  logCollector: LogCollector
) => {
  const runFn = ExecutionRegistry[phase.node.data.type];
  if (!runFn) return true;
  const executionEnvironment = createExecutionEnvironment(
    phase.node,
    environment,
    logCollector
  );
  return await runFn(executionEnvironment);
};

const setupEnviromentForPhase = (
  node: AppNode,
  environment: WorkflowEnvironment,
  edges: Edge[]
) => {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === "BROWSER_INSTANCE") {
      continue;
    }
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );
    if (!connectedEdge) {
      console.error("Missing edge for input", input.name, "node id:", node.id);

      continue;
    }
    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];

    environment.phases[node.id].inputs[input.name] = outputValue;
  }
};
const createExecutionEnvironment = (
  node: AppNode,
  environment: WorkflowEnvironment,
  logCollector: LogCollector
) => {
  return {
    getInput: (name: string) => environment.phases[node.id].inputs[name],
    setOutput: (name: string, value: string) =>
      (environment.phases[node.id].outputs[name] = value),
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),
    log: logCollector,
  };
};

const cleanupEnvironment = async (environment: WorkflowEnvironment) => {
  await environment.browser
    ?.close()
    .catch((err) => console.error("Cannot close browser:", err));
};
