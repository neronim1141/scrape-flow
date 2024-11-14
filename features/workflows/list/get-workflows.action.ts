import { db } from "@/features/database/db";
import { workflowsTable } from "@/features/database/schema";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";

export async function getWorkflows() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }
  return db
    .select()
    .from(workflowsTable)
    .where(eq(workflowsTable.userId, userId))
    .orderBy(asc(workflowsTable.createdAt));
}
