"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon, ChevronLeftIcon, PlayIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { FC, useCallback } from "react";
import { updateWorkflow } from "./update-workflow.action";
import { toast } from "sonner";
import { AppNode } from "../node/type";
import { useExecutionPlan } from "../execution/use-execution-plan";
const saveWorkflowId = "save-workflow";
const executeWorkflowId = "save-workflow";

interface FlowHeaderProps {
  title: string;
  subtitle?: string;
}
export const FlowHeader: FC<FlowHeaderProps> = ({ title, subtitle }) => {
  const router = useRouter();
  const { toObject } = useReactFlow<AppNode>();
  const generateExecutionPlan = useExecutionPlan();
  const { workflowId } = useParams<{ workflowId?: string }>();
  if (!workflowId)
    throw new Error(
      "This component should be used within dynamic [workflowId] segment"
    );
  const { mutate: mutateSave, isPending: saveIsPending } = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved", { id: saveWorkflowId });
    },
    onError: () => {
      toast.error("Failed to save workflow", { id: saveWorkflowId });
    },
  });
  const onSave = useCallback(async () => {
    toast.loading("Saving workflow", { id: saveWorkflowId });
    mutateSave({ id: workflowId, definition: toObject() });
  }, [mutateSave, workflowId, toObject]);

  const { mutate: mutateExecute, isPending: executionIsPending } = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow Executed", { id: executeWorkflowId });
    },
    onError: () => {
      toast.error("Failed to execute workflow", { id: executeWorkflowId });
    },
  });
  const onExecute = useCallback(async () => {
    // toast.loading("Executing workflow", { id: executeWorkflowId });
    const executionPlan = generateExecutionPlan();
    // mutateSave({ id: workflowId, definition: toObject() });
  }, [generateExecutionPlan]);

  return (
    <header className="flex p-2 border-b-2 justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Go back"
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeftIcon size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Back</TooltipContent>
        </Tooltip>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate text-ellipsis">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onExecute}
          disabled={executionIsPending}
        >
          <PlayIcon size={16} className="stroke-orange-400" /> Execute
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onSave}
          disabled={saveIsPending}
        >
          <CheckIcon size={16} className="stroke-green-400" /> Save
        </Button>
      </div>
    </header>
  );
};
