"use client";
import React, { FC } from "react";
import { NodeFieldProps } from "../type";

interface BrowserInstanceNodeField extends NodeFieldProps {}
export const BrowserInstanceNodeField: FC<BrowserInstanceNodeField> = ({
  param,
}) => {
  return <p>{param.name}</p>;
};
