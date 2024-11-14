import { Logo } from "@/features/layout/logo";
import { ModeToggle } from "@/features/theme/theme-toggle";
import React, { FC, PropsWithChildren } from "react";

const layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-screen">
      {children}
      <footer className="flex items-center justify-between p-2 border border-t-2">
        <Logo iconSize={16} fontSize="text-xl" />
        <ModeToggle />
      </footer>
    </div>
  );
};

export default layout;
