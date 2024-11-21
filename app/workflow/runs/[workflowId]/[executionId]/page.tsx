import { WorkflowTopbar } from "@/features/workflows/workflow/editor/workflow-top-bar";
import { getExecution } from "@/features/workflows/workflow/execution/get-execution.action";
import { ExecutionViewer } from "@/features/workflows/workflow/execution/viewer";
import { waitFor } from "@/lib/wait-for";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import { NextPage } from "next";
import { FC, Suspense } from "react";

const Page: NextPage<{
  params: {
    workflowId: string;
    executionId: string;
  };
}> = ({ params }) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <WorkflowTopbar
        title="Workflow run detaild"
        subtitle={`RUN ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="size-10 animate-spin text-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
};
export default Page;

const ExecutionViewerWrapper: FC<{ executionId: string }> = async ({
  executionId,
}) => {
  const workflowExecution = await getExecution(executionId);
  if (!workflowExecution) {
    return <div>Not found</div>;
  }
  return <ExecutionViewer initialData={workflowExecution} />;
};
