import { Log, LogCollector } from "./type";
import { logLevelEnum } from "@/features/database/schema";

export const createLogCollector = (): LogCollector => {
  const logs: Log[] = [];
  const getAll = () => logs;
  const logFunction = (level: Lowercase<Log["level"]>) => (message: string) => {
    console[level](message);
    logs.push({
      level: level.toUpperCase() as Log["level"],
      message,
      timestamp: new Date(),
    });
  };
  return {
    getAll,
    ...logLevelEnum.enumValues
      .map((s) => s.toLowerCase() as Lowercase<Log["level"]>)
      .reduce(
        (acc, cur) => ({ ...acc, [cur]: logFunction(cur) }),
        {} as Omit<LogCollector, "getAll">
      ),
  };
};
