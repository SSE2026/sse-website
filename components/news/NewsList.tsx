"use client"

import { motion } from "framer-motion"
import type { NewsItem } from "@/data/news"
import { NewsItemCard } from "./NewsItemCard"

interface NewsListProps {
  items: NewsItem[]
  locale: string
}

export function NewsList({ items, locale }: NewsListProps) {
  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {items.map((item, index) => (
            <NewsItemCard
              key={item.id}
              item={item}
              locale={locale}
              index={index}
            />
          ))}
        </motion.div>

        {items.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[#8A8F98] text-[14px]">
              {locale === "zh" ? "暂无相关新闻" : "No news found"}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
