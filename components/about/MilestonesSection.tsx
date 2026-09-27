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
    titleZh: '布局固态电池前沿',
    titleEn: 'Frontier of Solid-State Batteries',
    descZh: '创始人加入国际顶尖电池研究机构，携手全球领先固态电池企业，攻关核心技术',
    descEn: 'Founder joined a leading international battery research institute and worked alongside a global solid-state battery leader on core technology.',
  },
  {
    year: '2016',
    titleZh: '全气候电池成果登上《Nature》',
    titleEn: 'All-Climate Battery Published in Nature',
    descZh: '突破电池低温应用瓶颈，为后续冬奥会全气候新能源汽车应用奠定理论基础',
    descEn: 'Broke through the low-temperature operating limit, laying the theoretical foundation for the all-climate new-energy vehicles later deployed at the Winter Olympics.',
  },
  {
    year: '2017',
    titleZh: '开创电池寿命预测新范式',
    titleEn: 'A New Paradigm for Battery Life Prediction',
    descZh: '发布全球首个锂电池全生命周期寿命预测模型，累计引用逾1,200次，获行业广泛应用',
    descEn: 'Released the world’s first full-lifecycle lithium battery life-prediction model; cited over 1,200 times and widely adopted across the industry.',
  },
  {
    year: '2018',
    titleZh: '突破−50℃极寒快充',
    titleEn: 'Fast Charging at −50 °C',
    descZh: '实现极寒环境下15分钟快充、4,500次循环，研究成果发表于《PNAS》',
    descEn: 'Achieved 15-minute fast charging and 4,500 cycles in extreme cold; results published in PNAS.',
  },
  {
    year: '2019',
    titleZh: '首创速热6C超充',
    titleEn: 'First Rapid-Heating 6C Ultra-Fast Charging',
    descZh: '以速热技术实现10分钟超充，突破传统电池温度管理范式，成果发表于《Joule》',
    descEn: 'Used rapid-heating technology to deliver 10-minute ultra-fast charging, breaking with conventional thermal management; published in Joule.',
  },
  {
    year: '2020',
    titleZh: '率先定义eVTOL电池需求',
    titleEn: 'First to Define eVTOL Battery Requirements',
    descZh: '发表全球首篇eVTOL电池需求论文，明确“三高一快”性能要求',
    descEn: 'Published the first paper on eVTOL battery requirements, defining the three-highs-and-one-fast performance criteria.',
  },
  {
    year: '2021',
    titleZh: '归国创业，推进技术产业化',
    titleEn: 'Returned to China to Commercialize the Technology',
    descZh: '创始人全职回国，组建产业化团队，聚焦超快充、高能量密度与固态电池核心技术',
    descEn: 'Founder returned full-time and built a commercialization team focused on ultra-fast charging, high energy density, and solid-state core technology.',
  },
  {
    year: '2023',
    titleZh: '突破固态电解质量产工艺',
    titleEn: 'Breakthrough in Solid Electrolyte Mass Production',
    descZh: '攻克氧化物与聚合物固态电解质材料量产工艺瓶颈，实现吨级试制',
    descEn: 'Overcame mass-production bottlenecks in oxide and polymer solid electrolyte materials, achieving ton-scale pilot production.',
  },
  {
    year: '2024',
    titleZh: '深安锂能成立，开启产业化准备',
    titleEn: 'Swift Safe Energy Founded, Preparing for Industrialization',
    descZh: '启动MWh级固态电池试制线与百吨级固态电解质量产线建设，加速科研成果产业化。',
    descEn: 'Began building an MWh-scale solid-state battery pilot line and a 100-ton solid electrolyte production line to accelerate the path from research to industry.',
  },
  {
    year: '2025',
    titleZh: '高比能电芯通过头部客户验证',
    titleEn: 'High-Energy Cells Validated by Leading Customers',
    descZh: '产品通过中汽研等第三方检测认证，完成行业头部客户送样验证，迈入商业化新阶段。',
    descEn: 'Products passed third-party testing and certification including CATARC and completed sample validation with leading customers — entering the commercialization stage.',
  },
  {
    year: '2026',
    titleZh: '数亿元融资落地，迈向规模制造',
    titleEn: 'Multi-Hundred-Million Funding, Moving to Scale Manufacturing',
    descZh: '获得数亿元融资，高比能固态电池取得批量订单，启动0.5GWh高标准产线建设。',
    descEn: 'Raised several hundred million RMB; high-energy-density solid-state batteries won volume orders and construction began on a 0.5 GWh high-standard production line.',
  },
];

interface MilestonesProps {
  lang?: 'zh' | 'en';
  /** CMS-provided milestones; falls back to built-in defaults when absent. */
  items?: Milestone[];
}

export default function MilestonesSection({ lang = 'zh', items }: MilestonesProps) {
  const data = items && items.length > 0 ? items : milestones;
  // 默认高亮 2023 年（新数组无 2022，2023 落在 index 7）
  const [activeIndex, setActiveIndex] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [data.length]);

  const isEn = lang === 'en';
  const current = data[activeIndex];

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
            <span>{String(data.length).padStart(2, '0')}</span>
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
                onClick={() => setActiveIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1))}
                className="w-11 h-11 rounded-full border border-zinc-700 bg-zinc-900/90 hover:bg-white hover:text-black transition-all duration-200 flex items-center justify-center text-zinc-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % data.length)}
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
            style={{ width: `${((activeIndex + 1) / data.length) * 100}%` }}
          />

          <div className="relative z-10 grid grid-cols-10 gap-1 md:gap-2">
            {data.map((item, idx) => {
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
