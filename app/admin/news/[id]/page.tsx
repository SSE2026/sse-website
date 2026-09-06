"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { adminFetch } from "@/lib/api/admin-fetch";

interface BlogCategory { id: string; slug: string; }
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleZh?: string | null;
  excerpt?: string | null;
  content?: string | null;
  categoryId?: string | null;
  published?: boolean;
  featured?: boolean;
  coverImage?: string | null;
}

export default function NewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    titleZh: "",
    excerpt: "",
    content: "",
    categoryId: "",
    coverImage: "",
    published: false,
    featured: false,
  });

  useEffect(() => {
    const ctl = new AbortController();
    (async () => {
      // 加载分类
      try {
        const catRes = await adminFetch("/api/admin/news/categories?locale=en", { signal: ctl.signal, cache: "no-store" });
        if (catRes.ok) {
          const data = await catRes.json();
          const body = (data?.data ?? data) as { items?: BlogCategory[] } | BlogCategory[] | undefined;
          const list = Array.isArray(body) ? body : (body?.items ?? []);
          setCategories(list);
        }
      } catch { /* non-fatal */ }

      if (isNew) return;
      try {
        const res = await adminFetch(`/api/admin/news/${id}`, { signal: ctl.signal, cache: "no-store" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError((data as { error?: string }).error || `Failed to load (${res.status})`);
          return;
        }
        const json = await res.json();
        const body = (json?.data ?? json) as BlogPost;
        const tr = body as unknown as { translations?: Array<{ locale: string; title: string; excerpt: string; content: string }> };
        const zh = tr.translations?.find((t) => t.locale === "zh" || t.locale === "zh-CN");
        setForm({
          slug: body.slug ?? "",
          title: body.title ?? "",
          titleZh: zh?.title ?? "",
          excerpt: body.excerpt ?? "",
          content: body.content ?? "",
          categoryId: body.categoryId ?? "",
          coverImage: body.coverImage ?? "",
          published: body.published ?? false,
          featured: body.featured ?? false,
        });
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Network error while loading.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctl.abort();
  }, [id, isNew]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.slug.trim() || !form.title.trim()) {
      setError("URL 别名和标题必填。");
      return;
    }
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/news" : `/api/admin/news/${id}`;
      const method = isNew ? "POST" : "PATCH";
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        titleZh: form.titleZh.trim() || undefined,
        excerpt: form.excerpt.trim() || undefined,
        content: form.content || undefined,
        categoryId: form.categoryId || undefined,
        coverImage: form.coverImage.trim() || undefined,
        published: form.published,
        featured: form.featured,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || `保存失败 (${res.status})`);
        return;
      }
      router.push("/admin/news");
      router.refresh();
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "h-9 w-full rounded-md border border-[#E4E4E7] bg-white px-3 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20";
  const labelCls = "mb-1.5 block text-xs font-medium text-[#52525B]";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#71717A]">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm">加载中…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.push("/admin/news")} className="rounded-md p-1.5 text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]" style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}>
            {isNew ? "新建文章" : "编辑文章"}
          </h1>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <section className="rounded-xl border border-[#E4E4E7] bg-white p-5 md:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]">基本信息</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="slug">URL 别名 *</label>
              <input id="slug" className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} disabled={saving} required />
            </div>
            <div>
              <label className={labelCls} htmlFor="category">分类</label>
              <select id="category" className={inputCls} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} disabled={saving}>
                <option value="">无</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.slug}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="title">标题 *</label>
              <input id="title" className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} disabled={saving} required />
            </div>
            <div>
              <label className={labelCls} htmlFor="titleZh">标题（中文）</label>
              <input id="titleZh" className={inputCls} value={form.titleZh} onChange={(e) => setForm({ ...form, titleZh: e.target.value })} disabled={saving} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls} htmlFor="coverImage">封面图片 URL</label>
              <input id="coverImage" className={inputCls} value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} disabled={saving} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#E4E4E7] bg-white p-5 md:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]">正文</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls} htmlFor="excerpt">摘要</label>
              <textarea id="excerpt" rows={2} className="w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0A0A0A] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} disabled={saving} />
            </div>
            <div>
              <label className={labelCls} htmlFor="content">正文</label>
              <textarea id="content" rows={12} className="w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-sm font-mono text-[#0A0A0A] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} disabled={saving} placeholder="HTML 或纯文本" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#E4E4E7] bg-white p-5 md:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]">发布设置</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {([["published", "已发布"], ["featured", "精选"]] as const).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between gap-3 rounded-md border border-[#E4E4E7] bg-white px-3 py-2.5">
                <span className="text-sm font-medium text-[#0A0A0A]">{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form[key]}
                  onClick={() => setForm({ ...form, [key]: !form[key] })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form[key] ? "bg-[#2563EB]" : "bg-[#E4E4E7]"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${form[key] ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
                </button>
              </label>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between border-t border-[#F4F4F5] pt-5">
          <button type="button" onClick={() => router.push("/admin/news")} disabled={saving}
            className="inline-flex h-9 items-center rounded-md border border-[#E4E4E7] bg-white px-3 text-sm font-medium text-[#52525B] hover:border-[#0A0A0A] hover:text-[#0A0A0A] disabled:opacity-50">
            取消
          </button>
          <button type="submit" disabled={saving}
            className="inline-flex h-9 items-center rounded-md bg-[#0A0A0A] px-4 text-sm font-semibold text-white hover:bg-[#27272A] disabled:opacity-60">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {saving ? "Saving…" : (isNew ? "创建文章" : "保存修改")}
          </button>
        </div>
      </form>
    </div>
  );
}
