'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Milestone {
  year: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
}

const milestones: Milestone[] = [
  {
    year: '2014',
    titleZh: '技术研究启动',
    titleEn: 'R&D Initiation',
    descZh: '依托院士团队科研力量，围绕下一代高比能固态电解质与高硅负极体系开启底层技术攻关。',
    descEn: 'Initiated core R&D on next-gen solid-state electrolytes and high-silicon anodes backed by academician team.',
  },
  {
    year: '2016',
    titleZh: 'Nature 正刊发表',
    titleEn: 'Nature Publication',
    descZh: '关键电池材料突破性研究成果发表于国际顶级学术期刊《Nature》，奠定技术学术地位。',
    descEn: 'Breakthrough battery material research published in Nature journal, establishing academic leadership.',
  },
  {
    year: '2018',
    titleZh: '极寒快充技术突破',
    titleEn: 'Extreme Cold Fast Charge',
    descZh: '攻克 -40℃ 极寒低温环境下的高倍率快充与循环寿命衰减难题。',
    descEn: 'Solved high-rate fast charging and cycle life degradation challenges in -40℃ extreme cold environments.',
  },
  {
    year: '2019',
    titleZh: '全球首发速热 6C 超充',
    titleEn: 'Global Debut 6C Fast Charge',
    descZh: '推出业界领先的速热 6C 超快充电池技术，实现分钟级补能与高安全性兼备。',
    descEn: 'Pioneered industry-leading rapid-heating 6C ultra-fast charging technology with minute-level replenishment.',
  },
  {
    year: '2021',
    titleZh: '产业化团队组建',
    titleEn: 'Entity Incorporation',
    descZh: '院士团队与资深新能源产业化工程专家共同组建实体公司，开启规模化商业落地。',
    descEn: 'Formed an industrial entity with top battery engineering experts to drive commercial deployment.',
  },
  {
    year: '2022',
    titleZh: '试制平台建成',
    titleEn: 'Pilot Line Operational',
    descZh: '搭建高标准中试生产线，启动先进电芯与模组在无人机及特种装备上的实测验证。',
    descEn: 'Built high-spec pilot lines to evaluate cells and modules on drones and specialized equipment.',
  },
  {
    year: '2023',
    titleZh: '百吨级量产工艺开发',
    titleEn: '100-Ton Mass Production',
    descZh: '攻克关键材料百吨级稳定制备与规模化涂布工艺，打通实验室到工厂的关键卡点。',
    descEn: 'Achieved 100-ton scale material synthesis and coating, bridging lab scale to factory manufacturing.',
  },
  {
    year: '2024',
    titleZh: '深圳总部设立',
    titleEn: 'Shenzhen HQ Launch',
    descZh: '深安锂能（深圳）总部正式成立，聚焦低空经济、具身智能与高端装备电源市场。',
    descEn: 'Established Shenzhen HQ targeting low-altitude economy, embodied AI, and advanced equipment markets.',
  },
  {
    year: '2025',
    titleZh: '融资规模超 1 亿元',
    titleEn: '¥100M+ Series Funding',
    descZh: '完成过亿元战略融资，资本与产业资源加码，加速产能建设与产品交付进程。',
    descEn: 'Secured over 100M RMB in funding to accelerate gigafactory construction and mass deliveries.',
  },
  {
    year: '2026',
    titleZh: '0.5GWh 生产基地建设',
    titleEn: '0.5GWh Base Construction',
    descZh: '启动 0.5GWh 先进电池规模化生产基地建设，全面开启低空与工业级电源的大批量交付。',
    descEn: 'Began constructing 0.5GWh production base for high-volume delivery of drone and industrial batteries.',
  },
];

interface MilestonesProps {
  lang?: 'zh' | 'en';
}

