"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsHero } from "@/components/news/NewsHero";
import { FeaturedNews } from "@/components/news/FeaturedNews";
import { NewsFilter } from "@/components/news/NewsFilter";
import { NewsList } from "@/components/news/NewsList";
import { NewsPagination } from "@/components/news/NewsPagination";
import { NewsCTA } from "@/components/news/NewsCTA";
import { Loader2 } from "lucide-react";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };
const ITEMS_PER_PAGE = 5;

// Types
interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  authorName: string | null;
  category: { id: string; slug: string; name: string } | null;
  tags: string[];
  publishedAt: string | null;
  viewCount: number;
}

interface NewsResponse {
  success: boolean;
  items: NewsItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

type Category = "ALL" | "COMPANY" | "TECHNOLOGY" | "PRODUCT" | "INDUSTRY";

const CATEGORIES: readonly Category[] = ["ALL", "COMPANY", "TECHNOLOGY", "PRODUCT", "INDUSTRY"] as const;

const getCategoryLabel = (category: Category, locale: string) => {
  const labels: Record<Category, { en: string; zh: string }> = {
    ALL: { en: "All", zh: "全部" },
    COMPANY: { en: "Company", zh: "公司动态" },
    TECHNOLOGY: { en: "Technology", zh: "技术前沿" },
    PRODUCT: { en: "Product", zh: "产品发布" },
    INDUSTRY: { en: "Industry", zh: "行业观察" },
  };
  return labels[category][locale === "zh" ? "zh" : "en"];
};

// Transform API data to component format
const transformNewsItem = (item: NewsItem, locale: string) => {
  // Map API category slug to our category system
  const categorySlug = item.category?.slug?.toUpperCase() || "COMPANY";
  let category: Category = "COMPANY";

  if (categorySlug.includes("TECH")) category = "TECHNOLOGY";
  else if (categorySlug.includes("PRODUCT")) category = "PRODUCT";
  else if (categorySlug.includes("INDUSTRY")) category = "INDUSTRY";
  else if (categorySlug.includes("COMPANY")) category = "COMPANY";

  return {
    id: parseInt(item.id, 36),
    slug: item.slug,
    date: item.publishedAt
      ? new Date(item.publishedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    category,
    title: item.title,
    image: item.coverImage || "/images/news/placeholder.jpg",
    excerpt: item.excerpt || "",
  };
};

export default function NewsPage() {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);

  const currentMessages = messages[locale];

  // Fetch news from API
  const fetchNews = useCallback(async (category?: string, page?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        locale: locale === "zh" ? "zh-CN" : "en",
        page: (page || currentPage).toString(),
        limit: "100", // Get all for client-side filtering
      });

      if (category && category !== "ALL") {
        params.set("category", category.toLowerCase());
      }

      const response = await fetch(`/api/news?${params.toString()}`);
      const data: NewsResponse = await response.json();

      if (data.success) {
        setAllNews(data.items || []);
        setTotal(data.meta?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  }, [locale, currentPage]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Transform news for components
  const transformedNews = allNews.map((item) => transformNewsItem(item, locale));

  // Filter news by category
  const filteredNews = activeCategory === "ALL"
    ? transformedNews
    : transformedNews.filter((item) => item.category === activeCategory);

  // Get featured item (most recent)
  const featuredItem = filteredNews[0];

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle category change - reset pagination
  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
      />

      <main className="min-h-screen bg-[#F7F8FA] pt-[72px]">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
          </div>
        ) : (
          <>
            {/* 01. Page Hero */}
            <NewsHero locale={locale} totalCount={total} />

            {/* 02. Featured Story */}
            {featuredItem && <FeaturedNews item={featuredItem} locale={locale} />}

            {/* 03. Category Filter */}
            <NewsFilter
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              locale={locale}
            />

            {/* 04. Latest News */}
            <NewsList items={paginatedNews} locale={locale} />

            {/* 05. Pagination */}
            {totalPages > 1 && (
              <NewsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* 06. Light CTA */}
            <NewsCTA locale={locale} />
          </>
        )}
      </main>

      <Footer translations={currentMessages} locale={locale} />
    </>
  );
}
