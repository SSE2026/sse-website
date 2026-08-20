"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NewsHero } from "@/components/news/NewsHero"
import { FeaturedNews } from "@/components/news/FeaturedNews"
import { NewsFilter } from "@/components/news/NewsFilter"
import { NewsList } from "@/components/news/NewsList"
import { NewsPagination } from "@/components/news/NewsPagination"
import { NewsCTA } from "@/components/news/NewsCTA"
import { newsItems, categories, getNewsByCategory } from "@/data/news"
import type { Category } from "@/data/news"
import en from "@/messages/en.json"
import zh from "@/messages/zh.json"

const messages = { en, zh }
const ITEMS_PER_PAGE = 5

export default function NewsPage() {
  const [locale, setLocale] = useState<"en" | "zh">("en")
  const [activeCategory, setActiveCategory] = useState<Category>("ALL")
  const [currentPage, setCurrentPage] = useState(1)

  const currentMessages = messages[locale]

  // Filter news by category
  const filteredNews = useMemo(() => {
    return getNewsByCategory(activeCategory)
  }, [activeCategory])

  // Get featured item (most recent)
  const featuredItem = newsItems[0]

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE)
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredNews.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredNews, currentPage])

  // Handle category change - reset pagination
  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
        <FeaturedNews item={featuredItem} locale={locale} />

        {/* 03. Category Filter */}
        <NewsFilter
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          locale={locale}
        />

        {/* 04. Latest News */}
        <NewsList items={paginatedNews} locale={locale} />

        {/* 05. Pagination */}
        <NewsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* 06. Light CTA */}
        <NewsCTA locale={locale} />
      </main>

      <Footer translations={currentMessages} locale={locale} />
    </>
  )
}
