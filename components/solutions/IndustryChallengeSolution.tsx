"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ChallengeSolutionRow } from "@/data/solutionPairing";

interface IndustryChallengeSolutionProps {
  eyebrow: string;
  title: string;
  intro?: string;
  /** 左栏列头(沿用「行业挑战」这条既有文案) */
  challengeColumnLabel: string;
  /** 右栏列头 */
  solutionColumnLabel: string;
  rows: ChallengeSolutionRow[];
}

const CJK = "var(--font-noto-sc, sans-serif)";
const GROTESK = "var(--font-space-grotesk, sans-serif)";

/** 挑战=红,解决能力=绿。绿沿用站内 400-E 系列的 #059669 */
const RED = "#DC2626";
const GREEN = "#059669";
const CONNECTOR = "#2563EB";

/**
 * 连接件:细线 + 箭头,上面一个 6px 小圆点从左跑到右做点缀。
 * 圆点用 transform 位移(不动 left/width,避免触发布局),
 * 并在 prefers-reduced-motion 下停住。
 */
function Connector() {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex h-4 w-14 items-center" aria-hidden>
      <span className="h-px w-full" style={{ backgroundColor: "#D4D4D8" }} />
      <ChevronRight
        className="absolute -right-1.5 h-3.5 w-3.5"
        style={{ color: "#A1A1AA" }}
        strokeWidth={2.5}
      />
      <motion.span
        className="absolute h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: CONNECTOR }}
        animate={reduce ? { opacity: 0.6, x: 24 } : { x: [0, 46], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.35 }}
      />
    </div>
  );
}

/**
 * 行业挑战 + 核心解决能力 —— 两列对照,左红右绿。
 *
 * 上一版试过给两列加淡色底,偏重、发闷,已撤掉 ——
 * 现在保持"浮在同一片浅灰上"的轻量做法,红绿只由 3px 边框承担,
 * 视觉重量交给字号层级(30 / 22 / 18 / 16 / 13)和留白。
 *
 * 无障碍:红绿是最典型的色觉障碍组合,所以颜色只做辅助 ——
 * 两列有文字列头(行业挑战 / 解决能力)、两侧编号成对、箭头指明方向,
 * 不依赖颜色单独表意。
 */
export function IndustryChallengeSolution({
  eyebrow,
  title,
  intro,
  challengeColumnLabel,
  solutionColumnLabel,
  rows,
}: IndustryChallengeSolutionProps) {
  return (
    <section className="bg-[#F7F8FB] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        {/* 标题通栏 */}
        <div className="mb-10 md:mb-14">
          <div
            className="mb-3 text-[11px] uppercase tracking-[0.32em] text-[#71717A]"
            style={{ fontFamily: GROTESK }}
          >
            {eyebrow}
          </div>
          <h2
            className="text-2xl font-bold leading-tight text-[#0A0A0F] md:text-3xl"
            style={{ fontFamily: CJK }}
          >
            {title}
          </h2>
          {intro && (
            <p
              className="mt-4 max-w-[64ch] text-[14px] leading-[1.85] text-[#71717A]"
              style={{ fontFamily: CJK }}
            >
              {intro}
            </p>
          )}
        </div>

        {/* 两列列头 —— 字号必须大于下方正文(正文 16–18px),红绿含义用文字讲清楚 */}
        <div className="mb-5 hidden gap-x-6 md:grid md:grid-cols-12">
          <div
            className="border-l-[3px] pl-4 md:col-span-5"
            style={{ borderColor: RED }}
          >
            <span
              className="text-[20px] font-semibold leading-tight md:text-[22px]"
              style={{ color: RED, fontFamily: CJK }}
            >
              {challengeColumnLabel}
            </span>
          </div>
          <div className="md:col-span-1" />
          <div
            className="border-l-[3px] pl-4 md:col-span-6"
            style={{ borderColor: GREEN }}
          >
            <span
              className="text-[20px] font-semibold leading-tight md:text-[22px]"
              style={{ color: GREEN, fontFamily: CJK }}
            >
              {solutionColumnLabel}
            </span>
          </div>
        </div>

        {/* 逐条对照 */}
        <div className="border-t border-[#E4E4E7]">
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid grid-cols-1 gap-x-6 gap-y-4 border-b border-[#E4E4E7] py-6 md:grid-cols-12 md:items-center md:py-7"
            >
              {/* 挑战 —— 红 */}
              <div
                className="flex items-baseline gap-3 border-l-[3px] pl-4 md:col-span-5"
                style={{ borderLeftColor: RED }}
              >
                <span
                  className="shrink-0 text-[15px] font-bold leading-none"
                  style={{ color: RED, fontFamily: GROTESK }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  {/* 手机上列头整行是隐藏的,这里给每一条补一个行内标签,
                      否则只剩红/绿两块上下堆叠,看不出哪边是挑战、哪边是能力 */}
                  <span
                    className="mb-1.5 block text-[11px] font-semibold tracking-[0.16em] md:hidden"
                    style={{ color: RED, fontFamily: CJK }}
                  >
                    {challengeColumnLabel}
                  </span>
                  <h3
                    className="text-[16px] font-semibold leading-snug text-[#0A0A0F]"
                    style={{ fontFamily: CJK }}
                  >
                    {row.challenge.keyword}
                  </h3>
                  <p
                    className="mt-1.5 text-[13px] leading-[1.75] text-[#71717A]"
                    style={{ fontFamily: CJK }}
                  >
                    {row.challenge.desc}
                  </p>
                </div>
              </div>

              {/* 连接:箭头 + 流动的小圆点 */}
              <div className="hidden md:col-span-1 md:flex md:justify-center">
                <Connector />
              </div>

              {/* 解决能力 —— 绿 */}
              <div
                className="flex items-baseline gap-3 border-l-[3px] pl-4 md:col-span-6"
                style={{ borderLeftColor: GREEN }}
              >
                <span
                  className="shrink-0 text-[15px] font-bold leading-none"
                  style={{ color: GREEN, fontFamily: GROTESK }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  {/* 手机上补一个行内列头 —— 见上方挑战一侧的说明 */}
                  <span
                    className="mb-2.5 block text-[11px] font-semibold tracking-[0.16em] md:hidden"
                    style={{ color: GREEN, fontFamily: CJK }}
                  >
                    {solutionColumnLabel}
                  </span>
                  <ul className="flex flex-col gap-4">
                  {row.solutions.map((s, j) => (
                    <li key={j}>
                      <h4
                        className="text-[17px] font-semibold leading-snug text-[#0A0A0F] md:text-[18px]"
                        style={{ fontFamily: CJK }}
                      >
                        {s.label}
                      </h4>
                      <p
                        className="mt-1.5 text-[13px] leading-[1.8] text-[#71717A]"
                        style={{ fontFamily: CJK }}
                      >
                        {s.desc}
                      </p>
                    </li>
                  ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
