"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

const INQUIRY_STATUSES = ["NEW","CONTACTED","QUALIFIED","QUOTING","SAMPLE","TESTING","NEGOTIATION","WON","LOST"] as const;
const STATUS_LABELS: Record<string, string> = {
  NEW: "新询盘", CONTACTED: "已联系", QUALIFIED: "已确认",
  QUOTING: "报价中", SAMPLE: "样品中", TESTING: "测试中",
  NEGOTIATION: "洽谈中", WON: "已成交", LOST: "已流失",
};
const ACTIVITY_TYPES = ["NOTE","EMAIL","CALL","MEETING","QUOTE","SAMPLE","FOLLOW_UP","OTHER"] as const;
const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  NOTE: "备注", EMAIL: "邮件", CALL: "电话", MEETING: "会议",
  QUOTE: "报价", SAMPLE: "样品", FOLLOW_UP: "跟进", OTHER: "其他",
};

const STATUS_TONES: Record<string, "neutral" | "success" | "warning" | "accent"> = {
  NEW: "accent", CONTACTED: "accent", QUALIFIED: "warning", QUOTING: "warning",
  SAMPLE: "warning", TESTING: "warning", NEGOTIATION: "warning", WON: "success", LOST: "neutral",
};

interface Attachment { id: string; fileName: string; fileUrl: string; mimeType?: string | null; }
interface Activity { id: string; type: string; title: string; content?: string | null; createdByName?: string | null; createdAt: string; }

interface InquiryDetail {
  id: string;
  inquiryNumber: string;
  inquiryType: string;
  customerName?: string | null;
  companyName?: string | null;
  email: string;
  phone?: string | null;
  country?: string | null;
  productModel?: string | null;
  variantName?: string | null;
  variantSku?: string | null;
  quantity?: number | null;
  message?: string | null;
  status: string;
  priority?: string | null;
  source?: string | null;
  createdAt: string;
  attachments?: Attachment[];
  activities?: Activity[];
  internalNotes?: string | null;
  [key: string]: unknown;
}

function fmt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function Label({ children }: { children: React.ReactNode }) {
  return <dt className="text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">{children}</dt>;
}
function Value({ children }: { children: React.ReactNode }) {
  return <dd className="mt-0.5 text-sm text-[#0A0A0A]">{children || "—"}</dd>;
}

