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
  type: "STRING" | "BROWSER_INSTANCE";
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  variant?: "textarea";
}

export type TaskType =
  | "LAUNCH_BROWSER"
  | "PAGE_TO_HTML"
  | "EXTRACT_TEXT_FROM_ELEMENT";

export interface Task {
  type: TaskType;
  label: string;
  icon: (props: LucideProps) => ReactNode;
  isEntryPoint: boolean;
  inputs: TaskParameters[];
  outputs: TaskParameters[];
}
export interface NodeFieldProps {
  param: TaskParameters;
  value?: string;
  disabled?: boolean;

  onUpdate: (value: string) => void;
}
