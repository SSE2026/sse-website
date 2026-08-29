import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "success" | "warning" | "accent";

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-[#F4F4F5] text-[#52525B]",
  success: "bg-[#16A34A]/10 text-[#15803D]",
  warning: "bg-[#F59E0B]/10 text-[#B45309]",
  accent: "bg-[#2563EB]/10 text-[#1D4ED8]",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
