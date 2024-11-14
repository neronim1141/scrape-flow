"use client";
import React, { FC, PropsWithChildren } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export const ThemeProvider: FC<PropsWithChildren & ThemeProviderProps> = ({
  children,
  ...props
}) => {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};
