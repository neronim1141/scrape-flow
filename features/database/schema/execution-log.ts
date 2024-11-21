import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { timestamp, pgTable, text } from "drizzle-orm/pg-core";
import { cuid2 } from "drizzle-cuid2/postgres";
import { executionPhaseTable } from "./execution-phase";
import { logLevelEnum } from "./enums";

export const executionLogTable = pgTable("execution_log", {
  id: cuid2("id").defaultRandom().primaryKey(),
  level: logLevelEnum().notNull(),
  message: text().notNull(),

  timestamp: timestamp().notNull(),

  executionPhaseId: cuid2("executionPhaseId")
    .notNull()
    .references(() => executionPhaseTable.id, {
      onDelete: "cascade",
    }),
});
export const executionLogTableRelations = relations(
  executionLogTable,
  ({ one }) => ({
    executionPhase: one(executionPhaseTable, {
      fields: [executionLogTable.executionPhaseId],
      references: [executionPhaseTable.id],
    }),
  })
);

export type ExecutionLog = InferSelectModel<typeof executionLogTable>;
