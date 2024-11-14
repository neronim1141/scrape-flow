"use client";

import React from "react";
import { Logo } from "../logo";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "../routes";
import { useActiveRoute } from "./use-active-route";

export const DesktopSidebar = () => {
  const activeRoute = useActiveRoute();
  return (
    <div className="hidden relative md:block w-[280px] h-screen overflow-hidden bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2">
      <div className="flex items-center justify-center gap-2 border-b p-4">
        <Logo />
      </div>
      <div className="p-2">TODO CREDITS</div>
      <div className="flex flex-col p-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={buttonVariants({
              variant:
                activeRoute.href === route.href
                  ? "sidebarActiveItem"
                  : "sidebarItem",
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
