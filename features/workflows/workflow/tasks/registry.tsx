import { Task, TaskType } from "../node/type";
import { LaunchBrowserTask } from "./launch-browser/config";

export const TaskRegistry: { [key in TaskType]: Task } = {
  LAUNCH_BROWSER: LaunchBrowserTask,
};
