"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/app/admin/layout";

// 模拟新闻数据
const newsItems = [
  {
    id: "1",
    title: "Solid-State Battery Breakthrough Achieved",
    titleZh: "固态电池技术取得重大突破",
    category: "Technology",
    categoryZh: "技术",
    author: "Admin",
    date: "2024-07-15",
    status: "published",
    statusZh: "已发布",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&q=80",
    views: 1250,
  },
  {
    id: "2",
    title: "New Partnership with European Drone Manufacturer",
    titleZh: "与欧洲无人机厂商建立合作",
    category: "Business",
    categoryZh: "业务",
    author: "Admin",
    date: "2024-07-10",
    status: "published",
    statusZh: "已发布",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&q=80",
    views: 890,
  },
  {
    id: "3",
    title: "Industry Report: UAV Battery Market 2024",
    titleZh: "行业报告：2024年无人机电池市场",
    category: "Report",
    categoryZh: "报告",
    author: "Admin",
    date: "2024-07-05",
    status: "draft",
    statusZh: "草稿",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    views: 0,
  },
];

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
  },
};

export default function NewsAdminPage() {
  const { locale } = useAdmin();
  const isLocale = locale;
  const t = newsTranslations[isLocale];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = newsItems.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.titleZh.includes(searchQuery)
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: "#3B82F6",
      Business: "#10B981",
      Report: "#8B5CF6",
    };
    return colors[category] || "#3B82F6";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {t.title}
          </h1>
          <p className="text-white/50 mt-1">
            {t.subtitle}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          {t.filter}
        </Button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.10] transition-colors"
          >
            {/* Image */}
            <div className="relative aspect-video">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${getCategoryColor(news.category)}20`,
                    color: getCategoryColor(news.category),
                    border: `1px solid ${getCategoryColor(news.category)}40`,
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {isLocale === "en" ? news.category : news.categoryZh}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    news.status === "published"
                      ? "bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30"
                      : "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30"
                  }`}
                >
                  {news.status === "published" ? t.published : t.draft}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-white font-medium mb-2 line-clamp-2">
                {isLocale === "en" ? news.title : news.titleZh}
              </h3>
              <div className="flex items-center gap-4 text-sm text-white/40 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {news.date}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {news.views}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/news/${news.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {t.view}
                </Link>
                <Link
                  href={`/admin/news/${news.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {t.edit}
                </Link>
                <button className="flex items-center justify-center px-3 py-2 text-white/60 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">
            {t.noArticles}
          </p>
        </div>
      )}
    </div>
  );
}
