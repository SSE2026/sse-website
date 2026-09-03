"use client";

import React, { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorFollower } from "@/components/ui/animations";
import { ArrowUpRight, Copy, Check, MapPin, Globe, Clock } from "lucide-react";
import ContactMap from "@/components/contact/ContactMap/ContactMap";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { useCmsContent } from "@/lib/cms/use-cms";

const messages = { en, zh };

// 咨询类型选项
const inquiryTags = {
  zh: ["商务合作", "电芯及模组订制", "样品申请", "技术咨询"],
  en: ["Business Cooperation", "Cell & Module Design", "Sample Request", "Technical Support"],
};

export default function ContactPage() {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const isZh = locale === "zh";
  const currentMessages = messages[locale];

  // CMS overrides for contact info + title/subtitle + form block.
  const cms = useCmsContent("contact", locale) as {
    contact?: { title?: string; subtitle?: string; email?: string; phone?: string; address?: string; studioTitle?: string; studioDesc?: string };
  };
  const c = cms.contact ?? {};

  // 公司信息
  const contactData = {
    address: c.address || (isZh
      ? "深圳市坪山区坑梓街道沙田社区坪山大道6352号2栋210"
      : "Unit 210, Building 2, No. 6352 Pingshan Avenue, Shatian Community, Kengzi Subdistrict, Pingshan District, Shenzhen"),
    phone: c.phone || "+86 13651071130",
    email: c.email || "changhao@ssebatt.com",
    coords: { lng: 114.402008, lat: 22.760216 },
  };

  // 文本内容
  const content = {
    sectionLabel: "04 / Contact & Engagement",
    title: c.title || (isZh ? "与深安锂能\n工程团队取得联系" : "Connect with SSE\nEngineering Team"),
    subtitle: c.subtitle || (isZh
      ? "专注于低空飞行与智能装备电源解决方案。无论您需要电池模组规格评估、样品调测或商务合作，我们随时提供专业支持。"
      : "Focusing on low-altitude flight and intelligent equipment power solutions. Whether you need battery module evaluation, sample testing, or business cooperation, we provide professional support."),
    locationTitle: isZh ? "Location / 总部" : "Location / HQ",
    contactTitle: isZh ? "Direct Reach / 联系方式" : "Direct Reach / Contact",
    serviceTitle: isZh ? "Service SLA / 服务响应" : "Service SLA / Response",
    companyName: isZh
      ? "深安锂能（深圳）科技有限公司"
      : "Swift Safe Energy (Shenzhen) Tech Co., Ltd.",
    phoneLabel: isZh ? "Phone" : "Phone",
    emailLabel: isZh ? "Email" : "Email",
    slaTitle: isZh ? "24h 快速工程响应" : "24h Fast Engineering Response",
    slaDesc: isZh
      ? "技术团队将直接参与评估需求，最快 1 个工作日内提供初步定制可行性报告。"
      : "Our technical team will directly evaluate your requirements and provide an initial customization feasibility report within 1 business day.",
    mapLabel: isZh ? "深圳总部" : "Shenzhen HQ",
    mapSub: isZh ? "深圳总部" : "Shenzhen HQ",
    mapAddr: isZh ? "坪山大道6352号2栋" : "No. 6352 Pingshan Avenue, Bldg 2",
    navigateBtn: isZh ? "高德地图导航去总部" : "Navigate with AutoNavi",
    studioTitle: c.studioTitle || (isZh ? "在线提交需求" : "Submit Your Request"),
    studioDesc: c.studioDesc || (isZh
      ? "请选择您的咨询类型，我们的技术经理将根据您勾选的业务类别配备对应的工程人员与您对接。"
      : "Please select your inquiry type, and our technical manager will connect you with the appropriate engineering staff."),
    nameLabel: isZh ? "您的姓名 / Name *" : "Name / 姓名 *",
    namePlaceholder: isZh ? "例如：张经理" : "e.g., John Smith",
    emailContactLabel: isZh ? "工作邮箱 / Email *" : "Email / 邮箱 *",
    emailPlaceholder: isZh ? "name@company.com" : "name@company.com",
    companyLabel: isZh ? "公司名称 / Company" : "Company / 公司",
    companyPlaceholder: isZh ? "您的公司全称" : "Company name",
    phoneContactLabel: isZh ? "联系电话" : "Phone",
    phoneContactPlaceholder: isZh ? "您的联系电话" : "Phone number",
    messageLabel: isZh ? "需求描述 / Project Details *" : "Project Details / 需求描述 *",
    messagePlaceholder: isZh
      ? (tag: string) => `当前选择分类：[${tag}]。请简要说明您的应用场景、电池规格要求（如电压、容量、倍率等）...`
      : (tag: string) => `Category: [${tag}]. Please describe your application, battery specs (voltage, capacity, rate, etc.)...`,
    submitAgree: isZh
      ? "* 提交即代表您同意我们将信息用于技术沟通"
      : "* By submitting, you agree to use this information for technical communication",
    submitBtn: isZh ? "发送信息 Send Request ↗" : "Send Request ↗",
    submittedText: isZh ? "已成功发送 Request Sent" : "Request Sent Successfully",
    copied: isZh ? "已复制" : "Copied",
    copyAddress: isZh ? "复制地址" : "Copy Address",
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // 咨询类型 → inquiryType
    const typeMap: Array<"PRODUCT" | "CUSTOM" | "GENERAL"> = ["GENERAL", "CUSTOM", "PRODUCT", "GENERAL"];
    const inquiryType = typeMap[selectedTag] || "GENERAL";

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType,
          customerName: formData.name,
          email: formData.email,
          companyName: formData.company || undefined,
          phone: formData.phone || undefined,
          message: formData.message || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(
          (data as { error?: string }).error || "Failed to send. Please try again.",
        );
        return;
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", phone: "", message: "" });
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ScrollProgress color="#2563eb" height="sm" />
      <CursorFollower color="rgba(37, 99, 235, 0.05)" size={400} />

      <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
          forceLightText={false}
        />

        <main className="pt-16">
          <section className="w-full bg-neutral-50 text-neutral-900 py-16 px-4 md:px-12 font-sans antialiased border-t border-neutral-200">
            <div className="max-w-7xl mx-auto space-y-16">
              {/* ==================== 1. 顶部 Header ==================== */}
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight whitespace-pre-line">
                  {content.title}
                </h1>
                <p className="text-neutral-600 text-base mt-4 leading-relaxed">
                  {content.subtitle}
                </p>
              </div>

              {/* ==================== 2. 在线提交需求 ==================== */}
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  {/* 表单左侧说明与类别切换 */}
                  <div className="lg:col-span-4 space-y-6">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-2">
                        Inquiry Studio
                      </span>
                      <h3 className="text-xl font-semibold text-neutral-900">{content.studioTitle}</h3>
                    </div>

                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {content.studioDesc}
                    </p>

                    {/* 咨询类型纵向 Toggle */}
                    <div className="space-y-2">
                      {inquiryTags[locale].map((tag, index) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(index)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center justify-between border ${
                            selectedTag === index
                              ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                              : "border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
                          }`}
                        >
                          <span>{tag}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              selectedTag === index ? "bg-blue-500" : "bg-transparent"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 表单右侧 */}
                  <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-8 md:p-10 shadow-sm">
                    {submitted ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <Check className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                          {content.submittedText}
                        </h3>
                        <p className="text-neutral-500 text-sm mb-6">
                          {isZh ? "我们的团队将尽快与您联系" : "Our team will contact you soon"}
                        </p>
                        <button
                          onClick={() => setSubmitted(false)}
                          className="px-6 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium transition-colors"
                        >
                          {isZh ? "继续留言" : "Send Another"}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 姓名 */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-600 block">
                              {content.nameLabel}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={content.namePlaceholder}
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                            />
                          </div>

                          {/* 邮箱 */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-600 block">
                              {content.emailContactLabel}
                            </label>
                            <input
                              type="email"
                              required
                              placeholder={content.emailPlaceholder}
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 公司 */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-600 block">
                              {content.companyLabel}
                            </label>
                            <input
                              type="text"
                              placeholder={content.companyPlaceholder}
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="w-full bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                            />
                          </div>

                          {/* 联系电话 */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-600 block">
                              {content.phoneContactLabel}
                            </label>
                            <input
                              type="tel"
                              placeholder={content.phoneContactPlaceholder}
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* 需求描述 */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-neutral-600 block">
                            {content.messageLabel}
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder={content.messagePlaceholder(inquiryTags[locale][selectedTag])}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all resize-none"
                          />
                        </div>

                        {/* 提交按钮 */}
                        <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                          <span className="text-xs text-neutral-400">
                            {content.submitAgree}
                          </span>

                          {submitError && (
                            <span className="text-xs text-red-600">{submitError}</span>
                          )}

                          <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {submitting
                              ? (isZh ? "发送中…" : "Sending…")
                              : content.submitBtn}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* ==================== 3. 三列信息矩阵 ==================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 border-y border-neutral-200 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                {/* 列 1：总部地址 */}
                <div className="py-6 md:p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    <span>{content.locationTitle}</span>
                    <MapPin className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-sm font-medium text-neutral-900 leading-snug">
                    {content.companyName}
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {contactData.address}
                  </p>
                  <button
                    onClick={() => handleCopy(contactData.address, "address")}
                    className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-blue-600 transition-colors"
                  >
                    {copiedField === "address" ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> {content.copied}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3.5 h-3.5" /> {content.copyAddress}
                      </span>
                    )}
                  </button>
                </div>

                {/* 列 2：直接通道 */}
                <div className="py-6 md:p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    <span>{content.contactTitle}</span>
                    <Globe className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-neutral-400 uppercase block mb-1">
                        {content.phoneLabel}
                      </span>
                      <a
                        href={`tel:${contactData.phone}`}
                        className="text-sm text-neutral-700 hover:text-blue-600 transition-colors"
                      >
                        {contactData.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 uppercase block mb-1">
                        {content.emailLabel}
                      </span>
                      <a
                        href={`mailto:${contactData.email}`}
                        className="text-sm text-neutral-700 hover:text-blue-600 transition-colors"
                      >
                        {contactData.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 uppercase block mb-1">
                        {isZh ? "WhatsApp" : "WhatsApp"}
                      </span>
                      <a
                        href="https://wa.me/8613651071130"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-700 hover:text-[#25D366] transition-colors inline-flex items-center gap-1.5"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#25D366]">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {isZh ? "扫码或点击联系" : "Scan or click to chat"}
                      </a>
                      <div className="mt-2 inline-block bg-white p-1.5 rounded-lg border border-neutral-200 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/whatsapp-qr.jpg" alt="WhatsApp QR" className="w-20 h-20 object-contain" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 列 3：响应承诺 */}
                <div className="py-6 md:p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    <span>{content.serviceTitle}</span>
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-sm text-neutral-700 leading-relaxed">
                    <span className="text-blue-600 font-semibold">{content.slaTitle}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{content.slaDesc}</p>
                </div>
              </div>

              {/* ==================== 4. 沉浸式地图画廊 ==================== */}
              <div className="relative w-full h-[320px] md:h-[400px] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                {/* 地图组件 */}
                <div className="absolute inset-0 w-full h-full">
                  <ContactMap locale={locale} />
                </div>

                {/* 悬浮品牌地标卡 (左上角) */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-xl p-3 hidden md:block max-w-[200px] shadow-lg">
                  <div className="text-sm font-semibold text-neutral-900 mb-0.5">{content.mapSub}</div>
                  <div className="text-xs text-neutral-500">{contactData.address.split('2')[0]}2...</div>
                </div>

                {/* 悬浮导航按钮 (右下角) */}
                <a
                  href={`https://uri.amap.com/marker?coordinate=${contactData.coords.lng},${contactData.coords.lat}&name=${encodeURIComponent(content.companyName)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
                >
                  <span>{content.navigateBtn}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer translations={currentMessages} locale={locale} />
      </NextIntlClientProvider>
    </>
  );
}
