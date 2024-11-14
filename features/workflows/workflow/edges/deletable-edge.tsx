"use client";

import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";
import { FC } from "react";
import { AppNode } from "../node/type";

export const DeletableEdge: FC<EdgeProps> = (props) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { setEdges } = useReactFlow<AppNode>();
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      {props.selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="absolute pointer-events-auto"
          >
            <Button
              variant="outline"
              size="icon"
              className="size-6 rounded-full"
              onClick={() => {
                setEdges((edges) => edges.filter((e) => e.id !== props.id));
              }}
            >
              <X />
            </Button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
