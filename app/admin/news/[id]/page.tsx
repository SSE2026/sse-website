"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  X,
  Eye,
  Trash2,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAdmin } from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// News translations
const newsTranslations = {
  en: {
    title: "Edit Article",
    titleNew: "New Article",
    basicInfo: "Basic Information",
    titleField: "Title",
    titleFieldZh: "Title (Chinese)",
    excerpt: "Excerpt",
    excerptZh: "Excerpt (Chinese)",
    category: "Category",
    selectCategory: "Select category",
    content: "Content",
    contentZh: "Content (Chinese)",
    featuredImage: "Featured Image",
    uploadImage: "Upload Image",
    removeImage: "Remove",
    settings: "Settings",
    status: "Status",
    published: "Published",
    draft: "Draft",
    author: "Author",
    publishDate: "Publish Date",
    slug: "URL Slug",
    slugHelp: "Auto-generated from title if empty",
    save: "Save Changes",
    saving: "Saving...",
    cancel: "Cancel",
    viewArticle: "View Article",
    deleteArticle: "Delete Article",
    deleteConfirm: "Are you sure you want to delete this article?",
    deleteSuccess: "Article deleted successfully",
    deleteError: "Failed to delete article",
    loadError: "Failed to load article",
    saveSuccess: "Article saved successfully",
    saveError: "Failed to save article",
    loading: "Loading...",
    noCategory: "No Category",
  },
  zh: {
    title: "编辑文章",
    titleNew: "新建文章",
    basicInfo: "基本信息",
    titleField: "标题",
    titleFieldZh: "标题（中文）",
    excerpt: "摘要",
    excerptZh: "摘要（中文）",
    category: "分类",
    selectCategory: "选择分类",
    content: "正文",
    contentZh: "正文（中文）",
    featuredImage: "封面图片",
    uploadImage: "上传图片",
    removeImage: "移除",
    settings: "设置",
    status: "状态",
    published: "已发布",
    draft: "草稿",
    author: "作者",
    publishDate: "发布日期",
    slug: "URL别名",
    slugHelp: "留空则自动从标题生成",
    save: "保存更改",
    saving: "保存中...",
    cancel: "取消",
    viewArticle: "预览文章",
    deleteArticle: "删除文章",
    deleteConfirm: "确定要删除这篇文章吗？",
    deleteSuccess: "文章删除成功",
    deleteError: "删除文章失败",
    loadError: "加载文章失败",
    saveSuccess: "文章保存成功",
    saveError: "保存文章失败",
    loading: "加载中...",
    noCategory: "无分类",
  },
};

// Types
interface Category {
  id: string;
  slug: string;
  name: string;
  postCount: number;
}

interface NewsFormData {
  title: string;
  titleZh: string;
  excerpt: string;
  excerptZh: string;
  content: string;
  contentZh: string;
  slug: string;
  coverImage: string;
  published: boolean;
  authorName: string;
  publishedAt: string;
  categoryId: string;
}

