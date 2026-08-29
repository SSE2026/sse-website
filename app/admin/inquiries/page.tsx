"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Inbox,
  Loader2,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

type InquiryStatus =
  | "NEW" | "CONTACTED" | "QUALIFIED" | "QUOTING" | "SAMPLE"
  | "TESTING" | "NEGOTIATION" | "WON" | "LOST";

const STATUS_TONES: Record<InquiryStatus, "neutral" | "success" | "warning" | "accent"> = {
  NEW: "accent", CONTACTED: "accent", QUALIFIED: "warning", QUOTING: "warning",
  SAMPLE: "warning", TESTING: "warning", NEGOTIATION: "warning", WON: "success", LOST: "neutral",
};

interface InquiryListItem {
  id: string;
  inquiryNumber: string;
  inquiryType: string;
  customerName?: string | null;
  companyName?: string | null;
  email: string;
  country?: string | null;
  productModel?: string | null;
  variantName?: string | null;
  status: InquiryStatus;
  priority?: string | null;
  createdAt: string;
}

type ListResponse =
  | { items: InquiryListItem[]; meta?: { page: number; pageSize: number; total: number; totalPages: number } }
  | { data: { items: InquiryListItem[]; meta?: { page: number; pageSize: number; total: number; totalPages: number } } };

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

export default function InquiriesPage() {
  const router = useRouter();
  const [items, setItems] = useState<InquiryListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), limit: String(pageSize), sortBy: "createdAt", sortOrder: sortDir });
    if (status) p.set("status", status);
    if (search.trim()) p.set("search", search.trim());
    return p.toString();
  }, [page, pageSize, status, search, sortDir]);

  const fetchInquiries = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/inquiries?${queryString}`, { signal, cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          setError((json as { error?: string }).error || `Failed to load (${res.status})`);
          setItems([]);
          setTotal(0);
          setTotalPages(1);
          return;
        }
        const body = (json?.data ?? json) as { items?: InquiryListItem[]; meta?: { total?: number; totalPages?: number } };
        setItems(body.items ?? []);
        setTotal(body.meta?.total ?? body.items?.length ?? 0);
        setTotalPages(Math.max(1, body.meta?.totalPages ?? 1));
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Network error while loading inquiries.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [queryString],
  );

  useEffect(() => {
    const ctl = new AbortController();
    fetchInquiries(ctl.signal);
    return () => ctl.abort();
  }, [fetchInquiries]);

  const toggleSort = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]" style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}>
          询盘管理
        </h1>
        <p className="mt-1 text-sm text-[#71717A]">
          {loading ? "加载中…" : `${total} 条询盘`}
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[#E4E4E7] bg-white p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="搜索询盘编号 / 姓名 / 公司 / 邮箱…"
              className="h-9 w-full rounded-md border border-[#E4E4E7] bg-white px-3 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-[#E4E4E7] bg-white px-3 text-sm text-[#0A0A0A] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <option value="">全部状态</option>
            {(["NEW","CONTACTED","QUALIFIED","QUOTING","SAMPLE","TESTING","NEGOTIATION","WON","LOST"]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#E4E4E7] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#E4E4E7] bg-[#FAFAFA] text-left text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
              <tr>
                <th className="px-3 py-2.5">编号</th>
                <th className="px-3 py-2.5">客户</th>
                <th className="px-3 py-2.5">公司</th>
                <th className="px-3 py-2.5">产品</th>
                <th className="px-3 py-2.5">类型</th>
                <th className="px-3 py-2.5">状态</th>
                <th className="px-3 py-2.5">
                  <button type="button" onClick={toggleSort} className="inline-flex items-center gap-1 hover:text-[#0A0A0A]">
                    创建时间
                    {sortDir === "asc"
                      ? <ArrowUp className="h-3 w-3 text-[#0A0A0A]" strokeWidth={2.5} />
                      : <ArrowDown className="h-3 w-3 text-[#0A0A0A]" strokeWidth={2.5} />}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`sk-${i}`}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-3 w-full max-w-[120px] animate-pulse rounded bg-[#F4F4F5]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <Inbox className="h-8 w-8 text-[#A1A1AA]" strokeWidth={1.25} />
                      <h3 className="mt-3 text-sm font-semibold text-[#0A0A0A]">暂无询盘</h3>
                      <p className="mt-1 text-xs text-[#71717A]">
                        {search || status ? "Try adjusting your filters." : "联系表单提交的新询盘将显示在这里。"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr
                    key={it.id}
                    className="cursor-pointer transition-colors hover:bg-[#FAFAFA]"
                    onClick={() => router.push(`/admin/inquiries/${it.id}`)}
                  >
                    <td className="px-3 py-2.5 font-mono text-xs text-[#0A0A0A]">{it.inquiryNumber}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-[#0A0A0A]">{it.customerName || "—"}</div>
                      <div className="mt-0.5 text-xs text-[#71717A]">{it.email}</div>
                    </td>
                    <td className="px-3 py-2.5 text-[#52525B]">{it.companyName || "—"}</td>
                    <td className="px-3 py-2.5 text-[#52525B]">
                      {it.productModel || it.variantName || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-[#52525B]">{it.inquiryType}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge tone={STATUS_TONES[it.status] ?? "neutral"}>{it.status}</StatusBadge>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-[#71717A]">{fmtDate(it.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && items.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#E4E4E7] px-4 py-3 text-xs text-[#71717A]">
            <div>Page {page} of {totalPages} · {total} total</div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                className="h-7 rounded-md border border-[#E4E4E7] bg-white px-2.5 font-medium text-[#52525B] hover:border-[#0A0A0A] hover:text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-50">
                上一页
              </button>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="h-7 rounded-md border border-[#E4E4E7] bg-white px-2.5 font-medium text-[#52525B] hover:border-[#0A0A0A] hover:text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-50">
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
