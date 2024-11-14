import { db } from "@/features/database/db";
import { workflowsTable } from "@/features/database/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export const getWorkflow = async (id: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }
  const workflow = (
    await db
      .select()
      .from(workflowsTable)
      .where(and(eq(workflowsTable.userId, userId), eq(workflowsTable.id, id)))
  ).at(0);
  return workflow;
};
