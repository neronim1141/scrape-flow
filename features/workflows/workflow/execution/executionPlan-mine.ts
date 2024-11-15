import { Edge, getConnectedEdges, getIncomers } from "@xyflow/react";
import { AppNode, AppNodeMissingInputs } from "../node/type";
import { ExecutionPlan, ExecutionPlanError } from "./type";
import { TaskRegistry } from "../tasks/registry";

const validateNode = (node: AppNode, edges: Edge[]) => {
  const invalidInputs: string[] = [];

  const task = TaskRegistry[node.data.type];

  for (let inputDefinition of task.inputs) {
    if (node.data.inputs[inputDefinition.name] !== undefined) continue;
    if (!inputDefinition.required) continue;

    const nodeEdges = edges.filter((edge) => edge.target === node.id);

    const inputEdge = nodeEdges.find(
      (edge) => edge.targetHandle === inputDefinition.name
    );
    if (!inputEdge) {
      invalidInputs.push(inputDefinition.name);
    }
  }
  return invalidInputs;
};

type FlowToExecutionPlan = {
  executionPlan?: ExecutionPlan[];
  error?: ExecutionPlanError;
};
export const flowToExecutionPlan = (
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlan => {
  let nodesCopy = [...nodes];
  const entryPoint = nodesCopy.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );
  if (!entryPoint) {
    return {
      error: {
        type: "NO_ENTRY_POINT",
      },
    };
  }
  const inputsWithErrors: AppNodeMissingInputs[] = [];

  const invalidInputs = validateNode(entryPoint, edges);

  if (invalidInputs.length !== 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }
  const executionPlan: ExecutionPlan[] = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  do {
    const lastPhase = executionPlan.at(-1)!;
    nodesCopy = nodesCopy.filter((node) => !lastPhase.nodes.includes(node));
    const planned = nodesCopy.filter(
      (node) => getIncomers(node, nodesCopy, edges).length === 0
    );
    for (const node of planned) {
      const invalidInputs = validateNode(node, edges);
      if (invalidInputs.length !== 0) {
        inputsWithErrors.push({
          nodeId: node.id,
          inputs: invalidInputs,
        });
      }
    }

    if (planned.length == 0) continue;

    executionPlan.push({
      phase: lastPhase.phase + 1,
      nodes: planned,
    });
  } while (nodesCopy.length > 0);
  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: "INVALID_INPUTS",
        invalidElements: inputsWithErrors,
      },
    };
  }
  return { executionPlan };
};
