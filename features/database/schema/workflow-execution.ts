import { relations, type InferSelectModel } from "drizzle-orm";
import { timestamp, pgTable, text, integer } from "drizzle-orm/pg-core";
import { cuid2 } from "drizzle-cuid2/postgres";
import { workflowsTable } from "./workflow";
import { executionPhaseTable } from "./execution-phase";
import { executionStatusEnum, triggerEnum } from "./enums";

export const workflowsExecutionTable = pgTable("workflow_execution", {
  id: cuid2("id").defaultRandom().primaryKey(),
  userId: text(),
  workflowId: cuid2("workflowId")
    .notNull()
    .references(() => workflowsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  trigger: triggerEnum(),
  status: executionStatusEnum(),
  createdAt: timestamp().defaultNow().notNull(),
  creditsConsumed: integer().default(0),
  startedAt: timestamp(),
  completedAt: timestamp(),
});
export const workflowExecutionRelations = relations(
  workflowsExecutionTable,
  ({ one, many }) => ({
    workflow: one(workflowsTable, {
      fields: [workflowsExecutionTable.workflowId],
      references: [workflowsTable.id],
    }),
    phases: many(executionPhaseTable),
  })
);

export type WorkflowExecution = InferSelectModel<
  typeof workflowsExecutionTable
>;
