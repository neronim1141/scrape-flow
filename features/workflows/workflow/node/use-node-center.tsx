import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export const useNodeCenter = (nodeId: string) => {
  const { getNode, setCenter } = useReactFlow();
  return useCallback(() => {
    const node = getNode(nodeId);
    if (!node) return;
    const { position, measured } = node;
    if (!position || !measured) return;
    const { width, height } = measured;
    const { x, y } = position;
    if (!width || !height) return;
    setCenter(x + width / 2, y + height / 2, { zoom: 1, duration: 500 });
  }, [getNode, setCenter, nodeId]);
};
