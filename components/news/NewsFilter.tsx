"use client"

import { motion } from "framer-motion"
import type { Category } from "@/data/news"
import { categories, getCategoryLabel } from "@/data/news"

interface NewsFilterProps {
  activeCategory: Category
  onCategoryChange: (category: Category) => void
  locale: string
}

export function NewsFilter({ activeCategory, onCategoryChange, locale }: NewsFilterProps) {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="py-5">
          <nav className="flex flex-wrap gap-6 lg:gap-8">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.02 }}
                onClick={() => onCategoryChange(cat)}
                className="relative text-[14px] font-medium transition-colors duration-200 pb-1 cursor-pointer"
              >
                <span className={activeCategory === cat ? "text-[#111111]" : "text-[#8A8F98] hover:text-[#555555]"}>
                  {getCategoryLabel(cat, locale)}
                </span>
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#155EEF]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
