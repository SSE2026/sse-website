"use client"

import { motion } from "framer-motion"

interface NewsHeroProps {
  locale: string
  totalCount: number
  title?: string
  subtitle?: string
  badge?: string
}

export function NewsHero({ locale, totalCount, title, subtitle, badge }: NewsHeroProps) {
  const isZh = locale === "zh"

  return (
    <section className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="py-8 lg:py-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          {/* Left Content - 60% */}
          <div className="flex-1 max-w-[720px]">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#6B7280]">
                {badge || (isZh ? "新闻中心" : "NEWS CENTER")}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[28px] lg:text-[36px] font-medium leading-[1.2] text-[#111111] tracking-tight mb-3"
            >
              {title || (isZh ? "新闻动态" : "News & Insights")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[14px] leading-relaxed text-[#6B7280] max-w-[560px]"
            >
              {subtitle || (isZh
                ? "探索深安锂能在先进电池技术、产业化进程及所服务行业的最新发展动态。"
                : "Latest developments in advanced battery technology, products and the industries we serve.")}
            </motion.p>
          </div>

          {/* Right Content - 40% - Compact latest update indicator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-[240px] flex-shrink-0"
          >
            <p className="text-[11px] text-[#8A8F98] tracking-[0.12em] uppercase mb-2">
              {isZh ? "最新更新" : "LATEST UPDATE"}
            </p>
            <p className="text-[32px] font-light text-[#111111] leading-none">
              01
              <span className="text-[14px] text-[#8A8F98] ml-1">
                / {String(totalCount).padStart(2, "0")}
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
