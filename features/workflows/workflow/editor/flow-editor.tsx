"use client";
import type { Workflow } from "@/features/database/schema";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  IsValidConnection,
  MarkerType,
  MiniMap,
  OnReconnect,
  ReactFlow,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { DragEvent, FC, useCallback, useRef } from "react";
import "@xyflow/react/dist/style.css";
import { FlowScrapeNode } from "../node";
import { createNode } from "./create-node";
import { AppNode } from "../node/type";
import { DeletableEdge } from "../edges/deletable-edge";
import { TaskRegistry } from "../tasks/registry";
import { TaskType } from "../tasks/type";

const nodeTypes = {
  FlowScrapeNode: FlowScrapeNode,
};
const edgeTypes = {
  default: DeletableEdge,
};
const snapGrid: [number, number] = [25, 25];
const fitViewOptions = {
  padding: 1,
};

interface FlowEditorProps {
  workflow: Workflow;
}
const FlowEditor: FC<FlowEditorProps> = ({ workflow }) => {
  const edgeReconnectSuccessful = useRef(true);
  const { screenToFlowPosition, updateNodeData } = useReactFlow<AppNode>();
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow.definition?.nodes ?? []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow.definition?.edges ?? []
  );
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === undefined || !type) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = createNode(type as TaskType, position);
      setNodes((nodes) => nodes.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) =>
        addEdge(
          {
            ...connection,
            markerEnd: {
              type: MarkerType.Arrow,
            },
          },
          edges
        )
      );
      if (!connection.targetHandle) return;
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      delete nodeInputs?.[connection.targetHandle];
      updateNodeData(node.id, {
        inputs: nodeInputs,
      });
    },
    [setEdges, nodes, updateNodeData]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeReconnectSuccessful.current = true;
    },
    [setEdges]
  );
  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      //No self-connections allowed
      if (connection.source === connection.target) return false;
      //Same taskParam type connection
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);
      if (!sourceNode || !targetNode) {
        console.error("Invalid connection: source or target node not found");
        return false;
      }
      const sourceTask = TaskRegistry[sourceNode.data.type];
      const targetTask = TaskRegistry[targetNode.data.type];
      const output = sourceTask.outputs.find(
        (output) => output.name === connection.sourceHandle
      );
      const input = targetTask.inputs.find(
        (input) => input.name === connection.targetHandle
      );
      if (output?.type !== input?.type) {
        console.error("Invalid connection: type mismatch");
        return false;
      }
      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };
      if (hasCycle(targetNode)) {
        console.error("Invalid connection: cycle detected");
        return false;
      }

      return true;
    },
    [nodes, edges]
  );

  return (
    <main className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapGrid={snapGrid}
        snapToGrid
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left"></Controls>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
