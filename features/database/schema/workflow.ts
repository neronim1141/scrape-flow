import { relations, sql, type InferSelectModel } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  unique,
  pgEnum,
  json,
} from "drizzle-orm/pg-core";
import { cuid2 } from "drizzle-cuid2/postgres";
import { ReactFlowJsonObject } from "@xyflow/react";
import { AppNode } from "@/features/workflows/workflow/node/type";
import { workflowsExecutionTable } from "./workflow-execution";
import { executionStatusEnum, statusEnum } from "./enums";

export const workflowsTable = pgTable(
  "workflow",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    userId: text(),
    name: text().notNull(),
    description: text(),
    definition: json().$type<ReactFlowJsonObject<AppNode> | null>(),
    status: statusEnum().notNull(),
    lastRunAt: timestamp(),
    lastRunId: text(),
    lastRunStatus: executionStatusEnum(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp({ mode: "date", precision: 3 }).$onUpdate(
      () => new Date()
    ),
  },
  (t) => [unique().on(t.userId, t.name)]
);
export const workflowRelations = relations(workflowsTable, ({ many }) => ({
  executions: many(workflowsExecutionTable),
}));
export type Workflow = InferSelectModel<typeof workflowsTable>;
