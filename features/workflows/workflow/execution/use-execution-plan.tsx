import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { AppNode } from "../node/type";
import { flowToExecutionPlan } from "./executionPlan";
import { flowToExecutionPlan as flowToExecutionPlan2 } from "./executionPlan-mine";
import { useFlowValidation } from "../editor/flow-validation.context";
import { toast } from "sonner";

export const useExecutionPlan = () => {
  const { toObject } = useReactFlow<AppNode>();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  return useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = flowToExecutionPlan(nodes, edges);
    const { executionPlan: executionPlan2 } = flowToExecutionPlan2(
      nodes,
      edges
    );
    console.log(
      "both execution approaches return same result:",
      JSON.stringify(executionPlan) === JSON.stringify(executionPlan2)
    );
    if (error) {
      switch (error.type) {
        case "NO_ENTRY_POINT":
          toast.error("No entry point found");
          break;
        case "INVALID_INPUTS":
          toast.error("Not all inputs values are set");
          setInvalidInputs(error.invalidElements);
          break;
        default:
          toast.error("Something went wrong");
      }
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, setInvalidInputs, clearErrors]);
};
