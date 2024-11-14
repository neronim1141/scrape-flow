import { BreadcrumbHeader } from "@/features/layout/breadcrumb-header";
import { DesktopSidebar } from "@/features/layout/sidebars/desktop-sidebar";
import { Separator } from "@/components/ui/separator";
import React, { FC, PropsWithChildren } from "react";
import { ModeToggle } from "@/features/theme/theme-toggle";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          <BreadcrumbHeader />
          <div className="gap-2 flex items-center">
            <ModeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
