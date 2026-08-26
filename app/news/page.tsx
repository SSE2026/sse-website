"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsHero } from "@/components/news/NewsHero";
import { FeaturedNews } from "@/components/news/FeaturedNews";
import { NewsFilter } from "@/components/news/NewsFilter";
import { NewsList } from "@/components/news/NewsList";
import { NewsPagination } from "@/components/news/NewsPagination";
import { NewsCTA } from "@/components/news/NewsCTA";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { newsItems, categories, type Category } from "@/data/news";

const messages = { en, zh };
const ITEMS_PER_PAGE = 5;

export default function NewsPage() {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const currentMessages = messages[locale];

  // Filter news by category (client-side, static data)
  const filteredNews = useMemo(() => {
    if (activeCategory === "ALL") return newsItems;
    return newsItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const featuredItem = filteredNews[0];

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

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
        {/* 01. Page Hero */}
        <NewsHero locale={locale} totalCount={newsItems.length} />

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
      </main>

      <Footer translations={currentMessages} locale={locale} />
    </>
  );
}
