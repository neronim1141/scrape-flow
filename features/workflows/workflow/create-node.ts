import { XYPosition } from "@xyflow/react";
import { AppNode, TaskType } from "./node/type";

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
    },
    position: position ?? { x: 0, y: 0 },
  };
};
