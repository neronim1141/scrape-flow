import { Browser, Page } from "puppeteer";
import { AppNode, AppNodeMissingInputs } from "../node/type";
import { Task } from "../tasks/type";
import { LogCollector } from "../log/type";

export type ExecutionPlan = {
  phase: number;
  nodes: AppNode[];
};

export type ExecutionPlanError =
  | {
      type: "NO_ENTRY_POINT";
    }
  | {
      type: "INVALID_INPUTS";

      invalidElements: AppNodeMissingInputs[];
    };

export type WorkflowEnvironment = {
  browser?: Browser;
  page?: Page;
  phases: Record<
    AppNode["id"],
    {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    }
  >;
};

export type ExecutionEnvironment<T extends Task = Task> = {
  getInput: (name: T["inputs"][number]["name"]) => string;
  setOutput: (name: T["outputs"][number]["name"], value: string) => string;
  getBrowser: () => Browser | undefined;
  setBrowser: (browser: Browser) => void;
  getPage: () => Page | undefined;
  setPage: (page: Page) => void;
  log: LogCollector;
};
