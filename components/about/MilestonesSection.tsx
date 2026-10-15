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

/**
 * Development history — a year rail over the milestone it selects, in the
 * same silver-white language as the rest of the site.
 *
 * Kept deliberately plain: hairlines, tabular years, ink copy, one accent.
 * The previous version ran a silver laser line, glow blobs, a 12rem
 * watermark year, gradient-filled type, drop shadows and a ping pulse on
 * the active tick, which read as decoration competing with the content.
 */
export default function MilestonesSection({ lang = 'zh', items }: MilestonesProps) {
  const data = items && items.length > 0 ? items : milestones;
  // Default to 2023 (index 7) — the first production-scale milestone.
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
    <section className="w-full select-none bg-[#F7F8FB] px-6 py-16 text-[#0A0A0F] md:px-12 md:py-24 font-sans">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 border-b border-[#E4E4E7] pb-5">
          <div>
            <p className="mb-2 text-[10px] tracking-[0.3em] text-[#2563EB] uppercase">
              CHRONOLOGY &amp; MILESTONES
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-tight tracking-tight">
              {isEn ? 'Evolution & Milestones' : '发展历程'}
            </h2>
          </div>

          <span className="shrink-0 pb-1 text-sm tabular-nums">
            <span className="font-medium text-[#0A0A0F]">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-[#71717A]">
              {' / '}
              {String(data.length).padStart(2, '0')}
            </span>
          </span>
        </div>

        {/* Year rail — one hairline, one tick per milestone. Scrolls
            sideways rather than crushing twelve years into a phone. */}
        <div className="mt-10 overflow-x-auto pb-1">
          <div className="relative min-w-[680px] pt-2">
            <div className="absolute inset-x-0 top-[7px] h-px bg-[#E4E4E7]" />
            <div
              className="absolute left-0 top-[7px] h-px bg-[#0A0A0F] transition-all duration-500"
              style={{ width: `${((activeIndex + 1) / data.length) * 100}%` }}
            />

            <div
              className="relative grid gap-1"
              style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
            >
              {data.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.year}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-current={isActive}
                    aria-label={item.year}
                    className="group flex cursor-pointer flex-col items-center gap-3"
                  >
                    <span
                      className={
                        'h-1.5 w-1.5 rounded-full transition-colors duration-200 ' +
                        (isActive
                          ? 'bg-[#0A0A0F]'
                          : 'bg-[#D4D4D8] group-hover:bg-[#A1A1AA]')
                      }
                    />
                    <span
                      className={
                        'text-xs tabular-nums transition-colors duration-200 ' +
                        (isActive
                          ? 'font-semibold text-[#0A0A0F]'
                          : 'text-[#A1A1AA] group-hover:text-[#52525B]')
                      }
                    >
                      {item.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected milestone. */}
        <div className="mt-12 md:mt-16" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-light leading-none tabular-nums tracking-tight">
              {current.year}
            </span>
            <h3 className="text-lg font-medium leading-tight tracking-tight md:text-2xl">
              {isEn ? current.titleEn : current.titleZh}
            </h3>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#52525B] md:text-base">
            {isEn ? current.descEn : current.descZh}
          </p>
        </div>

        {/* Stepper. */}
        <div className="mt-10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1))}
            aria-label="Previous milestone"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[#0A0A0F]/15 bg-white text-[#0A0A0F] transition-colors hover:bg-[#F4F4F5]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % data.length)}
            aria-label="Next milestone"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[#0A0A0F]/15 bg-white text-[#0A0A0F] transition-colors hover:bg-[#F4F4F5]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
