import { sql, type InferSelectModel } from "drizzle-orm";
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

export const statusEnum = pgEnum("workflow_status", ["DRAFT", "PUBLISHED"]);
export const workflowsTable = pgTable(
  "workflow",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    userId: text(),
    name: text().notNull(),
    description: text(),
    definition: json().$type<ReactFlowJsonObject<AppNode> | null>(),
    status: statusEnum().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp({ mode: "date", precision: 3 }).$onUpdate(
      () => new Date()
    ),
  },
  (t) => [unique().on(t.userId, t.name)]
);
export type Workflow = InferSelectModel<typeof workflowsTable>;
