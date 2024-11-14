"use server";
import { auth } from "@clerk/nextjs/server";
import { CreateWorkflowFormData, createWorkflowSchema } from "./schema";
import { db } from "@/features/database/db";
import { workflowsTable } from "@/features/database/schema";
import { redirect } from "next/navigation";
import { ReactFlowJsonObject } from "@xyflow/react";
import { AppNode } from "../workflow/node/type";
import { createNode } from "../workflow/create-node";

const initialFlow: ReactFlowJsonObject<AppNode> = {
  edges: [],
  nodes: [createNode("LAUNCH_BROWSER")],
  viewport: { x: 0, y: 0, zoom: 1 },
};

export const createWorkflow = async (form: CreateWorkflowFormData) => {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) throw new Error("invalid form data");
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }

  const result = (
    await db
      .insert(workflowsTable)
      .values({
        userId,
        definition: initialFlow,
        status: "DRAFT",
        ...data,
      })
      .returning()
  ).at(0);
  if (!result) throw new Error("failed to create workflow");
  redirect(`/workflow/editor/${result.id}`);
};
