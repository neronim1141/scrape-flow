"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { getQueryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { FC, PropsWithChildren, useState } from "react";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(getQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
};
