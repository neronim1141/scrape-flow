"use client";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React, { FC, PropsWithChildren } from "react";

interface NodeCardProps {
  nodeId: string;
  isSelected?: boolean;
}
export const NodeCard: FC<PropsWithChildren<NodeCardProps>> = ({
  children,
  nodeId,
  isSelected,
}) => {
  const { getNode, setCenter } = useReactFlow();
  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        const { x, y } = position;
        if (!width || !height) return;
        setCenter(x + width / 2, y + height / 2, { zoom: 1, duration: 500 });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 w-[420px] text-xs gap-1 flex flex-col",
        {
          "border-primary": isSelected,
        }
      )}
    >
      {children}
    </div>
  );
};
