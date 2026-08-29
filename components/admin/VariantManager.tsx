"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { MediaUploader } from "./MediaUploader";

export interface VariantRow {
  id: string;
  sku: string;
  name: string;
  nameEn?: string | null;
  image?: string | null;
  nominalVoltage?: number | null;
  nominalCapacity?: number | null;
  energy?: number | null;
  energyDensity?: number | null;
  weight?: number | null;
  priceUsd?: number | null;
  priceUsdMin?: number | null;
  priceUsdMax?: number | null;
  published?: boolean;
  sortOrder?: number;
}

interface VariantManagerProps {
  productId: string;
  initialVariants: VariantRow[];
}

type FormState = {
  sku: string;
  name: string;
  nameEn: string;
  image: string;
  nominalVoltage: string;
  nominalCapacity: string;
  energy: string;
  energyDensity: string;
  weight: string;
  priceUsd: string;
  priceUsdMin: string;
  priceUsdMax: string;
  published: boolean;
  sortOrder: string;
};

const emptyForm: FormState = {
  sku: "", name: "", nameEn: "", image: "", nominalVoltage: "", nominalCapacity: "",
  energy: "", energyDensity: "", weight: "", priceUsd: "", priceUsdMin: "", priceUsdMax: "",
  published: true, sortOrder: "0",
};

function toForm(v?: VariantRow): FormState {
  if (!v) return emptyForm;
  const s = (n: number | null | undefined) => (n === null || n === undefined ? "" : String(n));
  return {
    sku: v.sku, name: v.name, nameEn: v.nameEn ?? "", image: v.image ?? "",
    nominalVoltage: s(v.nominalVoltage), nominalCapacity: s(v.nominalCapacity),
    energy: s(v.energy), energyDensity: s(v.energyDensity), weight: s(v.weight),
    priceUsd: s(v.priceUsd), priceUsdMin: s(v.priceUsdMin), priceUsdMax: s(v.priceUsdMax),
    published: v.published ?? true, sortOrder: s(v.sortOrder) || "0",
  };
}

const inputCls =
  "h-8 w-full rounded-md border border-[#E4E4E7] bg-white px-2.5 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20";
const labelCls = "mb-1 block text-[11px] font-medium text-[#52525B]";

