"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface IndustryDetailHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Optional background image; falls back to silver gradient. */
  bgSrc?: string;
  /**
   * Override the section's aspect ratio. Default = image's intrinsic
   * 1672/940 (~16:9). When set to a value smaller than the image's
   * aspect, the image is rendered larger (cover scales to fit the
   * shorter dimension) and the over-sized dimension is cropped,
   * making the subject appear more prominent. Use only when the
   * subject sits off-centre and you want cover to zoom in.
   */
  aspectRatio?: string;
  /**
   * Where the left-side white fade reaches full transparency, as a
   * percentage of hero width. Higher = wider fade = more of the
   * image is washed toward white. Narrow this when the image's own
   * subject extends far to the left (so the fade doesn't wash the
   * subject itself). Default 70.
   */
  fadeWidth?: number;
  /**
   * Visual scale of the image, in (0, 1]. 1 = image fills the hero
   * box exactly (default); 0.8 = the image renders at 80% of its
   * box size, anchored to the right edge, leaving the extra space
   * empty. Uses object-fit: contain + transform: scale, so the
   * whole image is always visible — never cropped.
   */
  imageScale?: number;
  /**
   * Override the hero's height. Accepts any CSS length, e.g.
   * "min(70vh, 660px)". When set, it replaces the aspectRatio +
   * default minHeight pairing — use it to make the whole hero (and
   * therefore the image inside it) shorter on a specific page
   * without introducing empty bands.
   */
  heroHeight?: string;
}

export function IndustryDetailHero({
  eyebrow,
  title,
  subtitle,
  bgSrc,
  aspectRatio = "1672 / 940",
  fadeWidth = 70,
  imageScale = 1,
  heroHeight,
}: IndustryDetailHeroProps) {
  return (
    <section
      className="ind-hero relative w-full overflow-hidden text-[#0A0A0F]"
      style={{
        // heroHeight wins when provided (short hero, smaller image,
        // no empty bands). Otherwise fall back to image-aspect +
        // viewport floor so the hero fills the first screen.
        aspectRatio: heroHeight ? undefined : aspectRatio,
        minHeight: heroHeight ?? "calc(100vh - 72px)",
      }}
    >
      {/* 手机:和首页第二屏同一套做法 —— 画框取图片自身比例(1672/940),
          cover 即零裁剪、整张图可见;文字缩小后仍压在图上。
          原来 hero 是 100vh 高,16:9 横图在竖屏只能露出约 1/4 的宽度。 */}
      <style jsx>{`
        @media (max-width: 767px) {
          .ind-hero {
            aspect-ratio: 1672 / 940 !important;
            min-height: 0 !important;
          }
          .ind-hero__copy {
            position: absolute !important;
            inset: 0 !important;
            min-height: 0 !important;
            justify-content: center !important;
            padding-top: 84px !important;
            padding-bottom: 12px !important;
          }
        }
      `}</style>

      {/* IMAGE LAYER — independent, fills the hero edge-to-edge.
          Uses object-fit: cover so the image reaches all three visible
          edges; object-position: right so the crop happens on the LEFT
          (which is empty sky / floor in every industry shot) and the
          machine stays fully on the right side of the frame. */}
      {bgSrc ? (
        <div
          aria-hidden="true"
          className="ind-hero__layer absolute inset-0 pointer-events-none overflow-hidden"
        >
          <Image
            src={bgSrc}
            alt=""
            fill
            sizes="100vw"
            priority={false}
            style={{
              // cover — the image always fills the hero edge-to-edge.
              // When the container's aspect matches the image's (the
              // default aspectRatio path) cover crops nothing. When it
              // differs (a shorter heroHeight), cover crops the empty
              // studio background at the top/bottom — never the
              // subject, which sits in the centre.
              objectFit: "cover",
              // Anchor the subject against the right edge; any crop
              // opens up on the LEFT (where the title sits).
              objectPosition: "right center",
              // Optional visual shrink: transform scales the rendered
              // image down without cropping. transform-origin pins
              // the image's top-right corner to the hero's top-right
              // so the freed space opens up at the bottom-left — the
              // image still starts right under the header (no empty
              // band under the nav).
              transform: imageScale !== 1 ? `scale(${imageScale})` : undefined,
              transformOrigin: "right top",
            }}
          />
        </div>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, #F7F8FB 0%, #F2F4F7 22%, #FAFBFC 50%, #F4F5F8 78%, #F8F9FB 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute pointer-events-none hidden lg:block"
            style={{
              right: "-10%",
              top: "0%",
              width: "70%",
              height: "90%",
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 28%, transparent 65%)",
              filter: "blur(30px)",
            }}
          />
        </>
      )}

      {/* SOFT FADE OVERLAY — the image's left edge is naturally a hard
          vertical line because cover crops there. We soften it with
          a smooth white gradient that fades from solid white on the
          left (where the title sits, pure clean) through to fully
          transparent at ~55% of the width, so the image and the
          title bleed into each other like a single composition. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0.92) ${fadeWidth * 0.26}%, rgba(255,255,255,0.55) ${fadeWidth * 0.54}%, rgba(255,255,255,0.10) ${fadeWidth * 0.79}%, rgba(255,255,255,0) ${fadeWidth}%)`,
        }}
      />

      {/* TEXT LAYER — left-aligned, in the clean white area created by
          the fade. Independent z-index so text never displaces the
          image; sits in front of both the image and the white wash.
          Its min-height must track the section's, otherwise the text
          column alone would stretch the section back to full height. */}
      <div
        className="ind-hero__copy relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16 flex flex-col justify-center py-12 md:py-16 lg:py-20"
        style={{ minHeight: heroHeight ?? "calc(100vh - 72px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div
            className="mb-1 md:mb-4 text-[7.5px] md:text-[11px] tracking-[0.32em] uppercase text-[#71717A]"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            {eyebrow}
          </div>
          <h1
            className="text-[15px] md:text-[32px] lg:text-[40px] font-bold leading-[1.12] tracking-[-0.015em] text-[#0A0A0F]"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {title}
          </h1>
          <p
            className="mt-1.5 md:mt-5 text-[8.5px] md:text-[13px] lg:text-[14px] text-[#3F3F46] leading-[1.7] max-w-[52ch]"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}