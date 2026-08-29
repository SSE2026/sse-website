"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";

interface MediaUploaderProps {
  /** Called with the uploaded URL after a successful Cloudinary upload. */
  onUploaded: (url: string) => void;
  /** Existing URL to show as the current value (preview). */
  value?: string | null;
  /** Cloudinary folder to target. Default "products". */
  folder?: string;
  /** Allow video uploads too. */
  allowVideo?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

export function MediaUploader({
  onUploaded,
  value,
  folder = "products",
  allowVideo = false,
  disabled = false,
  compact = false,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = () => inputRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError((data as { error?: string }).error || "Upload failed");
        return;
      }
      onUploaded((data as { url?: string }).url || "");
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const accept = allowVideo
    ? "image/jpeg,image/png,image/webp,video/mp4,video/webm"
    : "image/jpeg,image/png,image/webp";

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={pick}
          disabled={disabled || uploading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-dashed border-[#E4E4E7] bg-[#FAFAFA] text-[#71717A] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Upload media"
          title="Upload"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFile}
            disabled={disabled || uploading}
            className="hidden"
          />
          {value ? (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#F4F4F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-xs text-[#52525B]">{value}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <button
                    type="button"
                    onClick={pick}
                    disabled={disabled || uploading}
                    className="text-[11px] font-medium text-[#2563EB] hover:underline disabled:opacity-50"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onUploaded("")}
                    disabled={disabled}
                    className="text-[11px] font-medium text-[#DC2626] hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={pick}
              disabled={disabled || uploading}
              className={`flex w-full items-center gap-2 rounded-md border border-dashed border-[#E4E4E7] bg-white text-[#71717A] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-50 ${compact ? "px-3 py-1.5 text-xs" : "px-3 py-2 text-sm"}`}
            >
              <ImageIcon className="h-4 w-4" strokeWidth={1.5} />
              {uploading ? "Uploading…" : "Upload image"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#DC2626]">{error}</p>
      )}
    </div>
  );
}