export function VariantManager({ productId, initialVariants }: VariantManagerProps) {
  const [variants, setVariants] = useState<VariantRow[]>(initialVariants);
  const [editing, setEditing] = useState<VariantRow | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VariantRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openNew = () => {
    setForm(emptyForm);
    setEditing(null);
    setIsNew(true);
    setError(null);
  };
  const openEdit = (v: VariantRow) => {
    setForm(toForm(v));
    setEditing(v);
    setIsNew(false);
    setError(null);
  };
  const close = () => {
    setIsNew(false);
    setEditing(null);
  };

  const buildPayload = (): Record<string, unknown> => {
    const p: Record<string, unknown> = { sku: form.sku.trim(), name: form.name.trim() };
    if (form.nameEn.trim()) p.nameEn = form.nameEn.trim();
    if (form.image.trim()) p.image = form.image.trim();
    const num = (k: keyof FormState) => {
      const raw = (form[k] as string).trim();
      if (raw === "") return;
      const n = Number(raw);
      if (Number.isFinite(n)) p[k] = n;
    };
    num("nominalVoltage"); num("nominalCapacity"); num("energy"); num("energyDensity");
    num("weight"); num("priceUsd"); num("priceUsdMin"); num("priceUsdMax");
    p.published = form.published;
    p.sortOrder = Number(form.sortOrder) || 0;
    return p;
  };

  const onSave = async () => {
    if (!form.sku.trim() || !form.name.trim()) {
      setError("SKU and name are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let res: Response;
      if (editing) {
        res = await fetch(`/api/admin/products/${productId}/variants/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
      } else {
        res = await fetch(`/api/admin/products/${productId}/variants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || "Save failed");
        return;
      }
      close();
      // Refresh: reload the product detail via the page's parent fetch — simplest is to refetch here.
      const fresh = await fetch(`/api/admin/products/${productId}`, { cache: "no-store" });
      if (fresh.ok) {
        const j = await fresh.json();
        const detail = (j?.data?.data ?? j?.data ?? j) as { variants?: VariantRow[] };
        setVariants(detail.variants ?? []);
      }
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/products/${productId}/variants/${deleteTarget.id}/delete`,
        { method: "POST" },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "删除失败");
        setDeleting(false);
        return;
      }
      setDeleteTarget(null);
      setDeleting(false);
      const fresh = await fetch(`/api/admin/products/${productId}`, { cache: "no-store" });
      if (fresh.ok) {
        const j = await fresh.json();
        const detail = (j?.data?.data ?? j?.data ?? j) as { variants?: VariantRow[] };
        setVariants(detail.variants ?? []);
      }
    } catch {
      setError("Network error while deleting.");
      setDeleting(false);
    }
  };

  return (
    <section className="rounded-xl border border-[#E4E4E7] bg-white p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <header className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]">
            变体
          </h2>
          <span className="text-xs text-[#A1A1AA]">{variants.length} 个 SKU</span>
        </header>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex h-8 items-center gap-1 rounded-md bg-[#0A0A0A] px-2.5 text-xs font-semibold text-white hover:bg-[#27272A]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          添加变体
        </button>
      </div>

      {error && (
        <p className="mb-3 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">{error}</p>
      )}

      {variants.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#71717A]">
          暂无变体，请为该系列添加 SKU。
        </p>
      ) : (
        <div className="overflow-hidden rounded-md border border-[#E4E4E7]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E4E4E7] bg-[#FAFAFA] text-left text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                <tr>
                  <th className="w-12 px-3 py-2">图片</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">名称</th>
                  <th className="px-3 py-2">电压</th>
                  <th className="px-3 py-2">容量</th>
                  <th className="px-3 py-2">能量</th>
                  <th className="px-3 py-2">重量</th>
                  <th className="px-3 py-2">价格 (USD)</th>
                  <th className="px-3 py-2">状态</th>
                  <th className="w-16 px-3 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5]">
                {variants.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-[#FAFAFA]">
                    <td className="px-3 py-2">
                      <div className="flex h-8 w-10 items-center justify-center overflow-hidden rounded bg-[#F4F4F5]">
                        {v.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[#A1A1AA] text-[9px]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-[#0A0A0A]">{v.sku}</td>
                    <td className="px-3 py-2 text-[#0A0A0A]">
                      {v.name}
                      {v.nameEn && <div className="text-[10px] text-[#A1A1AA]">{v.nameEn}</div>}
                    </td>
                    <td className="px-3 py-2 text-[#52525B]">{v.nominalVoltage ?? "—"}</td>
                    <td className="px-3 py-2 text-[#52525B]">{v.nominalCapacity ?? "—"}</td>
                    <td className="px-3 py-2 text-[#52525B]">{v.energyDensity ?? "—"}</td>
                    <td className="px-3 py-2 text-[#52525B]">{v.weight ?? "—"}</td>
                    <td className="px-3 py-2 text-[#52525B]">
                      {v.priceUsdMin !== null && v.priceUsdMin !== undefined
                        ? `${v.priceUsdMin}–${v.priceUsdMax ?? ""}`
                        : v.priceUsd ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      {v.published ? <StatusBadge tone="success">启用</StatusBadge> : <StatusBadge tone="neutral">草稿</StatusBadge>}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => openEdit(v)} className="rounded p-1 text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]" aria-label="编辑">
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(v)} className="rounded p-1 text-[#52525B] hover:bg-[#FEF2F2] hover:text-[#DC2626]" aria-label="删除">
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(isNew || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={saving ? undefined : close} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#E4E4E7] bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#0A0A0A]">
                {editing ? "编辑 " + editing.sku : "添加变体"}
              </h3>
              <button type="button" onClick={close} disabled={saving} className="rounded p-1 text-[#A1A1AA] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]">
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image */}
              <div>
                <label className={labelCls}>图片</label>
                <MediaUploader
                  value={form.image || null}
                  onUploaded={(url) => setForm({ ...form, image: url })}
                  folder="products/variants"
                  disabled={saving}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>SKU *</label>
                  <input className={inputCls} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>Name *</label>
                  <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>英文名称</label>
                  <input className={inputCls} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>排序</label>
                  <input type="number" className={inputCls} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>电压 (V)</label>
                  <input type="number" step="any" className={inputCls} value={form.nominalVoltage} onChange={(e) => setForm({ ...form, nominalVoltage: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>容量 (Ah)</label>
                  <input type="number" step="any" className={inputCls} value={form.nominalCapacity} onChange={(e) => setForm({ ...form, nominalCapacity: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>能量密度 (Wh/kg)</label>
                  <input type="number" step="any" className={inputCls} value={form.energyDensity} onChange={(e) => setForm({ ...form, energyDensity: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>重量 (g)</label>
                  <input type="number" step="any" className={inputCls} value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>最低价 (USD)</label>
                  <input type="number" step="any" className={inputCls} value={form.priceUsdMin} onChange={(e) => setForm({ ...form, priceUsdMin: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>最高价 (USD)</label>
                  <input type="number" step="any" className={inputCls} value={form.priceUsdMax} onChange={(e) => setForm({ ...form, priceUsdMax: e.target.value })} disabled={saving} />
                </div>
              </div>

              <label className="flex items-center justify-between gap-3 rounded-md border border-[#E4E4E7] bg-white px-3 py-2">
                <span className="text-sm font-medium text-[#0A0A0A]">发布</span>
                <button type="button" role="switch" aria-checked={form.published} onClick={() => setForm({ ...form, published: !form.published })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.published ? "bg-[#2563EB]" : "bg-[#E4E4E7]"}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${form.published ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
                </button>
              </label>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#F4F4F5] pt-4">
              <button type="button" onClick={close} disabled={saving}
                className="h-9 rounded-md border border-[#E4E4E7] bg-white px-3 text-sm font-medium text-[#52525B] hover:border-[#0A0A0A] hover:text-[#0A0A0A] disabled:opacity-50">
                取消
              </button>
              <button type="button" onClick={onSave} disabled={saving}
                className="inline-flex h-9 items-center rounded-md bg-[#0A0A0A] px-4 text-sm font-semibold text-white hover:bg-[#27272A] disabled:opacity-60">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {saving ? "保存中…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="删除此 SKU？"
        description="此操作将永久删除该变体。"
        confirmLabel="删除"
        cancelLabel="取消"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </section>
  );
}
