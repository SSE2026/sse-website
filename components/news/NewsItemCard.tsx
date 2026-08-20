"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { NewsItem } from "@/data/news"
import { getCategoryLabel } from "@/data/news"

interface NewsItemCardProps {
  item: NewsItem
  locale: string
  index: number
}

export function NewsItemCard({ item, locale, index }: NewsItemCardProps) {
  const formattedDate = item.date.replace(/-/g, ".")
  const isZh = locale === "zh"

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border-b border-[#E5E7EB] last:border-b-0"
    >
      <Link
        href={`/news/${item.slug}`}
        className="block group"
      >
        <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 py-6 lg:py-8">
          {/* Left - Image - Fixed container, NO crop, show full image */}
          <div className="sm:w-[200px] lg:w-[280px] flex-shrink-0">
            {/* Container: fixed dimensions, centered flex, bg for letterbox */}
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                width: "100%",
                height: "180px",
                backgroundColor: "#F4F5F7",
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Date and Category */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[12px] text-[#8A8F98]">{formattedDate}</span>
                <span className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#6B7280]">
                  {getCategoryLabel(item.category, locale)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[18px] lg:text-[20px] font-medium leading-[1.35] text-[#111111] group-hover:text-[#155EEF] transition-colors duration-200">
                {item.title}
              </h3>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 flex items-center sm:pt-6">
              <ArrowRight className="w-5 h-5 text-[#8A8F98] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#111111]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
