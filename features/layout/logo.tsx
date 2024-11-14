import { cn } from "@/lib/utils";
import { SquareDashedMousePointer } from "lucide-react";
import Link from "next/link";
import React, { type FC } from "react";

interface LogoProps {
  fontSize?: string;
  iconSize?: number;
}
export const Logo: FC<LogoProps> = ({ fontSize = "2xl", iconSize = 20 }) => {
  return (
    <Link
      href="/"
      className={cn("text-2x font-extrabold flex items-center gap-2", fontSize)}
    >
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
        <SquareDashedMousePointer size={iconSize} className="stroke-white" />
      </div>
      <div>
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Flow
        </span>
        <span className="text-stone-700 dark:text-stone-300">Scrape</span>
      </div>
    </Link>
  );
};
