"use server";

import { db } from "@/features/database/db";
import { workflowsTable } from "@/features/database/schema";
import { auth } from "@clerk/nextjs/server";
import { ReactFlowJsonObject } from "@xyflow/react";
import { and, eq } from "drizzle-orm";
import { AppNode } from "./node/type";
import { revalidatePath } from "next/cache";

export const updateWorkflow = async ({
  id,
  definition,
}: {
  id: string;
  definition: ReactFlowJsonObject<AppNode>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }
  const workflow = (
    await db
      .select()
      .from(workflowsTable)
      .where(and(eq(workflowsTable.id, id), eq(workflowsTable.userId, userId)))
  ).at(0);
  if (!workflow) throw new Error("Workflow not found");
  if (workflow.status !== "DRAFT") throw new Error("Workflow is not a draft");
  await db
    .update(workflowsTable)
    .set({
      definition,
    })
    .where(and(eq(workflowsTable.id, id), eq(workflowsTable.userId, userId)));
  revalidatePath("/workflows");
  revalidatePath("/workflow");
};
