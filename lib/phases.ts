import { ExecutionPhase } from "@/features/database/schema";

export const getPhasesTotalCost = (
  phases: Pick<ExecutionPhase, "creditsConsumed">[] = []
) => {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
};
