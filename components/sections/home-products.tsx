"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface HomeProductsProps {
  locale: string;
  translations: any;
}

const CJK = "var(--font-noto-sc, sans-serif)";
const GROTESK = "var(--font-space-grotesk, sans-serif)";

/** 产品入口 —— 云驰系列进 360-P 页(三个子系列从那里再分流) */
const PRODUCT_LINKS = [
  { zh: "云驰系列", en: "AeroRide Series", href: "/products/cloudchi-360-p" },
  { zh: "磐石系列", en: "FortiCore Series", href: "/products/cells/panshi" },
  { zh: "电池组", en: "Battery Packs", href: "/products/packs" },
];

/**
 * 首页第二屏 —— 产品展示。
 *
 * 整屏就是一幅产品展示图,文字全部压在图上,不设蒙版(实测三处落点都够亮):
 *   · 右上角 —— 该图色彩最单调的空白区,放主副标题,右对齐;
 *   · 底部居中 —— y 87%–100% 这一整条横带横向全亮(183–231),
 *     贴着下沿放"探索更多产品" + 三个产品入口。
 *
 * 光效用 .text-shimmer-silver(styles/globals.css):文字底色仍是近黑,
 * 只有一道窄银光掠过 —— 不是整段染色。注意它是 background-clip: text,
 * 所以这几处文字的 hover 不靠变色,改为靠下边框与箭头做反馈。
 */
export function HomeProducts({ locale }: HomeProductsProps) {
  const isZh = locale === "zh";

  return (
    <section className="bg-white">
      {/* 手机上:图片按原比例完整占一块,文字排在它下面,不再压在图上。
          md 起恢复原来的"整幅图 + 文字浮层"构图。 */}
      <div
        className="relative w-full overflow-hidden md:aspect-[1672/941] md:min-h-[300px]"
      >
        <div className="relative w-full aspect-[1672/941] md:absolute md:inset-0 md:aspect-auto">
          <Image
            src="/images/hero/products-showcase.png"
            alt={isZh ? "深安锂能电池产品展示" : "SSE battery product showcase"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* ===== 右上:主副标题(手机端在图片下方) ===== */}
        <div className="relative md:absolute md:inset-0 md:flex md:items-start md:justify-end md:pt-[7%] lg:pt-[6%]">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-8 md:px-10 md:py-0 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-none text-left md:ml-auto md:max-w-[320px] md:text-right lg:max-w-[580px]"
            >
              <div
                className="mb-3 text-[11px] uppercase tracking-[0.32em] text-[#71717A] md:mb-4"
                style={{ fontFamily: GROTESK }}
              >
                PRODUCTS
              </div>
              <h2
                className="text-[21px] font-bold leading-[1.2] tracking-[-0.015em] text-[#0A0A0F] sm:text-[26px] lg:text-[38px]"
                style={{ fontFamily: CJK }}
              >
                {isZh
                  ? "从一颗电芯到完整动力方案"
                  : "From a single cell to a complete power system"}
              </h2>
              <p
                className="mt-3 md:ml-auto max-w-[44ch] text-[12px] leading-[1.75] text-[#3F3F46] sm:text-[13px] lg:mt-4 lg:text-[14px]"
                style={{ fontFamily: CJK }}
              >
                {isZh
                  ? "高比能电芯 × 高性能动力模组,构建面向无人机、机器人及高端装备的下一代动力系统。"
                  : "High-energy cells × high-performance power modules — the next-generation power system for drones, robots and advanced equipment."}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ===== 底部:探索更多产品 + 三个入口(手机端在文字下方,桌面贴着下沿) ===== */}
        <div className="relative pb-10 md:absolute md:inset-x-0 md:bottom-0 md:pb-[4%] lg:pb-[2.5%]">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className="mx-auto flex w-fit flex-wrap items-center justify-center gap-x-7 gap-y-3 py-2 md:gap-x-9"
            >
              <span
                className="text-shimmer-silver text-[13px] font-medium md:text-[14px]"
                style={{ fontFamily: CJK }}
              >
                {isZh ? "探索更多产品" : "Explore more products"}
              </span>

              {PRODUCT_LINKS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group inline-flex items-center gap-1.5 border-b border-[#0A0A0F]/25 pb-0.5 text-[16px] font-semibold no-underline transition-colors hover:border-[#0A0A0F] md:text-[18px]"
                  style={{ fontFamily: CJK }}
                >
                  <span className="text-shimmer-silver">{isZh ? p.zh : p.en}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#3F3F46] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0A0A0F]" />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
