import { LucideProps } from "lucide-react";
import { FC } from "react";

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
  icon: FC<LucideProps>;
  isEntryPoint: boolean;
  inputs: TaskParameters[];
  outputs: TaskParameters[];
  credits: number;
}
