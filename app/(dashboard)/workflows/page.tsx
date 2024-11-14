import { CreateWorkflowDialog } from "@/features/workflows/create-workflow/dialog";
import { WorkflowList } from "@/features/workflows/list";
import { WorkflowListSkeleton } from "@/features/workflows/list/skeleton";
import React, { Suspense } from "react";

const WorkflowsPage = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<WorkflowListSkeleton />}>
          <WorkflowList />
        </Suspense>
      </div>
    </div>
  );
};
export default WorkflowsPage;
