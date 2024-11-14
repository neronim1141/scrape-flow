import { Task, TaskParameters, TaskType } from "../node/type";
import { ExtractTextFromElementTask } from "./extract-text-from-element/config";
import { LaunchBrowserTask } from "./launch-browser/config";
import { PageToHtmlTask } from "./page-to-html/config";

export const TaskRegistry: Record<TaskType, Task> = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
};
export const ColorRegistry: Record<TaskParameters["type"], string> = {
  BROWSER_INSTANCE: "!bg-sky-400",
  STRING: "!bg-amber-400",
};
