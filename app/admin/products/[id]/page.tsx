"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import type {
  ProductCategory,
  ProductDetail,
} from "@/types/admin-product";
import { ProductForm } from "@/components/admin/ProductForm";
import { VariantManager } from "@/components/admin/VariantManager";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminFetch } from "@/lib/api/admin-fetch";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const ctl = new AbortController();
    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          adminFetch(`/api/admin/products/${id}`, { signal: ctl.signal, cache: "no-store" }),
          adminFetch("/api/admin/products/categories?locale=en", {
            signal: ctl.signal,
            cache: "no-store",
          }),
        ]);

        if (!prodRes.ok) {
          const data = await prodRes.json().catch(() => ({}));
          setError(
            (data as { error?: string }).error ||
              `Failed to load product (${prodRes.status})`,
          );
          return;
        }
        const prodData = await prodRes.json();
        // 代理 /api/admin/products/[id] 返回 { success, data: { success, data: product } }
        const p: ProductDetail =
          (prodData as { data?: { data?: ProductDetail } })?.data?.data ??
          (prodData as { data?: ProductDetail })?.data ??
          (prodData as ProductDetail);
        setProduct(p);

        if (catRes.ok) {
          const catData = await catRes.json();
          const list: ProductCategory[] = Array.isArray(catData)
            ? (catData as ProductCategory[])
            : (catData?.items ?? []);
          setCategories(list);
        }
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Network error while loading product.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctl.abort();
  }, [id]);

  const onDelete = async () => {
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/products/${id}/delete`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          (data as { error?: string }).error || "删除失败",
        );
        setDeleting(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error while deleting.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#71717A]">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm">加载中…</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            strokeWidth={2}
          />
          <span>{error ?? "未找到该系列。"}</span>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="inline-flex h-9 items-center rounded-md border border-[#E4E4E7] bg-white px-3 text-sm font-medium text-[#52525B] transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
        >
          返回列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight text-[#0A0A0A]"
            style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
          >
            编辑系列
          </h1>
          <p className="mt-1 text-sm text-[#71717A]">
            <span className="font-mono text-[#52525B]">{product.sku}</span>
            <span className="mx-2 text-[#A1A1AA]">·</span>
            <span className="font-mono text-xs">/{product.slug}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="inline-flex h-9 items-center gap-1.5 self-start rounded-md border border-[#FECACA] bg-white px-3 text-sm font-medium text-[#DC2626] transition-colors hover:bg-[#FEF2F2] sm:self-auto"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          删除
        </button>
      </header>

      <ProductForm mode="edit" product={product} categories={categories} />

      <VariantManager productId={product.id} initialVariants={product.variants ?? []} />

      <ConfirmDialog
        open={deleteOpen}
        title="删除此系列？"
        description={
          <span>
            <span className="font-medium text-[#0A0A0A]">{product.model}</span>{" "}
            将被软删除。可在数据库中恢复。
          </span>
        }
        confirmLabel="删除"
        cancelLabel="取消"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => !deleting && setDeleteOpen(false)}
      />
    </div>
  );
}
