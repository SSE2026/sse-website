"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface NewsCTAProps {
  locale: string
}

export function NewsCTA({ locale }: NewsCTAProps) {
  const isZh = locale === "zh"

  return (
    <section className="bg-[#F1F3F5]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="py-16 lg:py-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[24px] lg:text-[28px] font-medium text-[#111111] mb-2"
            >
              {isZh ? "探索下一世代能源技术" : "Engineering the next generation of energy."}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[14px] text-[#555555]"
            >
              {isZh
                ? "了解我们的核心技术如何推动边界场景的电动化进程。"
                : "Discover how our core technologies are powering electrification at the boundary."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/technology"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#111111] group"
            >
              <span className="border-b border-[#111111] pb-0.5">
                {isZh ? "探索我们的技术" : "Explore Our Technology"}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
