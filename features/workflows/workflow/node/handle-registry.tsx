import { TaskParameters } from "../tasks/type";

export const HandleRegistry: Record<TaskParameters["type"], string> = {
  BROWSER_INSTANCE: "!bg-sky-400",
  STRING: "!bg-amber-400",
};
