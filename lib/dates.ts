import { intervalToDuration } from "date-fns";
export const getTimeDuration = (
  endDate?: Date | null,
  startDate?: Date | null
) => {
  if (!startDate || !endDate) return null;
  const timeElapsed = endDate.getTime() - startDate.getTime();
  if (timeElapsed < 1000) {
    return `${timeElapsed}ms`;
  }
  const duration = intervalToDuration({ end: timeElapsed, start: 0 });
  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
};
