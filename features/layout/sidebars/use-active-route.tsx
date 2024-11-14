"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { routes } from "../routes";

export const useActiveRoute = () => {
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
  return activeRoute;
};
