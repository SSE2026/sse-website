"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { newsItems } from "@/data/news";

interface HomeNewsProps {
  locale: string;
  translations: any;
}

const CJK = "var(--font-noto-sc, sans-serif)";
const GROTESK = "var(--font-space-grotesk, sans-serif)";

/** 首页只放最新 3 条 */
const COUNT = 3;

/**
 * 首页第三屏 —— 新闻动态缩略版。
 *
 * 沿用 /news 的编辑式排法(缩略图 + 元信息 + 标题 + 摘要 + 细线分隔),
 * 而不是做成方框卡片,这样和新闻中心是同一套语言。
 * 右上角给"查看全部"进新闻中心,每条点进各自的详情页。
 */
export function HomeNews({ locale, translations }: HomeNewsProps) {
  const isZh = locale === "zh";
  const news = translations?.news ?? {};
  const items = newsItems.slice(0, COUNT);

  return (
    <section className="bg-[#F7F8FA] px-6 pt-8 pb-20 md:px-10 md:pt-10 md:pb-28 lg:px-16 lg:pt-12 lg:pb-32">
      <div className="mx-auto max-w-[1280px]">
        {/* 标题 + 查看全部 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4"
        >
          <div>
            <div
              className="mb-4 text-[11px] uppercase tracking-[0.32em] text-[#71717A]"
              style={{ fontFamily: GROTESK }}
            >
              NEWS
            </div>
            <h2
              className="text-[26px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0A0A0F] md:text-[34px] lg:text-[38px]"
              style={{ fontFamily: CJK }}
            >
              {news.title ?? (isZh ? "最新动态" : "Latest news")}
            </h2>
          </div>

          <Link
            href="/news"
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0A0A0F] no-underline border-b border-[#0A0A0F]/25 pb-1 transition-colors hover:border-[#0A0A0F]"
            style={{ fontFamily: CJK }}
          >
            {news.viewAll ?? (isZh ? "查看全部" : "View all")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* 新闻列表 */}
        <div className="mt-12 border-t border-[#E4E4E7] md:mt-16">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                href={`/news/${it.slug}`}
                className="group grid grid-cols-[128px_minmax(0,1fr)] items-start gap-x-3 border-b border-[#E4E4E7] py-5 no-underline max-[359px]:grid-cols-[112px_minmax(0,1fr)] md:grid-cols-12 md:items-center md:gap-x-8 md:py-8"
              >
                {/* 缩略图 —— 统一 1080:546。
                    新闻图里有几张是"方形画布 + 上下纯蓝填充"的模板图,
                    已离线按内容带裁成同比例(模板图零内容损失),
                    所以这里直接 object-cover 严丝合缝填满,既不留白也不裁掉内容 */}
                <div className="relative aspect-[1080/546] w-full self-center overflow-hidden md:col-span-3">
                  <Image
                    src={`/images/news/thumb/${it.slug}.jpg`}
                    alt={isZh ? it.title : it.titleEn ?? it.title}
                    fill
                    sizes="(max-width: 768px) 128px, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                  />
                </div>

                {/* 文字 */}
                <div className="min-w-0 md:col-span-9">
                  <div
                    className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9.5px] uppercase tracking-[0.16em] text-[#A1A1AA] md:mb-2.5 md:gap-x-3 md:text-[11px] md:tracking-[0.18em]"
                    style={{ fontFamily: GROTESK }}
                  >
                    <span>{it.date}</span>
                    <span className="h-3 w-px bg-[#D4D4D8]" />
                    <span>{it.category}</span>
                  </div>

                  <h3
                    className="line-clamp-3 text-[14px] font-semibold leading-snug text-[#0A0A0F] transition-colors duration-200 group-hover:text-[#2563EB] md:line-clamp-none md:text-[18px]"
                    style={{ fontFamily: CJK }}
                  >
                    {isZh ? it.title : it.titleEn ?? it.title}
                  </h3>

                  {(isZh ? it.excerpt : it.excerptEn ?? it.excerpt) && (
                    <p
                      className="mt-2 line-clamp-2 max-w-[76ch] text-[11.5px] leading-[1.75] text-[#71717A] md:mt-2.5 md:line-clamp-none md:text-[13px] md:leading-[1.8]"
                      style={{ fontFamily: CJK }}
                    >
                      {isZh ? it.excerpt : it.excerptEn ?? it.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
