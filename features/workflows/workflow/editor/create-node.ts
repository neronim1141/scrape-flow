import { XYPosition } from "@xyflow/react";
import { AppNode } from "../node/type";
import { TaskType } from "../tasks/type";

export const createNode = (
  nodeType: TaskType,
  position?: XYPosition
): AppNode => {
  return {
    id: crypto.randomUUID(),
    type: "FlowScrapeNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
      outputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  };
};
