"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon, ChevronLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { FC, useCallback } from "react";
import { updateWorkflow } from "./update-workflow.action";
import { toast } from "sonner";
import { AppNode } from "../node/type";
const saveWorkflowId = "save-workflow";

interface FlowHeaderProps {
  title: string;
  subtitle?: string;
}
export const FlowHeader: FC<FlowHeaderProps> = ({ title, subtitle }) => {
  const router = useRouter();
  const { toObject } = useReactFlow<AppNode>();
  const { workflowId } = useParams<{ workflowId?: string }>();
  if (!workflowId)
    throw new Error(
      "This component should be used within dynamic [workflowId] segment"
    );
  const { mutate, isPending } = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved", { id: saveWorkflowId });
    },
    onError: () => {
      toast.error("Failed to save workflow", { id: saveWorkflowId });
    },
  });
  const onSubmit = useCallback(async () => {
    toast.loading("Saving workflow", { id: saveWorkflowId });
    mutate({ id: workflowId, definition: toObject() });
  }, [mutate, workflowId, toObject]);

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
          onClick={onSubmit}
          disabled={isPending}
        >
          <CheckIcon size={16} className="stroke-green-400" /> Save
        </Button>
      </div>
    </header>
  );
};
