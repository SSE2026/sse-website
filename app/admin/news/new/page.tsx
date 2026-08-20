"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Eye,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
} from "lucide-react";
import { useAdmin } from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// News translations (shared with edit page)
const newsTranslations = {
  en: {
    titleNew: "New Article",
    basicInfo: "Basic Information",
    titleField: "Title",
    titleFieldZh: "Title (Chinese)",
    excerpt: "Excerpt",
    excerptZh: "Excerpt (Chinese)",
    category: "Category",
    content: "Content",
    contentZh: "Content (Chinese)",
    featuredImage: "Featured Image",
    uploadImage: "Upload Image",
    settings: "Settings",
    status: "Status",
    published: "Published",
    draft: "Draft",
    author: "Author",
    publishDate: "Publish Date",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    categories: {
      Technology: "Technology",
      Business: "Business",
      Report: "Report",
      News: "News",
    },
  },
  zh: {
    titleNew: "新建文章",
    basicInfo: "基本信息",
    titleField: "标题",
    titleFieldZh: "标题（中文）",
    excerpt: "摘要",
    excerptZh: "摘要（中文）",
    category: "分类",
    content: "正文",
    contentZh: "正文（中文）",
    featuredImage: "封面图片",
    uploadImage: "上传图片",
    settings: "设置",
    status: "状态",
    published: "已发布",
    draft: "草稿",
    author: "作者",
    publishDate: "发布日期",
    save: "保存",
    saving: "保存中...",
    cancel: "取消",
    categories: {
      Technology: "技术",
      Business: "业务",
      Report: "报告",
      News: "新闻",
    },
  },
};

interface NewsFormData {
  title: string;
  titleZh: string;
  excerpt: string;
  excerptZh: string;
  category: string;
  content: string;
  contentZh: string;
  featuredImage: string;
  status: "published" | "draft";
  author: string;
  publishDate: string;
}

export default function NewNewsPage() {
  const router = useRouter();
  const { locale } = useAdmin();
  const t = newsTranslations[locale];

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    titleZh: "",
    excerpt: "",
    excerptZh: "",
    category: "News",
    content: "",
    contentZh: "",
    featuredImage: "",
    status: "draft",
    author: "Admin",
    publishDate: new Date().toISOString().split("T")[0],
  });

  const categoryOptions = Object.entries(t.categories).map(([value, label]) => ({
    value,
    label,
  }));

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    router.push("/admin/news");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/news"
            className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {t.titleNew}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/news">
            <Button variant="ghost">{t.cancel}</Button>
          </Link>
          <Button onClick={handleSave} loading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? t.saving : t.save}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">{t.basicInfo}</h2>
            <div className="space-y-4">
              <Input
                label={t.titleField}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter article title..."
              />
              <Input
                label={t.titleFieldZh}
                value={formData.titleZh}
                onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                placeholder="输入文章标题..."
              />
              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
                  {t.excerpt}
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                  placeholder="Brief description for article preview..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
                  {t.excerptZh}
                </label>
                <textarea
                  value={formData.excerptZh}
                  onChange={(e) => setFormData({ ...formData, excerptZh: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none"
                  placeholder="简短描述，用于文章预览..."
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{t.content}</h2>
              <div className="flex items-center gap-1">
                <button className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">
                  <Bold className="w-4 h-4" />
                </button>
                <button className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">
                  <Italic className="w-4 h-4" />
                </button>
                <button className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-2">English</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none font-mono text-sm"
                  placeholder="Article content in English..."
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2">中文</label>
                <textarea
                  value={formData.contentZh}
                  onChange={(e) => setFormData({ ...formData, contentZh: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none font-mono text-sm"
                  placeholder="中文文章内容..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">{t.settings}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">{t.status}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, status: "published" })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      formData.status === "published"
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10] hover:border-white/[0.20]"
                    }`}
                  >
                    {t.published}
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, status: "draft" })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      formData.status === "draft"
                        ? "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10] hover:border-white/[0.20]"
                    }`}
                  >
                    {t.draft}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">{t.category}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-[#3B82F6]"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">{t.author}</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">{t.publishDate}</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">{t.featuredImage}</h2>
            {formData.featuredImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.featuredImage}
                  alt="Featured image"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setFormData({ ...formData, featuredImage: "" })}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button className="w-full aspect-video rounded-lg border-2 border-dashed border-white/[0.10] hover:border-[#3B82F6]/50 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-[#3B82F6] transition-colors">
                <Upload className="w-8 h-8" />
                <span className="text-sm">{t.uploadImage}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
