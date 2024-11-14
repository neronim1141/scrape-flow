"use client";
import React, { FC, useState } from "react";
import type { Workflow } from "../../database/schema";
import { MoreVertical, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteWorkflowDialog } from "../delete-workflow/dialog";

interface WorkflowActionsProps {
  workflow: Workflow;
}
export const WorkflowActions: FC<WorkflowActionsProps> = ({ workflow }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <div>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>More actions</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => setShowDeleteDialog(true)}
          >
            <TrashIcon size={16} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        workflow={workflow}
      />
    </div>
  );
};
