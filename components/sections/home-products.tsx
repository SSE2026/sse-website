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
      {/* 图片按原比例完整显示(手机 365×206);
          文字缩小后放回桌面版的两个角,不再另起一段。 */}
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

        {/* ===== 右上:主副标题(手机端字号缩小,位置与桌面一致) ===== */}
        <div className="absolute inset-0 flex items-start justify-end pt-[5%] md:pt-[7%] lg:pt-[6%]">
          <div className="mx-auto w-full max-w-[1280px] px-4 md:px-10 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="ml-auto max-w-[64%] text-right md:max-w-[320px] lg:max-w-[580px]"
            >
              <div
                className="mb-1.5 text-[8.5px] uppercase tracking-[0.32em] text-[#71717A] md:mb-4 md:text-[11px]"
                style={{ fontFamily: GROTESK }}
              >
                PRODUCTS
              </div>
              <h2
                className="text-[17px] font-bold leading-[1.2] tracking-[-0.015em] text-[#0A0A0F] sm:text-[26px] lg:text-[38px]"
                style={{ fontFamily: CJK }}
              >
                {isZh
                  ? "从一颗电芯到完整动力方案"
                  : "From a single cell to a complete power system"}
              </h2>
              <p
                className="mt-1.5 ml-auto max-w-[44ch] text-[10.5px] leading-[1.6] text-[#3F3F46] sm:text-[13px] lg:mt-4 lg:text-[14px]"
                style={{ fontFamily: CJK }}
              >
                {isZh
                  ? "高比能电芯 × 高性能动力模组,构建面向无人机、机器人及高端装备的下一代动力系统。"
                  : "High-energy cells × high-performance power modules — the next-generation power system for drones, robots and advanced equipment."}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ===== 底部居中:探索更多产品 + 三个入口 =====
            三个入口各自带一个浅色胶囊底 —— 否则字直接压在图上,看起来像图片
            自带的文字,不像可点的入口。标签"探索更多产品"是说明,不加底。 */}
        <div className="absolute inset-x-0 bottom-0 pb-[2.4%] md:pb-[2%] lg:pb-[1.5%]">
          <div className="mx-auto w-full max-w-[1280px] px-4 md:px-10 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className="mx-auto flex w-fit flex-wrap items-center justify-center gap-x-2 gap-y-1.5 py-1 md:gap-x-4 md:gap-y-3 md:py-2"
            >
              <span
                className="text-shimmer-silver text-[9px] font-medium md:text-[14px]"
                style={{ fontFamily: CJK }}
              >
                {isZh ? "探索更多产品" : "Explore more products"}
              </span>

              {PRODUCT_LINKS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 ring-1 ring-[#0A0A0F]/10 text-[11px] font-semibold no-underline shadow-[0_1px_2px_rgba(10,10,15,0.06)] backdrop-blur-[2px] transition-all duration-200 hover:bg-white hover:ring-[#0A0A0F]/25 hover:shadow-[0_2px_8px_rgba(10,10,15,0.10)] md:gap-1.5 md:px-4 md:py-2 md:text-[16px]"
                  style={{ fontFamily: CJK }}
                >
                  <span className="text-shimmer-silver">{isZh ? p.zh : p.en}</span>
                  <ArrowUpRight className="h-3 w-3 text-[#3F3F46] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0A0A0F] md:h-4 md:w-4" />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
