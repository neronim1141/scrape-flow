import { Edge } from "@xyflow/react";
import { AppNode, AppNodeMissingInputs } from "../node/type";
import { ExecutionPlan, ExecutionPlanError } from "./type";
import { TaskRegistry } from "../tasks/registry";
import { getIncomers } from "./utils";

const getInvalidInputs = (
  node: AppNode,
  planned: Set<string>,
  edges: Edge[]
) => {
  const invalidInpus = [];
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    if (inputValue !== undefined) continue;
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    if (
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source)
    )
      continue;

    if (
      !input.required &&
      (!inputLinkedToOutput || planned.has(inputLinkedToOutput.source))
    ) {
      continue;
    }

    invalidInpus.push(input.name);
  }
  return invalidInpus;
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
  const planned = new Set<string>();
  const invalidInputs = getInvalidInputs(entryPoint, planned, edges);
  if (invalidInputs.length > 0) {
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
  planned.add(entryPoint.id);
  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: ExecutionPlan = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) continue;
      const invalidInputs = getInvalidInputs(currentNode, planned, edges);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);

        if (!incomers.every((incomer) => planned.has(incomer.id))) continue;

        if (invalidInputs.length > 0) {
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        }
      }
      nextPhase.nodes.push(currentNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }

    executionPlan.push(nextPhase);
  }
  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: "INVALID_INPUTS",
        invalidElements: inputsWithErrors,
      },
    };
  }
  return {
    executionPlan,
  };
};
