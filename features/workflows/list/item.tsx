import React, { FC } from "react";
import type { Workflow } from "../../database/schema";
import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon, PlayIcon, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { WorkflowActions } from "./item-actions";

const statusColors = {
  DRAFT: "bg-yellow-400 text-yellow-600",
  PUBLISHED: "bg-primary",
} as const;

interface WorkflowListItemProps {
  workflow: Workflow;
}
export const WorkflowListItem: FC<WorkflowListItemProps> = ({ workflow }) => {
  const isDraft = workflow.status === "DRAFT";
  return (
    <Card className="border shadow-sm rounded-lg overflow-hidden hover:shadow-sm dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "size-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="size-5" />
            ) : (
              <PlayIcon className="size-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "flex items-center gap-2",
            })}
          >
            <Shuffle size={16} />
            Edit
          </Link>
          <WorkflowActions workflow={workflow} />
        </div>
      </CardContent>
    </Card>
  );
};
