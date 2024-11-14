"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Workflow } from "@/features/database/schema";
import { FC, useCallback, useState } from "react";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { deleteWorkflow } from "./delete-workflow.action";

const deleteWorkflowId = "delete-workflow";
interface DeleteWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: Workflow;
}
export const DeleteWorkflowDialog: FC<DeleteWorkflowDialogProps> = ({
  open,
  onOpenChange,
  workflow,
}) => {
  const [text, setText] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfuly", { id: deleteWorkflowId });
      setText("");
    },
    onError: () => {
      toast.error("Failed to delete workflow", { id: deleteWorkflowId });
    },
  });
  const onSubmit = useCallback(
    async (id: string) => {
      toast.loading("Deleting workflow...", { id: deleteWorkflowId });
      mutate(id);
    },
    [mutate]
  );

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        setText("");
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Label className="flex gap-1 items-center text-muted-foreground">
          Enter <b>{workflow.name}</b> to confirm
        </Label>
        <Input onChange={(e) => setText(e.target.value)} />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            disabled={workflow.name !== text || isPending}
            onClick={(e) => {
              e.stopPropagation();
              onSubmit(workflow.id);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