export default function MilestonesSection({ lang = 'zh' }: MilestonesProps) {
  const [activeIndex, setActiveIndex] = useState(6); // 默认高亮 2023 年

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % milestones.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const isEn = lang === 'en';
  const current = milestones[activeIndex];

  return (
    <section className="w-full py-10 md:py-16 px-6 md:px-12 border-t border-zinc-800/80 bg-[#07080a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,212,216,0.12),rgba(255,255,255,0))] text-slate-100 font-sans antialiased overflow-hidden select-none">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===== 1. 板块 Header ===== */}
        <div className="flex items-end justify-between border-b border-zinc-800/80 pb-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              {"// CHRONOLOGY & MILESTONES"}
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
              {isEn ? 'Evolution & Milestones' : '发展历程'}
            </h2>
          </div>

          <div className="text-sm font-mono text-zinc-400">
            <span className="text-white font-bold text-base drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-zinc-600"> / </span>
            <span>{String(milestones.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* ===== 2. 主体舞台（清空小图标，放大年份，施加金属银光泽） ===== */}
        <div className="relative min-h-[240px] md:min-h-[270px] rounded-2xl bg-gradient-to-b from-[#12141c]/90 via-[#0d0e14]/90 to-[#08090d]/90 border border-zinc-700/60 p-6 md:px-10 md:py-8 overflow-hidden flex items-center group shadow-2xl backdrop-blur-md">

          {/* 顶部金属银激光线条 */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_12px_rgba(248,250,252,0.8)]" />

          {/* 背景冷银/银白柔光斑 */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-slate-300/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-zinc-400/10 blur-[100px] rounded-full pointer-events-none" />

          {/* 倒计时金属银进度线 */}
          <div
            key={activeIndex}
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-zinc-400 via-white to-slate-300 shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-[progress_5s_linear_infinite]"
            style={{ width: '100%' }}
          />

          {/* 右下角巨型银色水印年份 */}
          <div className="absolute right-2 bottom-[-18%] text-[8.5rem] md:text-[12rem] font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white/[0.14] via-zinc-400/[0.05] to-transparent pointer-events-none tracking-tighter leading-none select-none drop-shadow-[0_0_20px_rgba(255,255,255,0.03)] transition-all duration-700">
            {current.year}
          </div>

          {/* 前景内容展现区 */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">

            <div className="lg:col-span-10 space-y-4">

              {/* 大号超高对比金属银年份与标题 */}
              <div className="flex flex-wrap items-baseline gap-5 md:gap-8">
                {/* 年份字体大幅度放大，带有金属银渐变与强光影效果 */}
                <span className="text-5xl md:text-7xl font-mono font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-zinc-400 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                  {current.year}
                </span>
                <h3 className="text-2xl md:text-4xl font-light text-slate-100 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {isEn ? current.titleEn : current.titleZh}
                </h3>
              </div>

              {/* 描述内容 */}
              <p className="text-base md:text-lg text-zinc-300 font-light leading-relaxed max-w-3xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                {isEn ? current.descEn : current.descZh}
              </p>
            </div>

            {/* 左右翻页控制 */}
            <div className="lg:col-span-2 flex justify-end gap-3 self-center">
              <button
                onClick={() => setActiveIndex((prev) => (prev === 0 ? milestones.length - 1 : prev - 1))}
                className="w-11 h-11 rounded-full border border-zinc-700 bg-zinc-900/90 hover:bg-white hover:text-black transition-all duration-200 flex items-center justify-center text-zinc-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % milestones.length)}
                className="w-11 h-11 rounded-full border border-zinc-700 bg-zinc-900/90 hover:bg-white hover:text-black transition-all duration-200 flex items-center justify-center text-zinc-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* ===== 3. 金属银光效刻度导轨 ===== */}
        <div className="relative pt-4">
          {/* 背景导轨线 */}
          <div className="absolute top-[25px] left-0 right-0 h-[1px] bg-zinc-800" />

          {/* 动态前进的金属银发光线条 */}
          <div
            className="absolute top-[25px] left-0 h-[1.5px] bg-gradient-to-r from-zinc-500 via-white to-slate-200 shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-all duration-500"
            style={{ width: `${((activeIndex + 1) / milestones.length) * 100}%` }}
          />

          <div className="relative z-10 grid grid-cols-10 gap-1 md:gap-2">
            {milestones.map((item, idx) => {
              const isActive = idx === activeIndex;
              const isPassed = idx < activeIndex;

              return (
                <button
                  key={item.year}
                  onClick={() => setActiveIndex(idx)}
                  className="group flex flex-col items-center gap-2.5 focus:outline-none cursor-pointer"
                >
                  <div className="relative flex items-center justify-center w-4 h-4">
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                    )}

                    <div
                      className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                        isActive
                          ? 'bg-white border-white scale-125 shadow-[0_0_15px_rgba(255,255,255,1)]'
                          : isPassed
                          ? 'bg-zinc-400 border-zinc-300'
                          : 'bg-[#090a0e] border-zinc-700 group-hover:border-zinc-400'
                      }`}
                    />
                  </div>

                  {/* 刻度年份 */}
                  <span
                    className={`text-xs md:text-sm font-mono transition-all duration-200 ${
                      isActive
                        ? 'text-white font-bold scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]'
                        : isPassed
                        ? 'text-zinc-300'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  >
                    {item.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
