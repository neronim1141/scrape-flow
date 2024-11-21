import { ExecutionLog } from "@/features/database/schema/execution-log";

export type Log = Pick<ExecutionLog, "level" | "message" | "timestamp">;
export type LogCollector = {
  getAll(): Log[];
} & {
  [K in Lowercase<ExecutionLog["level"]>]: (message: string) => void;
};
