"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DragEvent, FC } from "react";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "../tasks/registry";
import { TaskType } from "../tasks/type";

const TaskMenuButton: FC<{ type: TaskType }> = ({ type }) => {
  const task = TaskRegistry[type];
  const onDragStart = (event: DragEvent, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <Button
      variant="secondary"
      className="flex justify-between items-center gap-2 border w-full"
      draggable
      onDragStart={(e) => {
        onDragStart(e, type);
      }}
    >
      <div className="flex gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
    </Button>
  );
};

export const TaskMenu = () => {
  return (
    <aside className="w-[340px] border-r-2 h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction"]}
      >
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton type="PAGE_TO_HTML" />
            <TaskMenuButton type="EXTRACT_TEXT_FROM_ELEMENT" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};
