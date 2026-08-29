"use client";

import { Zap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "mark";
  className?: string;
}

export function Logo({ size = "md", variant = "full", className }: LogoProps) {
  const dims = {
    sm: { box: "h-7 w-7", icon: "h-3.5 w-3.5", text: "text-sm" },
    md: { box: "h-8 w-8", icon: "h-4 w-4", text: "text-base" },
    lg: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-lg" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className || ""}`}>
      <div
        className={`${dims.box} rounded-md bg-[#0A0A0A] flex items-center justify-center`}
        aria-hidden
      >
        <Zap className={`${dims.icon} text-white`} strokeWidth={2.5} />
      </div>
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span
            className={`${dims.text} font-semibold tracking-tight text-[#0A0A0A]`}
            style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
          >
            Swift Safe Energy
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#71717A] mt-0.5">
            管理后台
          </span>
        </div>
      )}
    </div>
  );
}
