"use client";
import type { Workflow } from "@/features/database/schema";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import React, { FC } from "react";
import "@xyflow/react/dist/style.css";
import { FlowScrapeNode } from "./node";

const nodeTypes = {
  FlowScrapeNode: FlowScrapeNode,
};
const snapGrid: [number, number] = [25, 25];
const fitViewOptions = {
  padding: 1,
};

interface FlowEditorProps {
  workflow: Workflow;
}
const FlowEditor: FC<FlowEditorProps> = ({ workflow }) => {
  const [nodes, _setNodes, onNodesChange] = useNodesState(
    workflow.definition?.nodes ?? []
  );
  const [edges, _setEdges, onEdgesChange] = useEdgesState(
    workflow.definition?.edges ?? []
  );

  return (
    <main className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        snapGrid={snapGrid}
        snapToGrid
        fitView
        fitViewOptions={fitViewOptions}
      >
        <Controls position="top-left"></Controls>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
