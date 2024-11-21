import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { timestamp, pgTable, text, integer, json } from "drizzle-orm/pg-core";
import { cuid2 } from "drizzle-cuid2/postgres";
import { workflowsExecutionTable } from "./workflow-execution";
import { AppNode } from "@/features/workflows/workflow/node/type";
import { executionPhaseStatusEnum } from "./enums";
import { executionLogTable } from "./execution-log";

export const executionPhaseTable = pgTable("execution_phase", {
  id: cuid2("id").defaultRandom().primaryKey(),
  userId: text().notNull(),
  status: executionPhaseStatusEnum().notNull(),
  phase: integer().notNull(),
  node: json().$type<AppNode>().notNull(),
  name: text().notNull(),
  startedAt: timestamp(),
  completedAt: timestamp(),
  inputs: json().$type<Record<string, string> | null>().default(null),
  outputs: json().$type<Record<string, string> | null>().default(null),
  creditsConsumed: integer(),
  workflowExecutionId: cuid2("workflowExecutionId")
    .notNull()
    .references(() => workflowsExecutionTable.id, {
      onDelete: "cascade",
    }),
});
export const executionPhaseRelations = relations(
  executionPhaseTable,
  ({ one, many }) => ({
    workflowExecution: one(workflowsExecutionTable, {
      fields: [executionPhaseTable.workflowExecutionId],
      references: [workflowsExecutionTable.id],
    }),
    logs: many(executionLogTable),
  })
);

export type ExecutionPhase = InferSelectModel<typeof executionPhaseTable>;
export type ExecutionPhaseInsert = InferInsertModel<typeof executionPhaseTable>;
