"use client";

import { useCallback, useEffect, useState } from "react";
import { FolderTree, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  slug: string;
  name?: string | null;
  nameZh?: string | null;
  icon?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  _count?: { products?: number; children?: number };
}

interface CategoryPanelProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const inputCls =
  "h-9 w-full rounded-md border border-[#E4E4E7] bg-white px-3 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20";
const labelCls = "mb-1.5 block text-xs font-medium text-[#52525B]";

export function CategoryPanel({ selectedId, onSelect }: CategoryPanelProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ slug: "", name: "", nameZh: "", icon: "" });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", { signal, cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        setError((json as { error?: string }).error || "Failed to load categories");
        setCategories([]);
        return;
      }
      const body = (json?.data ?? json) as { items?: CategoryItem[] } | CategoryItem[] | undefined;
      setCategories(Array.isArray(body) ? body : (body?.items ?? []));
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError("Network error loading categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctl = new AbortController();
    fetchCategories(ctl.signal);
    return () => ctl.abort();
  }, [fetchCategories]);

  const openNew = () => {
    setForm({ slug: "", name: "", nameZh: "", icon: "" });
    setEditing(null);
    setIsNew(true);
    setError(null);
  };

  const openEdit = (c: CategoryItem) => {
    setForm({ slug: c.slug, name: c.name ?? "", nameZh: c.nameZh ?? "", icon: c.icon ?? "" });
    setEditing(c);
    setIsNew(false);
    setError(null);
  };

  const onSave = async () => {
    if (!form.slug.trim() || !form.name.trim()) {
      setError("分类标识和名称必填。");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug.trim(),
          name: form.name.trim(),
          nameZh: form.nameZh.trim() || undefined,
          icon: form.icon.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "保存失败");
        return;
      }
      setEditing(null);
      setIsNew(false);
      fetchCategories();
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
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}/delete`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "删除失败");
        setDeleting(false);
        return;
      }
      if (selectedId === deleteTarget.id) onSelect(null);
      setDeleteTarget(null);
      setDeleting(false);
      fetchCategories();
    } catch {
      setError("Network error while deleting.");
      setDeleting(false);
    }
  };

  // Simple tree: group by parentId (2 levels max)
  const roots = categories.filter((c) => !c.parentId);
  const children = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  return (
    <aside className="w-64 shrink-0 border-r border-[#E4E4E7] bg-white lg:w-72">
      <div className="flex items-center justify-between border-b border-[#F4F4F5] px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#52525B]">
          分类
        </h2>
        <button
          type="button"
          onClick={openNew}
          className="rounded p-1 text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]"
          aria-label="新建分类"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-[#A1A1AA]">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : error ? (
          <p className="px-2 py-3 text-xs text-[#DC2626]">{error}</p>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <FolderTree className="h-6 w-6 text-[#A1A1AA]" strokeWidth={1.25} />
            <p className="mt-2 text-xs text-[#71717A]">暂无分类</p>
          </div>
        ) : (
          <ul className="space-y-0.5">
            <li>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  selectedId === null ? "bg-[#F4F4F5] text-[#0A0A0A]" : "text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#0A0A0A]",
                )}
              >
                <span>全部</span>
                <span className="text-[10px] text-[#A1A1AA]">
                  {categories.reduce((s, c) => s + (c._count?.products ?? 0), 0)}
                </span>
              </button>
            </li>
            {roots.map((cat) => (
              <li key={cat.id}>
                <CategoryRow
                  cat={cat}
                  selected={selectedId === cat.id}
                  onSelect={() => onSelect(cat.id)}
                  onEdit={() => openEdit(cat)}
                  onDelete={() => setDeleteTarget(cat)}
                />
                {children(cat.id).map((child) => (
                  <li key={child.id}>
                    <CategoryRow
                      cat={child}
                      selected={selectedId === child.id}
                      onSelect={() => onSelect(child.id)}
                      onEdit={() => openEdit(child)}
                      onDelete={() => setDeleteTarget(child)}
                      indent
                    />
                  </li>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Edit modal */}
      {(isNew || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={saving ? undefined : () => { setIsNew(false); setEditing(null); }} />
          <div className="relative w-full max-w-sm rounded-xl border border-[#E4E4E7] bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#0A0A0A]">
                {editing ? "编辑分类" : "新建分类"}
              </h3>
              <button type="button" onClick={() => { setIsNew(false); setEditing(null); }} disabled={saving} className="rounded p-1 text-[#A1A1AA] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]">
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>分类标识 *</label>
                <input className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} disabled={saving} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>名称（英文）*</label>
                  <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className={labelCls}>名称（中文）</label>
                  <input className={inputCls} value={form.nameZh} onChange={(e) => setForm({ ...form, nameZh: e.target.value })} disabled={saving} />
                </div>
              </div>
              <div>
                <label className={labelCls}>图标</label>
                <input className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} disabled={saving} />
              </div>
              {error && <p className="text-xs text-[#DC2626]">{error}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => { setIsNew(false); setEditing(null); }} disabled={saving}
                className="h-9 rounded-md border border-[#E4E4E7] bg-white px-3 text-sm font-medium text-[#52525B] hover:border-[#0A0A0A] hover:text-[#0A0A0A] disabled:opacity-50">
                取消
              </button>
              <button type="button" onClick={onSave} disabled={saving}
                className="inline-flex h-9 items-center rounded-md bg-[#0A0A0A] px-4 text-sm font-semibold text-white hover:bg-[#27272A] disabled:opacity-60">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {saving ? "保存中…" : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="删除此分类？"
        description="含有产品或子分类的分类无法删除。"
        confirmLabel="删除"
        cancelLabel="取消"
        busy={deleting}
        onConfirm={onDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </aside>
  );
}

function CategoryRow({
  cat,
  selected,
  onSelect,
  onEdit,
  onDelete,
  indent = false,
}: {
  cat: CategoryItem;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  indent?: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors",
        selected ? "bg-[#F4F4F5] text-[#0A0A0A]" : "text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#0A0A0A]",
        indent && "pl-6",
      )}
    >
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <span className="truncate">{cat.name || cat.slug}</span>
        {cat.nameZh && <span className="shrink-0 text-[10px] text-[#A1A1AA]">{cat.nameZh}</span>}
        <span className="ml-auto shrink-0 text-[10px] text-[#A1A1AA]">{cat._count?.products ?? 0}</span>
      </button>
      <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
        <button type="button" onClick={onEdit} className="rounded p-1 text-[#A1A1AA] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]" aria-label="Edit">
          <Pencil className="h-3 w-3" strokeWidth={1.75} />
        </button>
        <button type="button" onClick={onDelete} className="rounded p-1 text-[#A1A1AA] hover:bg-[#FEF2F2] hover:text-[#DC2626]" aria-label="删除">
          <Trash2 className="h-3 w-3" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
