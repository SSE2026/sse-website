"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CoreTechSlide {
  title: string;
  summary: string;
  image: string;
  /** Confirmed advantages. Left empty until real material exists — no
   *  performance figures are invented here. */
  points?: string[];
}

interface CoreTechCarouselProps {
  label?: string;
  title?: string;
  slides: CoreTechSlide[];
  /** Milliseconds each slide holds before advancing. */
  interval?: number;
}

/**
 * Technology showcase — the picture fills the frame with the copy laid
 * over it: section header top-left, the technology bottom-left, and the
 * prev/next controls bottom-right.
 *
 * Cover fit, so the frame is always full edge to edge. The pictures are
 * authored 16:9 and a browser content box rarely is — 2.38 on a short,
 * wide window — so about a quarter comes off the top and bottom there.
 * That only costs something if the render carries detail to its edges or
 * puts its subject off-centre; a source with a generous margin survives
 * the crop intact.
 *
 * The copy sits straight on the picture in plain white — no scrim, no
 * panel, no shadow. These renders measure 241–254 luma across the whole
 * band the text lands on, with under 1% of pixels below 90, so the dark
 * copy reads without any help from the artwork.
 */
export function CoreTechCarousel({
  label,
  title,
  slides,
  interval = 6000,
}: CoreTechCarouselProps) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const reducedMotion = useReducedMotion();
  const count = slides.length;

  const go = useCallback(
    (delta: number) => setIndex((current) => (current + delta + count) % count),
    [count],
  );

  // `index` is a dependency so the interval restarts on every change:
  // each slide gets a full interval, and stepping manually does not leave
  // a nearly-expired timer waiting to yank the slide away.
  useEffect(() => {
    if (reducedMotion || held || !inView || count < 2) return;
    const id = window.setInterval(() => go(1), interval);
    return () => window.clearInterval(id);
  }, [reducedMotion, held, inView, count, interval, go, index]);

  useEffect(() => {
    if (!inView || count < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, count, go]);

  if (count === 0) return null;

  const active = slides[index];
  const points = active.points ?? [];

  // 序号和标题分开:标题写在第二列里,换行后的第二行自然跟首字对齐,
  // 不会退回序号那条线;副标题也放在同一列,所以同样从首字起。
  const [number, ...rest] = active.title.split("｜");
  const hasNumber = rest.length > 0;
  const heading = hasNumber ? rest.join("｜") : active.title;

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={title || label || "Core technologies"}
      className="relative mx-auto h-auto w-full max-w-[1378px] md:aspect-[16/9] md:h-auto select-none overflow-hidden bg-[#F5F6F8] text-[#0A0A0F]"
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      {/* Full-bleed picture, cross-faded on opacity alone.
          这六张原图都是 1672×941(16:9),和手机端的 16:9 画框同比例,
          object-cover 在任何宽度下都刚好铺满、不裁内容; md 起占满整屏。 */}
      <div className="relative w-full aspect-[16/9] md:absolute md:inset-0 md:aspect-auto">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDuration: reducedMotion ? "0ms" : "900ms" }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="(min-width: 1378px) 1378px, 100vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* 新的六张配图是浅色设计,左侧本身就留了空白区用于放文案。
          所以这里不再加任何蒙版 —— 加暗色底会把留白和画面一起压暗,
          黑字也就没法读了。文案宽度由下面的 max-w 控制在留白区内。 */}

      {/* Copy, laid over the picture at every width. The section title and
          the technology it introduces are one block at the top-left:
          splitting them to opposite corners left 433px of dead space.
          手机端也压在图上(画框只有 390×219,上下排会把整屏拉得过长),
          所以字号整体收小,文案列宽限制在图片左侧留白区(约 34%)内 ——
          这批图在文案所处高度上,32% 以内基本是留白(平均亮度 220–254),
          超过这条线 03 号图会开始压到碳颗粒,所以宁可窄也不外扩。 */}
      <div className="absolute inset-0 z-10 flex flex-col px-5 pt-4 pb-4 md:px-16 md:pt-24 md:pb-10">
        <div className="max-w-[34%] md:max-w-[380px] lg:max-w-[430px]">
          {/* Section header — top-padded to clear the fixed nav. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-1 text-[8px] tracking-[0.3em] text-[#A1A1AA] uppercase md:mb-2 md:text-[10px]">
              {label || "CORE TECHNOLOGY"}
            </p>
            <h2 className="text-[12px] font-medium leading-tight tracking-tight text-[#0A0A0F] md:text-[clamp(1.4rem,2.2vw,2rem)]">
              {title}
            </h2>
          </motion.div>

          <div aria-live="polite" className="mt-2.5 md:mt-12">
            <div
              className={cn(
                "grid items-baseline gap-x-[0.4em]",
                hasNumber ? "grid-cols-[auto_minmax(0,1fr)]" : "grid-cols-1",
              )}
            >
              {hasNumber && (
                <span className="col-start-1 row-start-1 text-[12.5px] font-semibold tabular-nums text-[#0A0A0F] md:text-[clamp(1.5rem,2.6vw,2.25rem)]">
                  {number}
                </span>
              )}
              <h3
                className={cn(
                  "col-start-2 row-start-1 whitespace-pre-line text-[12.5px] font-semibold leading-[1.3] tracking-tight text-[#0A0A0F] md:text-[clamp(1.5rem,2.6vw,2.25rem)] md:leading-tight",
                  !hasNumber && "col-start-1",
                )}
              >
                {heading}
              </h3>
              <p
                className={cn(
                  "col-start-2 row-start-2 mt-1 text-[9.5px] leading-[1.55] text-[#52525B] md:mt-2 md:text-base md:leading-relaxed",
                  !hasNumber && "col-start-1",
                )}
              >
                {active.summary}
              </p>
            </div>

            {points.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                    <span className="text-xs leading-relaxed text-[#52525B] md:text-sm">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Controls — 紧跟在文案下方。
            原来是 mt-auto 贴到区块底部,区块比视口高时按钮会掉到下一屏,
            得往下滚才看得到,而一滚图片上沿又出了视野。 */}
        <div
          className="mt-3 flex items-center justify-start gap-2 md:mt-10"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous technology"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-[#E4E4E7] bg-white/90 text-[#0A0A0F] backdrop-blur-[2px] transition-colors hover:border-[#D4D4D8] hover:bg-white md:h-10 md:w-10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next technology"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-[#E4E4E7] bg-white/90 text-[#0A0A0F] backdrop-blur-[2px] transition-colors hover:border-[#D4D4D8] hover:bg-white md:h-10 md:w-10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
