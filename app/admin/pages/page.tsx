"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, FileText, Loader2 } from "lucide-react";
import { PAGE_DEFS } from "@/lib/cms/pages";
import { adminFetch } from "@/lib/api/admin-fetch";

interface PageRow {
  page: string;
  locales: Array<{ locale: string; published: boolean; updatedAt: string }>;
}

export default function PagesListPage() {
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminFetch("/api/admin/content", { signal: ctl.signal, cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          setError((json as { error?: string }).error || "Failed to load pages");
          return;
        }
        const body = (json?.data ?? json) as { items?: PageRow[] };
        setRows(body.items ?? []);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctl.abort();
  }, []);

  const editedMap = new Map(rows.map((r) => [r.page, r]));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]" style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}>
          页面内容管理
        </h1>
        <p className="mt-1 text-sm text-[#71717A]">按语言编辑各页面内容。</p>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#71717A]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm">加载中…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PAGE_DEFS.map((def) => {
            const row = editedMap.get(def.key);
            const en = row?.locales.find((l) => l.locale === "en");
            const zh = row?.locales.find((l) => l.locale === "zh");
            return (
              <Link
                key={def.key}
                href={`/admin/pages/${def.key}`}
                className="group rounded-xl border border-[#E4E4E7] bg-white p-5 transition-all hover:border-[#0A0A0A] hover:shadow-[0_2px_8px_-2px_rgba(10,10,10,0.08)]"
              >
                <div className="flex items-start justify-between">
                  <FileText className="h-5 w-5 text-[#52525B]" strokeWidth={1.75} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                    {def.sections.length} 个区块
                  </span>
                </div>
                <h2 className="mt-3 text-sm font-semibold text-[#0A0A0A]">{def.label}</h2>
                <p className="text-xs text-[#A1A1AA]">{def.labelZh}</p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-[#71717A]">
                  <span className={en ? "inline-flex items-center gap-1" : ""}>
                    EN
                    {en && (
                      <span className={`ml-1 rounded-sm px-1 ${en.published ? "bg-[#16A34A]/10 text-[#15803D]" : "bg-[#F4F4F5] text-[#71717A]"}`}>
                        {en.published ? "已启用" : "停用"}
                      </span>
                    )}
                  </span>
                  <span>中文</span>
                  {zh && (
                    <span className={`rounded-sm px-1 ${zh.published ? "bg-[#16A34A]/10 text-[#15803D]" : "bg-[#F4F4F5] text-[#71717A]"}`}>
                      {zh.published ? "已启用" : "停用"}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
