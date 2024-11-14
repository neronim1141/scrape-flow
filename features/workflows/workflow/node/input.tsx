import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { NodeField } from "./field";
import { TaskParameters } from "./type";

interface NodeInputProps {
  input: TaskParameters;
  nodeId: string;
}
export const NodeInput: FC<NodeInputProps> = ({ input, nodeId }) => {
  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      <NodeField param={input} nodeId={nodeId} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !size-4"
          )}
        />
      )}
    </div>
  );
};
