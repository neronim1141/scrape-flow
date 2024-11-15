"use client";
import type { Workflow } from "@/features/database/schema";
import { FC } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./flow-editor";
import { FlowHeader } from "./flow-header";
import { TaskMenu } from "./task-menu";
import { FlowValidationContextProvider } from "./flow-validation.context";

interface EditorProps {
  workflow: Workflow;
}
const Editor: FC<EditorProps> = ({ workflow }) => {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <FlowHeader title="Workflow editor" subtitle={workflow.name} />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
};

export default Editor;
