import { ExtractTextFromElementTask } from "./extract-text-from-element/config";
import { LaunchBrowserTask } from "./launch-browser/config";
import { PageToHtmlTask } from "./page-to-html/config";
import { Task, TaskType } from "./type";

export const TaskRegistry: { [K in TaskType]: Task & { type: K } } = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
};
