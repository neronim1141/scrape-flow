"use client";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { NodeCard } from "./card";
import { AppNode } from "./type";
import { NodeHeader } from "./header";
import { NodeInput } from "./input";
import { TaskRegistry } from "../tasks/registry";

export const FlowScrapeNode = memo<NodeProps<AppNode>>((props) => {
  const task = TaskRegistry[props.data.type];

  return (
    <NodeCard nodeId={props.id} isSelected={props.selected}>
      <NodeHeader task={task} />
      <div className="flex flex-col divide-y-2">
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={props.id} />
        ))}
      </div>
    </NodeCard>
  );
});
