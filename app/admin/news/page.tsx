"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/api/admin-fetch";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Loader2,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface NewsPost {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  featured: boolean;
  publishedAt: string | null;
  viewCount: number;
  category: { id: string; slug: string } | null;
  createdAt: string;
}

type NewsListResponse =
  | { items: NewsPost[]; meta?: { page: number; pageSize: number; total: number; totalPages: number } }
  | { data: { items: NewsPost[]; meta?: { page: number; pageSize: number; total: number; totalPages: number } } };

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

export default function NewsAdminPage() {
  const router = useRouter();
  const [items, setItems] = useState<NewsPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "publishedAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const queryString = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), limit: String(pageSize), sortBy, sortOrder: sortDir });
    if (search.trim()) p.set("search", search.trim());
    return p.toString();
  }, [page, pageSize, search, sortBy, sortDir]);

  const fetchNews = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminFetch(`/api/admin/news?${queryString}`, { signal, cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          setError((json as { error?: string }).error || `Failed to load news (${res.status})`);
          setItems([]);
          setTotal(0);
          setTotalPages(1);
          return;
        }
        const body = (json?.data ?? json) as { items?: NewsPost[]; meta?: { total?: number; totalPages?: number } };
        setItems(body.items ?? []);
        setTotal(body.meta?.total ?? body.items?.length ?? 0);
        setTotalPages(Math.max(1, body.meta?.totalPages ?? 1));
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Network error while loading news.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [queryString],
  );

  useEffect(() => {
    const ctl = new AbortController();
    fetchNews(ctl.signal);
    return () => ctl.abort();
  }, [fetchNews]);

  const onDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/news/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "Delete failed");
        setDeleting(false);
        return;
      }
      setDeleteTarget(null);
      setDeleting(false);
      fetchNews();
    } catch {
      setError("Network error while deleting.");
      setDeleting(false);
    }
  };

  const toggleSort = (key: "createdAt" | "publishedAt") => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("desc"); }
    setPage(1);
  };

  const sortIcon = (key: "createdAt" | "publishedAt") => {
    if (sortBy !== key) return <ArrowUpDown className="h-3 w-3 text-[#A1A1AA]" strokeWidth={2} />;
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3 text-[#0A0A0A]" strokeWidth={2.5} />
      : <ArrowDown className="h-3 w-3 text-[#0A0A0A]" strokeWidth={2.5} />;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]" style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}>
            新闻管理
          </h1>
          <p className="mt-1 text-sm text-[#71717A]">
            {loading ? "加载中…" : `${total} 篇文章`}
          </p>
        </div>
        <Link href="/admin/news/new" className="inline-flex h-9 items-center gap-1.5 self-start rounded-md bg-[#0A0A0A] px-3 text-sm font-semibold text-white hover:bg-[#27272A] sm:self-auto">
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          新建文章
        </Link>
      </div>

      <div className="rounded-xl border border-[#E4E4E7] bg-white p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" strokeWidth={1.75} />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="搜索文章…"
            className="h-9 w-full rounded-md border border-[#E4E4E7] bg-white pl-9 pr-3 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />
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
                <th className="px-3 py-2.5">标题</th>
                <th className="px-3 py-2.5">分类</th>
                <th className="px-3 py-2.5">状态</th>
                <th className="px-3 py-2.5">浏览</th>
                <th className="px-3 py-2.5">
                  <button type="button" onClick={() => toggleSort("publishedAt")} className="inline-flex items-center gap-1 hover:text-[#0A0A0A]">
                    发布时间 {sortIcon("publishedAt")}
                  </button>
                </th>
                <th className="px-3 py-2.5">
                  <button type="button" onClick={() => toggleSort("createdAt")} className="inline-flex items-center gap-1 hover:text-[#0A0A0A]">
                    创建时间 {sortIcon("createdAt")}
                  </button>
                </th>
                <th className="w-28 px-3 py-2.5 text-right">操作</th>
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
                      <Newspaper className="h-8 w-8 text-[#A1A1AA]" strokeWidth={1.25} />
                      <h3 className="mt-3 text-sm font-semibold text-[#0A0A0A]">未找到文章</h3>
                      <p className="mt-1 text-xs text-[#71717A]">
                        {search ? "Try adjusting your search." : "Get started by creating your first article."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-[#FAFAFA]">
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-[#0A0A0A]">{p.title || p.slug}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-[#A1A1AA]">/{p.slug}</div>
                    </td>
                    <td className="px-3 py-2.5 text-[#52525B]">{p.category?.slug ?? "—"}</td>
                    <td className="px-3 py-2.5">
                      {p.published ? <StatusBadge tone="success">发布时间</StatusBadge> : <StatusBadge tone="neutral">草稿</StatusBadge>}
                    </td>
                    <td className="px-3 py-2.5 text-[#52525B]">{p.viewCount}</td>
                    <td className="px-3 py-2.5 text-xs text-[#71717A]">{formatDate(p.publishedAt)}</td>
                    <td className="px-3 py-2.5 text-xs text-[#71717A]">{formatDate(p.createdAt)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/news/${p.id}`)}
                          aria-label={`Edit ${p.title}`}
                          className="rounded p-1.5 text-[#52525B] transition-colors hover:bg-[#F4F4F5] hover:text-[#0A0A0A]"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          aria-label={`Delete ${p.title}`}
                          className="rounded p-1.5 text-[#52525B] transition-colors hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="删除此文章？"
        description={<span><span className="font-medium text-[#0A0A0A]">{deleteTarget?.title}</span> 将被软删除。</span>}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
