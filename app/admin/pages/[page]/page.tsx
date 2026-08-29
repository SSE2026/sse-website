"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, Save } from "lucide-react";
import { getPageDef, flattenContent, unflattenContent } from "@/lib/cms/pages";
import { MediaUploader } from "@/components/admin/MediaUploader";

interface LocaleContent {
  locale: string;
  content: Record<string, unknown>;
  published: boolean;
  updatedAt: string;
}

type Flat = Record<string, Record<string, string>>;

export default function PageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);
  const router = useRouter();
  const def = getPageDef(page);

  const [locales, setLocales] = useState<LocaleContent[]>([]);
  const [activeLocale, setActiveLocale] = useState<"en" | "zh">("en");
  const [activeSection, setActiveSection] = useState<string>("");
  const [flat, setFlat] = useState<Flat>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!def) return;
    const ctl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/content/${page}`, { signal: ctl.signal, cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          setError((json as { error?: string }).error || "Failed to load");
          return;
        }
        const body = (json?.data ?? json) as { page: string; locales?: LocaleContent[] };
        const ls = body.locales ?? [];
        setLocales(ls);

        // Build flat form from DB (or defaults)
        const f: Flat = {};
        for (const locale of ["en", "zh"]) {
          f[locale] = {};
          const existing = ls.find((l) => l.locale === locale);
          const content = existing?.content ?? def.defaultContent;
          for (const section of def.sections) {
            Object.assign(f[locale], flattenContent(content as Record<string, unknown>, section.key));
          }
        }
        setFlat(f);
        if (!ls.find((l) => l.locale === "en")) {
          // default new section selection
        }
        setActiveSection(def.sections[0]?.key ?? "");
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, def?.key]);

  const sectionDefs = useMemo(() => def?.sections ?? [], [def]);
  const activeSectionDef = useMemo(
    () => sectionDefs.find((s) => s.key === activeSection),
    [sectionDefs, activeSection],
  );
  const currentFlat = flat[activeLocale] ?? {};

  if (!def) {
    return (
      <div className="flex items-center justify-center py-20 text-[#71717A]">
        未知页面：{page}
      </div>
    );
  }

  const setField = (key: string, value: string) => {
    setFlat((prev) => ({ ...prev, [activeLocale]: { ...(prev[activeLocale] ?? {}), [key]: value } }));
    setSaved(false);
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      // Rebuild content for this locale from flat form
      const current = locales.find((l) => l.locale === activeLocale)?.content ?? {};
      let newContent: Record<string, unknown> = { ...current };
      for (const section of sectionDefs) {
        const sectionFlat: Record<string, string> = {};
        for (const field of section.fields) {
          sectionFlat[field.key] = currentFlat[field.key] ?? "";
        }
        newContent = unflattenContent(sectionFlat, section.key, newContent);
      }

      const res = await fetch(`/api/admin/content/${page}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: activeLocale, content: newContent, published: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || "保存失败");
        return;
      }
      setSaved(true);
      // Refresh locales so updatedAt is current
      const fresh = await fetch(`/api/admin/content/${page}`, { cache: "no-store" });
      if (fresh.ok) {
        const j = await fresh.json();
        const body = (j?.data ?? j) as { locales?: LocaleContent[] };
        setLocales(body.locales ?? []);
      }
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20";
  const labelCls = "mb-1.5 block text-xs font-medium text-[#52525B]";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.push("/admin/pages")} className="rounded-md p-1.5 text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]" style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}>
            {def.label}
          </h1>
          <p className="mt-1 text-sm text-[#71717A]">{def.labelZh} · 页面内容编辑器</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0A0A0A] px-4 text-sm font-semibold text-white hover:bg-[#27272A] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" strokeWidth={2} />}
          {saving ? "保存中…" : "保存"}
        </button>
      </div>

      {saved && (
        <div className="rounded-md border border-[#16A34A]/30 bg-[#16A34A]/10 px-3 py-2 text-sm text-[#15803D]">
          已保存
        </div>
      )}
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#71717A]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm">加载中…</span>
        </div>
      ) : (
        <div className="flex gap-5">
          {/* Left: section nav */}
          <aside className="w-56 shrink-0 rounded-xl border border-[#E4E4E7] bg-white p-2">
            <div className="mb-2 flex gap-1 border-b border-[#F4F4F5] px-2 pb-2">
              {(["en", "zh"] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setActiveLocale(loc)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${
                    activeLocale === loc ? "bg-[#0A0A0A] text-white" : "text-[#52525B] hover:bg-[#F4F4F5]"
                  }`}
                >
                  {loc === "en" ? "英文" : "中文"}
                </button>
              ))}
            </div>
            <ul className="space-y-0.5">
              {sectionDefs.map((s) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => setActiveSection(s.key)}
                    className={`w-full rounded-md px-2.5 py-2 text-left text-sm font-medium transition-colors ${
                      activeSection === s.key ? "bg-[#F4F4F5] text-[#0A0A0A]" : "text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#0A0A0A]"
                    }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Right: schema-driven form */}
          <div className="min-w-0 flex-1 rounded-xl border border-[#E4E4E7] bg-white p-5 md:p-6">
            {activeSectionDef ? (
              <div className="space-y-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]">
                  {activeSectionDef.label}
                </h2>
                {activeSectionDef.fields.map((field) => (
                  <div key={field.key}>
                    <label className={labelCls}>{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={4}
                        value={currentFlat[field.key] ?? ""}
                        onChange={(e) => setField(field.key, e.target.value)}
                        disabled={saving}
                        className={inputCls}
                      />
                    ) : field.type === "image" ? (
                      <MediaUploader
                        value={currentFlat[field.key] || null}
                        onUploaded={(url) => setField(field.key, url)}
                        folder={`cms/${page}`}
                        disabled={saving}
                        compact
                      />
                    ) : field.type === "json" ? (
                      <textarea
                        rows={6}
                        value={currentFlat[field.key] ?? ""}
                        onChange={(e) => setField(field.key, e.target.value)}
                        disabled={saving}
                        className={`${inputCls} font-mono text-xs`}
                        placeholder={JSON.stringify([{ value: "500+", unit: "Wh/kg" }])}
                      />
                    ) : (
                      <input
                        value={currentFlat[field.key] ?? ""}
                        onChange={(e) => setField(field.key, e.target.value)}
                        disabled={saving}
                        className={inputCls}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-[#71717A]">未定义区块。</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
