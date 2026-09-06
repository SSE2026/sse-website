"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  Package,
  Pencil,
  Plus,
} from "lucide-react";
import type { ProductListItem, ProductsListResponse } from "@/types/admin-product";
import { VariantManager, type VariantRow } from "@/components/admin/VariantManager";
import { cn } from "@/lib/utils";
import { adminFetch } from "@/lib/api/admin-fetch";

interface SeriesDetail {
  id: string;
  model: string;
  sku: string;
  slug: string;
  name?: string;
  variants?: VariantRow[];
}

// 左侧系列列表（一级分类 = 产品系列 360-P / 400-E / 460-X）
export default function ProductsListPage() {
  const router = useRouter();
  const [series, setSeries] = useState<ProductListItem[]>([]);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SeriesDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeries = useCallback(async (signal?: AbortSignal) => {
    setLoadingSeries(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/products?limit=100", { signal, cache: "no-store" });
      const data: ProductsListResponse | { success: false; error: string } = await res.json();
      if (!res.ok || (data as { success?: boolean }).success === false) {
        setError((data as { error?: string }).error || "Failed to load series");
        setSeries([]);
        return;
      }
      const ok = data as ProductsListResponse;
      setSeries(ok.items ?? []);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError("Network error loading series.");
      setSeries([]);
    } finally {
      setLoadingSeries(false);
    }
  }, []);

  useEffect(() => {
    const ctl = new AbortController();
    fetchSeries(ctl.signal);
    return () => ctl.abort();
  }, [fetchSeries]);

  // Load detail (with variants) when a series is selected
  const selectSeries = useCallback(
    async (id: string) => {
      setSelectedId(id);
      setLoadingDetail(true);
      setError(null);
      try {
        const res = await adminFetch(`/api/admin/products/${id}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          setError((json as { error?: string }).error || "Failed to load series");
          setDetail(null);
          return;
        }
        const p = (json?.data?.data ?? json?.data ?? json) as SeriesDetail;
        setDetail(p);
      } catch {
        setError("Network error loading series.");
        setDetail(null);
      } finally {
        setLoadingDetail(false);
      }
    },
    [],
  );

  const displayName = (s: ProductListItem): string => {
    const en = s.translations?.find((t) => t.locale === "en")?.name;
    if (en && en.trim()) return en;
    return s.model;
  };

  const variantCount = (s: ProductListItem): number => s.variants?.length ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight text-[#0A0A0A]"
            style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
          >
            产品管理
          </h1>
          <p className="mt-1 text-sm text-[#71717A]">
            在左侧选择一个系列，管理其下的 SKU。
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-9 items-center gap-1.5 self-start rounded-md bg-[#0A0A0A] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#27272A]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          新建系列
        </Link>
      </div>

      <div className="flex gap-5">
        {/* Left: series list */}
        <aside className="w-64 shrink-0 rounded-xl border border-[#E4E4E7] bg-white lg:w-72">
          <div className="flex items-center justify-between border-b border-[#F4F4F5] px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525B]">
              系列
            </h2>
          </div>
          <div className="max-h-[calc(100vh-260px)] overflow-y-auto p-2">
            {loadingSeries ? (
              <div className="flex items-center justify-center py-8 text-[#A1A1AA]">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : error && series.length === 0 ? (
              <p className="px-2 py-3 text-xs text-[#DC2626]">{error}</p>
            ) : series.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Package className="h-6 w-6 text-[#A1A1AA]" strokeWidth={1.25} />
                <p className="mt-2 text-xs text-[#71717A]">暂无系列</p>
              </div>
            ) : (
              <ul className="space-y-0.5">
                {series.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => selectSeries(s.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                        selectedId === s.id
                          ? "bg-[#F4F4F5] text-[#0A0A0A]"
                          : "text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#0A0A0A]",
                      )}
                    >
                      <span className="truncate">{displayName(s)}</span>
                      <span className="ml-2 shrink-0 text-[10px] text-[#A1A1AA]">
                        {variantCount(s)} 个 SKU
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Right: selected series detail + SKU manager */}
        <div className="min-w-0 flex-1 space-y-5">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          {!selectedId ? (
            <div className="rounded-xl border border-dashed border-[#E4E4E7] bg-white py-20 text-center">
              <Package className="mx-auto h-10 w-10 text-[#C4C4C8]" strokeWidth={1} />
              <h3 className="mt-4 text-sm font-semibold text-[#52525B]">
                选择一个系列
              </h3>
              <p className="mt-1 text-xs text-[#A1A1AA]">
                在左侧选择一个系列，查看并管理其 SKU。
              </p>
            </div>
          ) : loadingDetail ? (
            <div className="flex items-center justify-center py-20 text-[#71717A]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm">加载中…</span>
            </div>
          ) : detail ? (
            <>
              {/* Series header */}
              <div className="flex items-center justify-between rounded-xl border border-[#E4E4E7] bg-white p-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#0A0A0A]">
                    {detail.name || detail.model}
                  </h2>
                  <div className="mt-1 text-xs text-[#71717A]">
                    <span className="font-mono text-[#52525B]">{detail.sku}</span>
                    <span className="mx-2 text-[#A1A1AA]">·</span>
                    <span className="font-mono">/{detail.slug}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/products/${detail.id}`)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E4E4E7] bg-white px-3 text-xs font-medium text-[#52525B] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                  编辑系列
                </button>
              </div>

              {/* SKU manager */}
              <VariantManager productId={detail.id} initialVariants={detail.variants ?? []} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
