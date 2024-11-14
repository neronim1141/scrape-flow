"use client";
import { FC, useCallback } from "react";
import { AppNode, TaskParameters } from "../type";
import { StringNodeField } from "./string";
import { useReactFlow } from "@xyflow/react";
import { BrowserInstanceNodeField } from "./browser-instance";

interface NodeFieldProps {
  param: TaskParameters;
  nodeId: string;
  disabled: boolean;
}
export const NodeField: FC<NodeFieldProps> = ({ param, nodeId, disabled }) => {
  const { updateNodeData, getNode } = useReactFlow<AppNode>();
  const node = getNode(nodeId);
  const value = node?.data.inputs?.[param.name];
  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue,
        },
      });
    },
    [updateNodeData, nodeId, param.name, node?.data.inputs]
  );
  switch (param.type) {
    case "STRING":
      return (
        <StringNodeField
          param={param}
          value={value}
          disabled={disabled}
          onUpdate={updateNodeParamValue}
        />
      );
    case "BROWSER_INSTANCE":
      return (
        <BrowserInstanceNodeField
          param={param}
          onUpdate={updateNodeParamValue}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      );
  }
};