interface NewsDetailResponse {
  success: boolean;
  data?: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    coverImage: string | null;
    authorName: string | null;
    categoryId: string | null;
    published: boolean;
    publishedAt: string | null;
    translations: Array<{
      locale: string;
      title: string;
      excerpt: string | null;
      content: string | null;
    }>;
  };
  error?: string;
}

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useAdmin();
  const t = newsTranslations[locale];
  const newsId = params.id as string;

  const isNew = newsId === "new";

  // State
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    titleZh: "",
    excerpt: "",
    excerptZh: "",
    content: "",
    contentZh: "",
    slug: "",
    coverImage: "",
    published: false,
    authorName: "",
    publishedAt: new Date().toISOString().split("T")[0],
    categoryId: "",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/news/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch existing article
  const fetchArticle = useCallback(async () => {
    if (isNew) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/news/${newsId}`);
      const data: NewsDetailResponse = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (response.status === 403) {
          router.push("/403");
          return;
        }
        if (response.status === 404) {
          setError("Article not found");
          return;
        }
        throw new Error(data.error || "Failed to load article");
      }

      const article = data.data;

      if (!article) {
        throw new Error(data.error || "Article not found");
      }

      // Find translations
      const enTrans = article.translations?.find((t) => t.locale === "en");
      const zhTrans = article.translations?.find((t) => t.locale === "zh-CN");

      setFormData({
        title: enTrans?.title || article.title || "",
        titleZh: zhTrans?.title || "",
        excerpt: enTrans?.excerpt || article.excerpt || "",
        excerptZh: zhTrans?.excerpt || "",
        content: enTrans?.content || article.content || "",
        contentZh: zhTrans?.content || "",
        slug: article.slug || "",
        coverImage: article.coverImage || "",
        published: article.published || false,
        authorName: article.authorName || "",
        publishedAt: article.publishedAt
          ? new Date(article.publishedAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        categoryId: article.categoryId || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load article");
    } finally {
      setLoading(false);
    }
  }, [isNew, newsId, router]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Handle save
  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Generate slug if empty
      const slug = formData.slug.trim() || generateSlug(formData.title);

      const payload = {
        slug,
        title: formData.title,
        titleZh: formData.titleZh,
        excerpt: formData.excerpt,
        excerptZh: formData.excerptZh,
        content: formData.content,
        contentZh: formData.contentZh,
        coverImage: formData.coverImage,
        published: formData.published,
        authorName: formData.authorName,
        categoryId: formData.categoryId || null,
        publishedAt: formData.publishedAt || null,
      };

      const url = isNew
        ? "/api/admin/news"
        : `/api/admin/news/${newsId}`;
      const method = isNew ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save");
      }

      setSaveSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/news");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/news/${newsId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete");
      }

      setDeleteSuccess(true);
      setTimeout(() => {
        router.push("/admin/news");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setDeleting(false);
    }
  };

  // Get current slug for view link
  const viewSlug = formData.slug || (formData.title ? generateSlug(formData.title) : newsId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
        <span className="ml-3 text-white/60">{t.loading}</span>
      </div>
    );
  }

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
              {isNew ? t.titleNew : t.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Link href={`/news/${viewSlug}`} target="_blank">
              <Button variant="ghost">
                <Eye className="w-4 h-4 mr-2" />
                {t.viewArticle}
              </Button>
            </Link>
          )}
          <Link href="/admin/news">
            <Button variant="ghost">{t.cancel}</Button>
          </Link>
          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? t.saving : t.save}
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
          <CheckCircle className="w-5 h-5" />
          <span>{t.saveSuccess}</span>
        </div>
      )}
      {deleteSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
          <CheckCircle className="w-5 h-5" />
          <span>{t.deleteSuccess}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

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
                required
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
                  placeholder="Article content in English (supports Markdown)..."
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2">中文</label>
                <textarea
                  value={formData.contentZh}
                  onChange={(e) => setFormData({ ...formData, contentZh: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none font-mono text-sm"
                  placeholder="中文文章内容（支持 Markdown）..."
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
                    onClick={() => setFormData({ ...formData, published: true })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      formData.published
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                        : "bg-white/[0.03] text-white/60 border border-white/[0.10] hover:border-white/[0.20]"
                    }`}
                  >
                    {t.published}
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, published: false })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      !formData.published
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
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-[#3B82F6]"
                >
                  <option value="">{t.selectCategory}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.postCount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">{t.author}</label>
                <Input
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">{t.publishDate}</label>
                <input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">{t.slug}</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                />
                <p className="text-xs text-white/40 mt-1">{t.slugHelp}</p>
              </div>

              {!isNew && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t.deleteArticle}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="p-6 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">{t.featuredImage}</h2>
            {formData.coverImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={formData.coverImage}
                  alt="Featured image"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setFormData({ ...formData, coverImage: "" })}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                />
                <p className="text-xs text-white/40 mt-2">{t.uploadImage} (URL)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">{t.deleteArticle}</h3>
            <p className="text-white/70 mb-6">{t.deleteConfirm}</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                {t.cancel}
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {t.deleteArticle}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
