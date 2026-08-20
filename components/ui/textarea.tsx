"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

/* ============================================
   Textarea Component - Swift Safe Energy
   ============================================ */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, showCount, maxLength, value, id, required, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 0
    );
    const hasError = !!error;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
            {label}
            {required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}

        <textarea
          id={id}
          value={value}
          className={cn(
            "flex min-h-[120px] w-full rounded-lg border bg-[#0F172A]",
            "px-4 py-3 text-sm text-[#F9FAFB] placeholder:text-[#64748B]",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y",
            hasError
              ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30"
              : "border-[#334155] hover:border-[#475569] focus:border-[#F59E0B] focus:ring-[#F59E0B]/30",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />

        {/* Character count and error/hint */}
        <div className="mt-1.5 flex items-center justify-between">
          {error ? (
            <p id={`${id}-error`} className="text-sm text-[#EF4444] flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          ) : hint ? (
            <p id={`${id}-hint`} className="text-sm text-[#64748B]">
              {hint}
            </p>
          ) : (
            <span />
          )}

          {showCount && maxLength && (
            <span className={cn(
              "text-sm",
              charCount >= maxLength ? "text-[#EF4444]" : "text-[#64748B]"
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
