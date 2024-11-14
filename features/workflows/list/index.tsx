import React from "react";
import { getWorkflows } from "./get-workflows.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Inbox } from "lucide-react";
import { CreateWorkflowDialog } from "../create-workflow/dialog";
import { WorkflowListItem } from "./item";

export const WorkflowList = async () => {
  try {
    const workflows = await getWorkflows();
    if (workflows.length === 0)
      return (
        <div className="flex flex-col gap-4 h-full items-center justify-center">
          <div className="rounded-full bg-accent size-20 flex items-center justify-center">
            <Inbox size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold"> No workflow created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first workflow
            </p>
          </div>
          <CreateWorkflowDialog triggerText="Create your first workflow" />
        </div>
      );

    return (
      <div className="grid grid-cols-1 gap-4">
        {workflows.map((workflow) => (
          <WorkflowListItem key={workflow.id} workflow={workflow} />
        ))}
      </div>
    );
  } catch (e) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later
        </AlertDescription>
      </Alert>
    );
  }
};
