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
          backgroundImage: "url('/images/hero/brand-studio-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Mobile: 换成 4:5 竖版图,画框也是 4:5 —— 比例完全一致,cover 零裁剪,
          整张图可见,文字重新压回图上。和桌面是同一套构图,只是换了张竖版素材。 */}
      <style jsx>{`
        @media (max-width: 767px) {
          .brand-hero-img {
            min-height: 0 !important;
            aspect-ratio: 4 / 5 !important;
          }
          .brand-hero-img__layer {
            background-image: url('/images/hero/brand-studio-bg-mobile.webp') !important;
            background-position: center !important;
          }
          /* 内容区原本用 min-h 撑满首屏,画框改成 4:5 后要放开。
             同时补足顶部留白:固定页头 72px,默认 py-14 只有 56px,
             标题会被压在页头下面。 */
          .brand-hero-grid {
            min-height: 0 !important;
            padding-top: 92px !important;
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
                className="text-[26px] md:text-[32px] lg:text-[40px] font-bold leading-[1.12] tracking-[-0.015em] text-[#0A0A0F]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                <span className="block">{titleLine1}</span>
                <span className="block mt-1.5 md:mt-2">{titleLine2}</span>
              </h1>

              <p
                className="mt-5 md:mt-7 text-[12px] md:text-[13px] lg:text-[14px] text-[#3F3F46] leading-[1.7] whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                {subtitle}
              </p>

              <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href="/technology"
                  className="group inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0A0A0F] text-white text-[11px] font-semibold rounded-full hover:bg-[#1F1F2A] transition-colors shadow-[0_10px_30px_-14px_rgba(10,10,15,0.6)]"
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {ctaExplore}
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="/about"
                  className="group inline-flex items-center gap-1.5 text-[11px] font-medium text-[#0A0A0F] border-b border-[#0A0A0F]/40 hover:border-[#0A0A0F] pb-0.5 transition-colors"
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