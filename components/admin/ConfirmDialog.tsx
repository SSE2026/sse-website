"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm"
        onClick={busy ? undefined : onCancel}
      />
      <div className="relative w-full max-w-md rounded-xl border border-[#E4E4E7] bg-white p-6 shadow-[0_10px_40px_-10px_rgba(10,10,10,0.25)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          aria-label="Close"
          className="absolute right-3 top-3 rounded p-1 text-[#A1A1AA] transition-colors hover:bg-[#F4F4F5] hover:text-[#0A0A0A] disabled:opacity-50"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              tone === "danger" ? "bg-[#DC2626]/10 text-[#DC2626]" : "bg-[#2563EB]/10 text-[#2563EB]",
            )}
          >
            <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3
              id="confirm-title"
              className="text-base font-semibold tracking-tight text-[#0A0A0A]"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
            >
              {title}
            </h3>
            {description && (
              <div className="mt-1.5 text-sm text-[#52525B]">{description}</div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-9 rounded-md border border-[#E4E4E7] bg-white px-3 text-sm font-medium text-[#52525B] transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-white transition-colors disabled:opacity-60",
              tone === "danger"
                ? "bg-[#DC2626] hover:bg-[#B91C1C]"
                : "bg-[#0A0A0A] hover:bg-[#27272A]",
            )}
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
