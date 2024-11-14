import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "./type";

export const NodeHeader: FC<{
  task: Task;
}> = ({ task }) => {
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            TODO
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab"
            aria-label="drag handle"
          >
            <GripVertical size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
