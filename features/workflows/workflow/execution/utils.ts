import { Edge } from "@xyflow/react";
import { AppNode } from "../node/type";

export const getIncomers = (node: AppNode, nodes: AppNode[], edges: Edge[]) => {
  if (!node.id) return [];
  const incommersId = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incommersId.add(edge.source);
    }
  });
  return nodes.filter((node) => incommersId.has(node.id));
};
