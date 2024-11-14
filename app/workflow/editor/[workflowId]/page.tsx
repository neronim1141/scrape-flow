import Editor from "@/features/workflows/workflow/editor/editor";
import { getWorkflow } from "@/features/workflows/workflow/editor/get-workflow.action";
import { auth } from "@clerk/nextjs/server";
import { NextPage } from "next";

const EditorPage: NextPage<{
  params: {
    workflowId: string;
  };
}> = async ({ params: { workflowId } }) => {
  const { userId } = await auth();
  if (!userId) return <div>unaunthenticated</div>;
  const workflow = await getWorkflow(workflowId);
  if (!workflow) return <div>Workflow not found</div>;
  return <Editor workflow={workflow} />;
};

export default EditorPage;
