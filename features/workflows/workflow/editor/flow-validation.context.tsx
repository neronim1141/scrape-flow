import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { AppNodeMissingInputs } from "../node/type";

type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
};
const FlowValidationContext = createContext<FlowValidationContextType | null>(
  null
);

export const FlowValidationContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    []
  );
  const clearErrors = () => {
    setInvalidInputs([]);
  };
  return (
    <FlowValidationContext.Provider
      value={{
        invalidInputs,
        setInvalidInputs,
        clearErrors,
      }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
};
export const useFlowValidation = () => {
  const ctx = useContext(FlowValidationContext);
  if (!ctx)
    throw new Error(
      "Use Flow Validation must be used within a FlowValidationContext"
    );
  return ctx;
};
