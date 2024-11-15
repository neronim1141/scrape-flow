import { AppNode, AppNodeMissingInputs } from "../node/type";

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