export default function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [activityForm, setActivityForm] = useState({ type: "NOTE", title: "", content: "" });
  const [addingActivity, setAddingActivity] = useState(false);

  const fetchDetail = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { signal, cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        setError((json as { error?: string }).error || "Failed to load");
        return;
      }
      const body = (json?.data?.data ?? json?.data ?? json) as InquiryDetail;
      setInquiry(body);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctl = new AbortController();
    fetchDetail(ctl.signal);
    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onStatusChange = async (next: string) => {
    if (!inquiry || next === inquiry.status) return;
    setSavingStatus(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || `Status update failed (${res.status})`);
        return;
      }
      await fetchDetail();
    } catch {
      setError("Network error while updating status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const onAddActivity = async () => {
    if (!activityForm.title.trim()) return;
    setAddingActivity(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activityForm.type, title: activityForm.title.trim(), content: activityForm.content.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || "Failed to add activity");
        return;
      }
      setActivityForm({ type: "NOTE", title: "", content: "" });
      await fetchDetail();
    } catch {
      setError("Network error while adding activity.");
    } finally {
      setAddingActivity(false);
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

  if (error || !inquiry) {
    return (
      <div className="space-y-4">
        <div role="alert" className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error ?? "未找到该询盘。"}</span>
        </div>
        <button type="button" onClick={() => router.push("/admin/inquiries")}
          className="inline-flex h-9 items-center rounded-md border border-[#E4E4E7] bg-white px-3 text-sm font-medium text-[#52525B] hover:border-[#0A0A0A] hover:text-[#0A0A0A]">
          返回列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.push("/admin/inquiries")} className="rounded-md p-1.5 text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A]">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]" style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}>
            {inquiry.inquiryNumber}
          </h1>
          <p className="mt-1 text-sm text-[#71717A]">{inquiry.email} · {fmt(inquiry.createdAt)}</p>
        </div>
        <StatusBadge tone={STATUS_TONES[inquiry.status] ?? "neutral"}>{STATUS_LABELS[inquiry.status] ?? inquiry.status}</StatusBadge>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left: details + status */}
        <div className="space-y-5 lg:col-span-2">
          {/* Customer / product info */}
          <section className="rounded-xl border border-[#E4E4E7] bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]">详情</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div><Label>客户</Label><Value>{inquiry.customerName}</Value></div>
              <div><Label>公司</Label><Value>{inquiry.companyName}</Value></div>
              <div><Label>邮箱</Label><Value>{inquiry.email}</Value></div>
              <div><Label>电话</Label><Value>{inquiry.phone}</Value></div>
              <div><Label>国家</Label><Value>{inquiry.country}</Value></div>
              <div><Label>类型</Label><Value>{inquiry.inquiryType}</Value></div>
              <div><Label>产品</Label><Value>{inquiry.productModel}</Value></div>
              <div><Label>变体 / SKU</Label><Value>{inquiry.variantName || inquiry.variantSku}</Value></div>
              <div><Label>数量</Label><Value>{inquiry.quantity}</Value></div>
              <div><Label>优先级</Label><Value>{inquiry.priority}</Value></div>
              <div><Label>来源</Label><Value>{inquiry.source}</Value></div>
            </dl>
            {inquiry.message && (
              <div className="mt-4">
                <Label>留言</Label>
                <p className="mt-1 rounded-md bg-[#FAFAFA] p-3 text-sm text-[#0A0A0A] whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            )}
            {inquiry.internalNotes && (
              <div className="mt-4">
                <Label>内部备注</Label>
                <p className="mt-1 rounded-md bg-[#FFF7ED] p-3 text-sm text-[#0A0A0A]">{inquiry.internalNotes}</p>
              </div>
            )}
            {inquiry.attachments && inquiry.attachments.length > 0 && (
              <div className="mt-4">
                <Label>附件</Label>
                <ul className="mt-1 space-y-1">
                  {inquiry.attachments.map((a) => (
                    <li key={a.id}>
                      <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-[#2563EB] hover:underline">
                        {a.fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Activities */}
          <section className="rounded-xl border border-[#E4E4E7] bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]">跟进记录</h2>
            <div className="mb-4 rounded-md border border-[#E4E4E7] p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <select
                  value={activityForm.type}
                  onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                  disabled={addingActivity}
                  className="h-8 rounded-md border border-[#E4E4E7] bg-white px-2 text-xs text-[#0A0A0A]"
                >
                  {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{ACTIVITY_TYPE_LABELS[t] ?? t}</option>)}
                </select>
                <input
                  placeholder="标题 *"
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  disabled={addingActivity}
                  className="h-8 rounded-md border border-[#E4E4E7] bg-white px-2 text-xs text-[#0A0A0A] sm:col-span-2"
                />
                <textarea
                  placeholder="内容（可选）"
                  rows={2}
                  value={activityForm.content}
                  onChange={(e) => setActivityForm({ ...activityForm, content: e.target.value })}
                  disabled={addingActivity}
                  className="w-full rounded-md border border-[#E4E4E7] bg-white px-2 py-1.5 text-xs text-[#0A0A0A] sm:col-span-2"
                />
              </div>
              <button
                type="button"
                onClick={onAddActivity}
                disabled={addingActivity || !activityForm.title.trim()}
                className="mt-2 inline-flex h-8 items-center rounded-md bg-[#0A0A0A] px-3 text-xs font-semibold text-white hover:bg-[#27272A] disabled:opacity-50"
              >
                {addingActivity ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "添加跟进"}
              </button>
            </div>

            {inquiry.activities && inquiry.activities.length > 0 ? (
              <ul className="space-y-3">
                {inquiry.activities.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2563EB]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#0A0A0A]">{a.title}</span>
                        <StatusBadge tone="accent">{ACTIVITY_TYPE_LABELS[a.type] ?? a.type}</StatusBadge>
                      </div>
                      {a.content && <p className="mt-1 text-sm text-[#52525B] whitespace-pre-wrap">{a.content}</p>}
                      <div className="mt-1 text-xs text-[#A1A1AA]">
                        {a.createdByName || "System"} · {fmt(a.createdAt)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-sm text-[#71717A]">暂无跟进记录。</p>
            )}
          </section>
        </div>

        {/* Right: status change */}
        <aside className="space-y-5">
          <section className="rounded-xl border border-[#E4E4E7] bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]">状态</h2>
            <select
              value={inquiry.status}
              onChange={(e) => onStatusChange(e.target.value)}
              disabled={savingStatus}
              className="h-9 w-full rounded-md border border-[#E4E4E7] bg-white px-3 text-sm text-[#0A0A0A] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:opacity-60"
            >
              {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>)}
            </select>
            <p className="mt-3 text-xs text-[#A1A1AA]">
              状态变更会记录在跟进日志中。
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
