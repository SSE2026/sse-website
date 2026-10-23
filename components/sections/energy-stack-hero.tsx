"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

// ============================================
// Types
// ============================================
type HeroProps = {
  translations?: unknown;
  locale?: string;
};

type HeroI18n = {
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  ctaExplore?: string;
  ctaContact?: string;
};

// ============================================
// Hero — single-image studio backdrop + text overlay.
// The left text column is offset down via a wrapper div so its
// top edge lines up with the Logo cube in the background image
// (the cube starts ~27% from the top of the 16:9 image).
// ============================================
export function EnergyStackHero({ translations }: HeroProps) {
  const t = useTranslations("hero");
  const tr = ((translations as { hero?: HeroI18n } | undefined)?.hero ??
    {}) as HeroI18n;

  const titleLine1 = tr.titleLine1 ?? t("titleLine1");
  const titleLine2 = tr.titleLine2 ?? t("titleLine2");
  const subtitle = tr.subtitle ?? t("subtitle");
  const ctaExplore = tr.ctaExplore ?? t("ctaExplore");
  const ctaContact = tr.ctaContact ?? t("ctaContact");

  return (
    <section
      className="relative w-full overflow-hidden text-[#0A0A0F] brand-hero-img"
      style={{
        // The hero image is 16:9. We constrain the section to either
        // the full first viewport (minus the 72px header) OR the
        // 16:9 aspect ratio of the image — whichever is taller. On a
        // 16:9 viewport they line up exactly, and the image fills
        // the first screen without being cropped.
        minHeight: "calc(100vh - 72px)",
        aspectRatio: "16 / 9",
        // Fallback gradient — used until the image loads.
        background:
          "linear-gradient(180deg, #F7F8FB 0%, #F2F4F7 22%, #FAFBFC 50%, #F4F5F8 78%, #F8F9FB 100%)",
      }}
    >
      {/* === STUDIO BACKGROUND IMAGE ==============================
          A single user-supplied render (Logo + luminous rings +
          mirror floor + studio backdrop). No carousel — one image
          covers the whole first viewport. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none brand-hero-img__layer"
        style={{
          backgroundImage: "url('/images/hero/hero-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* 手机:和首页第二屏同一套做法 —— 直接用原图,画框取图片自身比例
          (1672/941),cover 即零裁剪、整张图可见;文字缩小后压回图上。
          不再需要单独的竖版裁图。 */}
      <style jsx>{`
        @media (max-width: 767px) {
          .brand-hero-img {
            min-height: 0 !important;
            aspect-ratio: 1672 / 941 !important;
          }
          /* 画框只有约 206px 高,文案改成绝对定位铺满画框;
             顶部留出固定页头的 72px,否则标题会被压在页头下面。
             左右要显式补回内边距 —— inset:0 是从外层的 padding box 算起,
             会把外层 px-6 吃掉,标题会贴在屏幕最左边。 */
          .brand-hero-grid {
            position: absolute !important;
            inset: 0 !important;
            min-height: 0 !important;
            padding: 76px 24px 8px !important;
          }
          /* 原来的 translateY(80px) 是为桌面构图调的下沉,手机上会把文案推走 */
          .brand-hero-copy {
            transform: none !important;
          }
        }
      `}</style>

      {/* === LEFT READABILITY WASH ================================
          Soft left-to-right fade so the title never fights the
          Logo's highlights for contrast. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 28%, rgba(255,255,255,0) 55%)",
        }}
      />

      {/* === MAIN CONTENT ============================================ */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16">
        <div className="brand-hero-grid grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center min-h-[calc(100vh-72px-104px)] py-14 md:py-20">
          {/* Hero 排版 —— 之前 H1 只有 40px、副标题 14px，字号比 2.86:1，
           左侧文字撑不住 1430px 的画框：字宽只有 245px，到右侧
           Logo 有 656px 空白，整屏看着空。H1 提到 64px 后字宽 394px、
           间距收到 507px，比例 4:1（设计库标尺要求 ≥5:1，72px 可到
           4.5:1）。480px 的列到 72px 都装得下，所以不用动列宽结构。
           手机端原来 H1 15px / 正文 9px / 按钮 9px，都低于 12px 正文
           下限，一并提到 22 / 11 / 11。 */}
          {/* LEFT — wrapper handles the static downward shift so the
              block lines up with the Logo cube. motion.div inside
              handles the entrance animation only. */}
          <div
            className="brand-hero-copy lg:col-span-6 lg:max-w-[480px]"
            style={{ transform: "translateY(80px)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col"
            >
              <h1
                className="text-[22px] font-bold leading-[1.12] tracking-[-0.015em] text-[#0A0A0F] md:text-[40px] lg:text-[64px]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                <span className="block">{titleLine1}</span>
                <span className="block mt-0.5 md:mt-2">{titleLine2}</span>
              </h1>

              <p
                className="mt-1.5 md:mt-7 text-[11px] md:text-[14px] lg:text-[16px] text-[#3F3F46] leading-[1.7] whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                {subtitle}
              </p>

              <div className="mt-3 md:mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 md:gap-x-5 md:gap-y-3">
                <a
                  href="/technology"
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 md:px-5 md:py-2.5 bg-[#0A0A0F] text-white text-[11px] md:text-[12px] font-semibold rounded-full hover:bg-[#1F1F2A] transition-colors shadow-[0_10px_30px_-14px_rgba(10,10,15,0.6)]"
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {ctaExplore}
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="/about"
                  className="group inline-flex items-center gap-1.5 text-[11px] md:text-[12px] font-medium text-[#0A0A0F] border-b border-[#0A0A0F]/40 hover:border-[#0A0A0F] pb-0.5 transition-colors"
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {ctaContact}
                  <ArrowUpRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — empty in JSX; the Logo + orbits come from the
              background image itself. Column reserved for layout
              rhythm on wider viewports. */}
          <div
            aria-hidden="true"
            className="hidden lg:block lg:col-span-6"
          />
        </div>
      </div>
    </section>
  );
}