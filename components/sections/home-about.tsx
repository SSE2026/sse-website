"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CHINESE_INTRO, ENGLISH_INTRO } from "@/lib/company-intro";

interface HomeAboutProps {
  locale: string;
}

const CJK = "var(--font-noto-sc, sans-serif)";
const GROTESK = "var(--font-space-grotesk, sans-serif)";

/**
 * 首页第三屏 —— 关于我们。
 *
 * 桌面端沿用 /about 第二屏的语言:厂区大图铺满、底部渐隐到白色、
 * 完整介绍文案落在渐隐出来的亮面上。
 *
 * 手机端改为「图在上、文字在下」——完整文案有 170 多字,压在图上会
 * 溢出一屏;放成正常流既不用裁图,也不会盖住画面。
 */
export function HomeAbout({ locale }: HomeAboutProps) {
  const isZh = locale === "zh";

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative aspect-[1584/672] w-full md:min-h-[560px]">
        <Image
          src="/images/about/intro-factory.jpg"
          alt={isZh ? "深安锂能厂区俯瞰" : "Swift Safe Energy manufacturing campus"}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* 底部渐隐 —— 只给桌面端的压图文案留干净亮面 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 38%, rgba(255,255,255,0.92) 70%, #FFFFFF 100%)",
          }}
        />
        {/* 顶部软化,避免和上一屏之间出现硬边 */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-16"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>

      {/* 桌面:压在图上;手机:正常流排在图片下方 */}
      <div className="relative md:absolute md:inset-x-0 md:bottom-0">
        <div className="mx-auto w-full max-w-[1280px] px-6 pb-8 md:px-10 md:pb-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px w-10 bg-[#2563EB]" />
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2563EB]"
                style={{ fontFamily: GROTESK }}
              >
                {isZh ? "关于我们" : "About Us"}
              </span>
            </div>

            <h2
              className="text-[22px] font-bold leading-tight tracking-[-0.01em] text-[#0A0A0F] md:text-[30px]"
              style={{ fontFamily: CJK }}
            >
              {isZh ? "深安锂能" : "Swift Safe Energy"}
            </h2>

            <p
              className="mt-3 max-w-[78ch] text-[12px] leading-[1.85] text-[#52525B] md:text-[14px]"
              style={{ fontFamily: CJK }}
            >
              {isZh ? CHINESE_INTRO : ENGLISH_INTRO}
            </p>

            <Link
              href="/about"
              className="group mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0A0A0F] no-underline border-b border-[#0A0A0F]/25 pb-0.5 transition-colors hover:border-[#0A0A0F] md:mt-5 md:text-[13px]"
              style={{ fontFamily: CJK }}
            >
              {isZh ? "了解深安锂能" : "More about SSE"}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
