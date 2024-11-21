import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("workflow_status", ["DRAFT", "PUBLISHED"]);
export const triggerEnum = pgEnum("workflow_trigger", ["MANUAL"]);
export const executionStatusEnum = pgEnum("execution_status", [
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "PENDING",
]);

export const executionPhaseStatusEnum = pgEnum("execution_phase_status", [
  "CREATED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "PENDING",
]);
export const logLevelEnum = pgEnum("log_level", ["INFO", "ERROR"]);
