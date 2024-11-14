"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { FC, useId, useState } from "react";
import { NodeFieldProps } from "../type";

interface StringNodeFieldProps extends NodeFieldProps {}
export const StringNodeField: FC<StringNodeFieldProps> = ({
  param,
  value,
  onUpdate,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const id = useId();
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name} {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Input
        id={id}
        className="text-xs"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => onUpdate(e.target.value)}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
};
