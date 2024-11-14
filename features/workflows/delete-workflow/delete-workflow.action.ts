"use server";

import { db } from "@/features/database/db";
import { workflowsTable } from "@/features/database/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteWorkflow = async (id: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }
  await db
    .delete(workflowsTable)
    .where(and(eq(workflowsTable.id, id), eq(workflowsTable.userId, userId)));
  revalidatePath("/workflows");
  revalidatePath("/workflow");
};
