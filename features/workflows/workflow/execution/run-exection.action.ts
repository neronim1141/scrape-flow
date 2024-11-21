"use server";

import { ReactFlowJsonObject } from "@xyflow/react";
import { AppNode } from "../node/type";
import { auth } from "@clerk/nextjs/server";
import { getWorkflow } from "../editor/get-workflow.action";
import { flowToExecutionPlan } from "./executionPlan";
import { db } from "@/features/database/db";
import {
  ExecutionPhaseInsert,
  executionPhaseTable,
  workflowsExecutionTable,
} from "@/features/database/schema";
import { TaskRegistry } from "../tasks/registry";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { executeWorkflow } from "./execute-workflow";

export const runWorkflow = async ({
  workflowId,
  flowDefinition,
}: {
  workflowId: string;
  flowDefinition?: ReactFlowJsonObject<AppNode>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }
  if (!workflowId) {
    throw new Error("workflowId is undefined");
  }

  const workflow = await getWorkflow(workflowId);
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  const definition = flowDefinition ?? workflow.definition;
  if (!definition) {
    throw new Error("flow Definition is not defined");
  }
  const { executionPlan } = flowToExecutionPlan(
    definition.nodes ?? [],
    definition.edges ?? []
  );
  if (!executionPlan) {
    throw new Error("No execution plan generated");
  }
  const execution = await db.transaction(async (tx) => {
    const [workflowExecution] = await tx
      .insert(workflowsExecutionTable)
      .values({
        workflowId,
        userId,
        status: "PENDING",
        startedAt: new Date(),
        trigger: "MANUAL",
      })
      .returning();
    for (const phaseNode of executionPlan.flatMap((executionPhase) =>
      executionPhase.nodes.flatMap(
        (node) =>
          ({
            userId,
            status: "CREATED",
            phase: executionPhase.phase,
            node: node,
            name: TaskRegistry[node.data.type].label,
            workflowExecutionId: workflowExecution.id,
          } satisfies ExecutionPhaseInsert)
      )
    )) {
      await tx.insert(executionPhaseTable).values(phaseNode);
    }
    return tx.query.workflowsExecutionTable.findFirst({
      where: eq(workflowsExecutionTable.id, workflowExecution.id),
      with: {
        phases: true,
      },
    });
  });
  if (!execution) {
    throw new Error("Workflow execution not created");
  }
  executeWorkflow(execution, definition);
  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
};
