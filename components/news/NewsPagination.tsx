"use client"

import { motion } from "framer-motion"

interface NewsPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function NewsPagination({ currentPage, totalPages, onPageChange }: NewsPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <section className="bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="py-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 text-[14px] font-medium transition-colors duration-200 cursor-pointer ${
                currentPage === page
                  ? "text-[#111111] border-b-2 border-[#155EEF]"
                  : "text-[#8A8F98] hover:text-[#555555]"
              }`}
            >
              {String(page).padStart(2, "0")}
            </motion.button>
          ))}

          {currentPage < totalPages && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onPageChange(currentPage + 1)}
              className="w-10 h-10 flex items-center justify-center text-[#8A8F98] hover:text-[#555555] transition-colors duration-200 cursor-pointer"
            >
              <span className="text-[18px]">→</span>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  )
}
