"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { FC, useEffect, useId, useState } from "react";
import { NodeFieldProps } from "../type";
import { Textarea } from "@/components/ui/textarea";

interface StringNodeFieldProps extends NodeFieldProps {}
export const StringNodeField: FC<StringNodeFieldProps> = ({
  param,
  value = "",
  disabled = false,
  onUpdate,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);
  const id = useId();
  const Control = param.variant === "textarea" ? Textarea : Input;
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name} {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Control
        id={id}
        disabled={disabled}
        aria-labelledby={id}
        className="text-xs"
        placeholder="Enter value"
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
