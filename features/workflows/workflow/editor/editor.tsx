"use client";
import type { Workflow } from "@/features/database/schema";
import { FC } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./flow-editor";
import { FlowHeader } from "./flow-header";
import { TaskMenu } from "./task-menu";

interface EditorProps {
  workflow: Workflow;
}
const Editor: FC<EditorProps> = ({ workflow }) => {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <FlowHeader title="Workflow editor" subtitle={workflow.name} />
        <section className="flex h-full overflow-auto">
          <TaskMenu />
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
};

export default Editor;
