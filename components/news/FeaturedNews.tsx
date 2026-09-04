"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { NewsItem } from "@/data/news"
import { getCategoryLabel, getNewsTitle, getNewsExcerpt } from "@/data/news"

interface FeaturedNewsProps {
  item: NewsItem
  locale: string
}

export function FeaturedNews({ item, locale }: FeaturedNewsProps) {
  const isZh = locale === "zh"
  const formattedDate = item.date.replace(/-/g, ".")
  const title = getNewsTitle(item, locale)
  const excerpt = getNewsExcerpt(item, locale)

  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            {/* Left - Content (Primary) - 55% */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-[680px]"
            >
              {/* Date - Small, understated */}
              <p className="text-[12px] text-[#8A8F98] mb-3 tracking-wide">
                {formattedDate}
              </p>

              {/* Category - Very subtle, uppercase */}
              <p className="text-[10px] font-medium tracking-[0.16em] uppercase text-[#6B7280] mb-5">
                {getCategoryLabel(item.category, locale)}
              </p>

              {/* Title - Primary focus */}
              <h2
                className="text-[26px] lg:text-[32px] font-medium leading-[1.35] text-[#111111] mb-4"
                style={{
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                }}
              >
                {title}
              </h2>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-[15px] leading-[1.7] text-[#4B5563] mb-8">
                  {excerpt}
                </p>
              )}

              {/* Read More Link - Minimal */}
              <Link
                href={`/news/${item.slug}`}
                className="inline-flex items-center gap-3 text-[13px] font-medium text-[#111111] group"
              >
                <span className="border-b border-[#D1D5DB] pb-0.5 hover:border-[#111111] transition-colors">
                  {isZh ? "阅读全文" : "Read Article"}
                </span>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#111111]" />
              </Link>
            </motion.div>

            {/* Right - Image (Supplementary) - 45% */}
            {/* Image container: fixed size, centered content, NO crop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:w-[420px] flex-shrink-0"
            >
              <Link
                href={`/news/${item.slug}`}
                className="block group"
              >
                {/* Container: fixed dimensions, centered flex, bg for letterbox */}
                <div
                  className="relative flex items-center justify-center overflow-hidden"
                  style={{
                    width: "420px",
                    height: "280px",
                    backgroundColor: "#F4F5F7",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
                    priority
                    sizes="420px"
                  />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
