import { Node } from "@xyflow/react";
import { LucideProps } from "lucide-react";
import { ReactNode } from "react";

export interface AppNodeData {
  type: TaskType;
  inputs?: Record<string, string>;
  outputs?: Record<string, string>;
  [key: string]: unknown;
}

export type AppNode = Node<AppNodeData>;

export interface TaskParameters {
  name: string;
  type: "STRING";
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
}

export type TaskType = "LAUNCH_BROWSER";

export interface Task {
  type: TaskType;
  label: string;
  icon: (props: LucideProps) => ReactNode;
  isEntryPoint: boolean;
  inputs: TaskParameters[];
}
export interface NodeFieldProps {
  param: TaskParameters;
  value?: string;
  onUpdate: (value: string) => void;
}
