import React, { useState } from "react";
import { useActiveRoute } from "./use-active-route";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { Logo } from "../logo";
import { routes } from "../routes";
import Link from "next/link";

export const MobileSidebar = () => {
  const activeRoute = useActiveRoute();
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="block bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-y-4"
            side="left"
          >
            <Logo />
            <div className="flex flex-col gap-1">
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
                  onClick={() => setOpen(false)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};
