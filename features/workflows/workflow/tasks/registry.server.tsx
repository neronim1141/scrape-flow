import { ExecutionEnvironment } from "../execution/type";
import { extractTextFromElementExecutor } from "./extract-text-from-element/executor";
import { launchBrowserExecutor } from "./launch-browser/executor";
import { pageToHTMLExecutor } from "./page-to-html/executor";
import { Task, TaskType } from "./type";

export const ExecutionRegistry: {
  [K in TaskType]: (
    environment: ExecutionEnvironment<Task & { type: K }>
  ) => Promise<boolean>;
} = {
  LAUNCH_BROWSER: launchBrowserExecutor,
  PAGE_TO_HTML: pageToHTMLExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
};
