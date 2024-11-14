import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const WorkflowListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
};
