"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import type { ProductCategory } from "@/types/admin-product";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminFetch } from "@/lib/api/admin-fetch";

export default function NewProductPage() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctl = new AbortController();
    (async () => {
      try {
        const res = await adminFetch("/api/admin/products/categories?locale=en", {
          signal: ctl.signal,
          cache: "no-store",
        });
        if (!res.ok) {
          setError(`Failed to load categories (${res.status})`);
          return;
        }
        const data = await res.json();
        const list: ProductCategory[] = Array.isArray(data)
          ? (data as ProductCategory[])
          : (data?.items ?? []);
        setCategories(list);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Network error while loading categories.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctl.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#71717A]">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm">加载中…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1
          className="text-2xl font-semibold tracking-tight text-[#0A0A0A]"
          style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
        >
          新建系列
        </h1>
        <p className="mt-1 text-sm text-[#71717A]">
          创建新系列。URL 别名和 SKU 必须唯一。
        </p>
      </header>
      <ProductForm mode="create" categories={categories} initialCategoryId={initialCategoryId} />
    </div>
  );
}
