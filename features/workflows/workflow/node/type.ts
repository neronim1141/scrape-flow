import { Node } from "@xyflow/react";
import { TaskParameters, TaskType } from "../tasks/type";

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  outputs: Record<string, string>;
  [key: string]: unknown;
}

export type AppNode = Node<AppNodeData>;

export interface NodeFieldProps {
  param: TaskParameters;
  value?: string;
  disabled?: boolean;

  onUpdate: (value: string) => void;
}

export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};
