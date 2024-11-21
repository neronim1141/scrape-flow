"use server";

import { db } from "@/features/database/db";
import {
  ExecutionPhase,
  executionPhaseTable,
  WorkflowExecution,
  workflowsExecutionTable,
} from "@/features/database/schema";
import { auth } from "@clerk/nextjs/server";
import { and, asc, eq } from "drizzle-orm";

export const getExecution = async (
  id: WorkflowExecution["id"],
  options: Partial<{
    withPhases: Boolean;
  }> = { withPhases: true }
) => {
  if (!options.withPhases) throw new Error("Not Implemented");
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }
  return db.query.workflowsExecutionTable.findFirst({
    where: and(
      eq(workflowsExecutionTable.id, id),
      eq(workflowsExecutionTable.userId, userId)
    ),
    with: {
      phases: {
        orderBy: (phase, { asc }) => asc(phase.phase),
        with: {
          logs: {
            orderBy: (logs, { asc }) => asc(logs.timestamp),
          },
        },
      },
    },
  });
};

export const getExecutionPhase = async (id: ExecutionPhase["id"]) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }
  return db.query.executionPhaseTable.findFirst({
    where: and(
      eq(executionPhaseTable.id, id),
      eq(executionPhaseTable.userId, userId)
    ),
    with: {
      logs: {
        orderBy: (logs, { asc }) => asc(logs.timestamp),
      },
    },
  });
};
