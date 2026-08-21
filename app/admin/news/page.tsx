"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  Tag,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/app/admin/layout";

// Types
interface NewsPost {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  featured: boolean;
  publishedAt: string | null;
  viewCount: number;
  category: { id: string; slug: string } | null;
  createdAt: string;
  coverImage?: string;
}

interface NewsResponse {
  success: boolean;
  items: NewsPost[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

interface DeleteConfirm {
  id: string;
  title: string;
}

// News page translations
const newsTranslations = {
  en: {
    title: "News Management",
    subtitle: "Manage news articles and blog posts",
    searchPlaceholder: "Search articles...",
    filter: "Filter",
    addArticle: "Add Article",
    view: "View",
    edit: "Edit",
    noArticles: "No articles found",
    published: "Published",
    draft: "Draft",
    featured: "Featured",
    loading: "Loading...",
    deleteConfirm: "Are you sure you want to delete this article?",
    deleteSuccess: "Article deleted successfully",
    deleteError: "Failed to delete article",
    delete: "Delete",
    cancel: "Cancel",
    views: "views",
  },
  zh: {
    title: "新闻管理",
    subtitle: "管理新闻和博客文章",
    searchPlaceholder: "搜索文章...",
    filter: "筛选",
    addArticle: "添加文章",
    view: "预览",
    edit: "编辑",
    noArticles: "未找到文章",
    published: "已发布",
    draft: "草稿",
    featured: "精选",
    loading: "加载中...",
    deleteConfirm: "确定要删除这篇文章吗？",
    deleteSuccess: "文章删除成功",
    deleteError: "删除文章失败",
    delete: "删除",
    cancel: "取消",
    views: "次阅读",
  },
};

export default function NewsAdminPage() {
  const { locale } = useAdmin();
  const router = useRouter();
  const t = newsTranslations[locale];

  // State
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Fetch posts
  const fetchPosts = useCallback(async (search: string, pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "12",
      });
      if (search) params.set("search", search);

      const response = await fetch(`/api/admin/news?${params.toString()}`);
      const data: NewsResponse = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (response.status === 403) {
          router.push("/403");
          return;
        }
        throw new Error(data.error || "Failed to fetch news");
      }

      setPosts(data.items || []);
      setTotalPages(data.meta?.totalPages || 1);
      setTotal(data.meta?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Initial fetch
  useEffect(() => {
    fetchPosts(searchQuery, page);
  }, [fetchPosts, searchQuery, page]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/news/${deleteConfirm.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete");
      }

      setDeleteSuccess(true);
      setDeleteConfirm(null);

      // Refresh list
      fetchPosts(searchQuery, page);

      // Clear success message after 3 seconds
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  // Get category color
  const getCategoryColor = (categorySlug: string | null | undefined) => {
    const colors: Record<string, string> = {
      technology: "#3B82F6",
      business: "#10B981",
      report: "#8B5CF6",
      product: "#F59E0B",
      company: "#EC4899",
      industry: "#6366F1",
    };
    return colors[categorySlug || ""] || "#3B82F6";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "zh" ? "zh-CN" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {t.title}
          </h1>
          <p className="text-white/50 mt-1">
            {total > 0 ? `${total} ${locale === "zh" ? "篇文章" : "articles"}` : t.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/news/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t.addArticle}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          {t.filter}
        </Button>
      </div>

      {/* Success Message */}
      {deleteSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
          <CheckCircle className="w-5 h-5" />
          <span>{t.deleteSuccess}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
          <span className="ml-3 text-white/60">{t.loading}</span>
        </div>
      ) : (
        <>
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.10] transition-colors"
              >
                {/* Image */}
                <div className="relative aspect-video bg-[#1F2937]">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getCategoryColor(post.category?.slug)}20`,
                        color: getCategoryColor(post.category?.slug),
                        border: `1px solid ${getCategoryColor(post.category?.slug)}40`,
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {post.category?.slug || "Uncategorized"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    {post.featured && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30">
                        {t.featured}
                      </span>
                    )}
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? "bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30"
                          : "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30"
                      }`}
                    >
                      {post.published ? t.published : t.draft}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-medium mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-white/40 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.viewCount} {t.views}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/news/${post.slug}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {t.view}
                    </Link>
                    <Link
                      href={`/admin/news/${post.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      {t.edit}
                    </Link>
                    <button
                      onClick={() =>
                        setDeleteConfirm({ id: post.id, title: post.title })
                      }
                      className="flex items-center justify-center px-3 py-2 text-white/60 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {posts.length === 0 && !error && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">{t.noArticles}</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-white/60 px-4">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {t.delete}
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-white/70 mb-6">
              {t.deleteConfirm}
              <br />
              <span className="text-white font-medium">&ldquo;{deleteConfirm.title}&rdquo;</span>
            </p>

            {deleteError && (
              <div className="mb-4 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
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
                {t.delete}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
