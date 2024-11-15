"use client";
import {
  Handle,
  NodeProps,
  Position,
  useEdges,
  useReactFlow,
} from "@xyflow/react";
import { FC, memo } from "react";
import { AppNode, TaskParameters } from "./type";
import { HandleRegistry, TaskRegistry } from "../tasks/registry";
import { NodeField } from "./field";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useNodeCenter } from "./use-node-center";

import { Badge } from "@/components/ui/badge";
import { CoinsIcon, CopyIcon, GripVertical, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "./type";
import { createNode } from "../editor/create-node";
import { useFlowValidation } from "../editor/flow-validation.context";

const NodeHeader: FC<{
  task: Task;
  nodeId: string;
}> = ({ task, nodeId }) => {
  const { deleteElements, getNode, addNodes } = useReactFlow<AppNode>();
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteElements({ nodes: [{ id: nodeId }] })}
              >
                <TrashIcon size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const node = getNode(nodeId);
                  if (!node) {
                    console.error("Node supposed to be found");
                    return;
                  }
                  const position = {
                    x: node.position.x,
                    y: node.position.y + (node.measured?.height ?? 0) + 20,
                  };
                  const newNode = createNode(node.data.type, position);
                  addNodes([newNode]);
                }}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab"
            aria-label="drag handle"
          >
            <GripVertical size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface NodeInputProps {
  input: TaskParameters;
  nodeId: string;
}
const NodeInput: FC<NodeInputProps> = ({ input, nodeId }) => {
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );
  const { invalidInputs } = useFlowValidation();
  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);

  return (
    <div
      className={cn("flex justify-start relative p-3 bg-secondary w-full", {
        "bg-destructive/30": hasErrors,
      })}
    >
      <NodeField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          isConnectable={!isConnected}
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !size-4",
            HandleRegistry[input.type]
          )}
        />
      )}
    </div>
  );
};

interface NodeOutputProps {
  output: TaskParameters;
  nodeId: string;
}
const NodeOutput: FC<NodeOutputProps> = ({ output, nodeId }) => {
  return (
    <div className="flex justify-end relative p-3 bg-secondary w-full">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !-right-2 !size-4",
          HandleRegistry[output.type]
        )}
      />
    </div>
  );
};

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";
export const FlowScrapeNode = memo<NodeProps<AppNode>>((props) => {
  const task = TaskRegistry[props.data.type];
  const onDoubleClick = useNodeCenter(props.id);
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some(
    (node) => node.nodeId === props.id
  );

  return (
    <div
      onDoubleClick={onDoubleClick}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 w-[420px] text-xs flex flex-col",
        {
          "border-primary": props.selected,
          "border-destructive border-2": hasInvalidInputs,
        }
      )}
    >
      {DEV_MODE && <Badge>DEV:{props.id}</Badge>}
      <NodeHeader task={task} nodeId={props.id} />

      <div className="flex flex-col divide-y-2">
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={props.id} />
        ))}
      </div>
      <Separator className="h-[2px]" />
      <div className="flex flex-col divide-y-2">
        {task.outputs.map((output) => (
          <NodeOutput key={output.name} output={output} nodeId={props.id} />
        ))}
      </div>
    </div>
  );
});
FlowScrapeNode.displayName = "FlowScrapeNode";
