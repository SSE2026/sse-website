'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    titleZh: "开启固态电池前沿研究",
    titleEn: "Advancing Solid-State Battery Research",
    descZh: "创始人加入国际顶尖电池研究机构，联合全球领先固态电池企业开展核心技术攻关",
    descEn: "The founder joined a world-leading battery research institute and collaborated with leading solid-state battery companies to advance core technologies.",
  },
  {
    year: '2016',
    titleZh: "全气候电池成果发表于《Nature》",
    titleEn: "All-Climate Battery Research Published in Nature",
    descZh: "突破电池低温应用瓶颈，为后续冬奥会新能源汽车的全气候应用奠定理论基础",
    descEn: "A breakthrough in low-temperature battery performance laid the scientific groundwork for all-climate electric vehicle applications at the Beijing Winter Olympics.",
  },
  {
    year: '2017',
    titleZh: "开创锂电池寿命预测新方法",
    titleEn: "Pioneering Lithium-Ion Battery Life Prediction",
    descZh: "发布全球首个锂电池全生命周期寿命预测模型，推动行业广泛应用，相关论文累计被引1,200余次",
    descEn: "Developed the world’s first physics-based model that can predict the full lifespan of lithium-ion batteries. The research paper has been cited more than 1,200 times.",
  },
  {
    year: '2018',
    titleZh: "突破−50°C极寒快充瓶颈",
    titleEn: "A Breakthrough in Fast Charging at −50°C",
    descZh: "攻克极寒环境下的快充难题，相关研究实现15分钟快充及4,500次循环，成果发表于《PNAS》",
    descEn: "Advanced fast-charging technology for extreme cold, with research demonstrating 15-minute charging and 4,500 cycles. The findings were published in PNAS.",
  },
  {
    year: '2019',
    titleZh: "首创速热6C超快充技术",
    titleEn: "Pioneering Thermally-modulated 6C Ultrafast Charging",
    descZh: "以速热技术实现10分钟超快充，创新电池热管理范式，研究成果发表于《Joule》",
    descEn: "Developed an asymmetric thermal modulation approach that enabled 10-minute charging. The research was published in Joule.",
  },
  {
    year: '2020',
    titleZh: "率先明确eVTOL电池性能需求",
    titleEn: "Defining Battery Requirements for eVTOL Aircraft",
    descZh: "发表全球首篇聚焦eVTOL电池需求的研究论文，明确“三高一快”的核心性能要求",
    descEn: "Published the world’s first paper dedicated to eVTOL battery requirements, setting out the core performance criteria for electric flight.",
  },
  {
    year: '2021',
    titleZh: "归国创业，推动技术产业化",
    titleEn: "Returning to China to Bring Research to Market",
    descZh: "创始人全职归国，组建产业化团队，推进超快充、高能量密度与固态电池核心技术的研发与成果转化",
    descEn: "The founder returned to China to focus on commercialization, assembling a team to develop technologies for ultrafast charging, high energy density, and solid-state batteries.",
  },
  {
    year: '2023',
    titleZh: "高性能固态电解质实现吨级试制",
    titleEn: "Tonne-Scale Pilot Production of High-Performance Solid Electrolytes",
    descZh: "攻克氧化物与聚合物固态电解质材料的规模化制备难题，实现吨级试制",
    descEn: "Overcame key manufacturing challenges in oxide and polymer solid electrolytes, achieving pilot production at the tonne scale.",
  },
  {
    year: '2024',
    titleZh: "深安锂能成立，启动产线建设",
    titleEn: "Swift Safe Energy Founded",
    descZh: "启动MWh级固态电池试制线与百吨级固态电解质产线建设，加快科研成果产业化",
    descEn: "Began construction of an MWh-scale solid-state battery pilot line and a 100-tonne-scale solid electrolyte production line, accelerating the transition from research to production.",
  },
  {
    year: '2025',
    titleZh: "高比能电芯通过头部客户验证",
    titleEn: "High-Specific-Energy Cells Validated by Leading Customers",
    descZh: "产品通过中汽研等权威第三方机构检测认证，完成行业头部客户送样验证，推进商业化应用",
    descEn: "Products passed third-party testing and certification, including assessments by CATARC. Successful sample validation with leading industry customers marked a further step toward commercialization.",
  },
  {
    year: '2026',
    titleZh: "完成数亿元融资，迈向规模制造",
    titleEn: "New Funding Secured to Scale Manufacturing",
    descZh: "完成数亿元融资，取得高比能固态电池批量订单，启动0.5 GWh高标准产线建设",
    descEn: "Raised hundreds of millions of yuan in funding, secured volume orders for solid-state batteries with high specific energy, and began construction of a 0.5 GWh production line.",
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
 * 阶段划分:2021 是分水岭。
 *   · 2014—2020  科研研发 / RESEARCH & DEVELOPMENT      科技蓝 #2563EB
 *   · 2021—2026  产业化落地 / INDUSTRIALIZATION & DEPLOYMENT  青绿 #0D9488
 *
 * 分区、阶段标题、时间轴节点共用同一个 grid(每格 = 一个年份),
 * 所以浅色分区、分隔线、节点和年份永远对齐,不会出现错位。
 */
export default function MilestonesSection({ lang = 'zh', items }: MilestonesProps) {
  const data = items && items.length > 0 ? items : milestones;
  // Default to 2023 (index 7) — the first production-scale milestone.
  const [activeIndex, setActiveIndex] = useState(7);

  // 每 5 秒自动切到下一条(原有行为)。
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [data.length]);

  /** 点击年份 / 箭头 */
  const select = (idx: number) => setActiveIndex(idx);

  // 手机端时间轴是横向滚动的:保证当前选中的年份始终在可视区域内,
  // 否则详情显示 2023、屏幕上却只看到 2014—2019。
  const railRef = useRef<HTMLDivElement>(null);
  const yearRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const rail = railRef.current;
    const btn = yearRefs.current[activeIndex];
    if (!rail || !btn) return;
    // 手机端时间轴可横向滑动:把当前选中的年份滚到可视区中部,
    // 否则详情写着 2023、屏幕上却只看到 2014—2019。
    // 用 scrollIntoView 而不是手算偏移,Windows/移动端对嵌套滚动的处理更一致。
    const id = requestAnimationFrame(() => {
      if (btn.offsetWidth === 0) return; // 首帧未完成布局
      if (rail.scrollWidth <= rail.clientWidth + 2) return; // 放得下,无需滚动
      btn.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: 'smooth',
      });
    });
    return () => cancelAnimationFrame(id);
  }, [activeIndex]);

  const isEn = lang === 'en';
  const current = data[activeIndex];

  // ---- 阶段模型 -----------------------------------------------------------
  const phaseOf = (year: string): 'research' | 'industrial' =>
    parseInt(year, 10) < 2021 ? 'research' : 'industrial';

  const researchCount = data.filter((d) => phaseOf(d.year) === 'research').length;
  const industrialCount = data.length - researchCount;
  /** 两阶段交界处的横向位置(%)——第 researchCount 格与第 researchCount+1 格之间 */
  const boundaryPct = (researchCount / data.length) * 100;
  /** 第 i 格的中心位置(%) */
  const colCenter = (i: number) => ((i + 0.5) / data.length) * 100;

  const PHASE = {
    research: {
      color: '#2563EB',
      rail: 'rgba(37,99,235,0.28)',
      zoneBg: '#F2F6FD',
      tagBg: '#E8F0FD',
      headingZh: '第一阶段 · 科研研发',
      headingEn: 'RESEARCH & DEVELOPMENT',
      tagZh: '科研研发',
      tagEn: 'R&D',
    },
    industrial: {
      color: '#0D9488',
      rail: 'rgba(13,148,136,0.30)',
      zoneBg: '#EFFAF8',
      tagBg: '#E2F6F2',
      headingZh: '第二阶段 · 产业化落地',
      headingEn: 'INDUSTRIALIZATION & DEPLOYMENT',
      tagZh: '产业化落地',
      tagEn: 'Industrialization',
    },
  } as const;

  const currentPhase = phaseOf(current.year);
  const cp = PHASE[currentPhase];

  // 两段轨道各自从本阶段第一个节点连到最后一个节点
  const researchRail = {
    left: colCenter(0),
    width: researchCount > 1 ? ((researchCount - 1) / data.length) * 100 : 0,
  };
  const industrialRail = {
    left: colCenter(researchCount),
    width: industrialCount > 1 ? ((industrialCount - 1) / data.length) * 100 : 0,
  };

  return (
    <section className="w-full select-none bg-[#F7F8FB] px-6 py-16 text-[#0A0A0F] md:px-12 md:py-24 font-sans">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 border-b border-[#E4E4E7] pb-5">
          <div>
            <p className="mb-2 text-[10px] tracking-[0.3em] text-[#2563EB] uppercase">
              JOURNEY &amp; MILESTONES
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-tight tracking-tight">
              {isEn ? 'Our Journey: From Research to Commercialization' : '创新与发展历程：从科研突破到产业应用'}
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

        {/* ── 时间轴 ─────────────────────────────────────────────────────────
            外层 overflow-x-auto 负责手机端横向滑动,页面本身不会横向溢出。 */}
        <div ref={railRef} className="mt-8 overflow-x-auto pb-2">
          <div className="relative min-w-[760px]">
            {/* 两个阶段的浅色分区 —— 用同一套比例定位,和下面的节点严格对齐 */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 rounded-l-xl"
              style={{ width: `${boundaryPct}%`, backgroundColor: PHASE.research.zoneBg }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 rounded-r-xl"
              style={{ left: `${boundaryPct}%`, backgroundColor: PHASE.industrial.zoneBg }}
            />
            {/* 阶段交界细线 */}
            <div
              className="pointer-events-none absolute inset-y-4 w-px"
              style={{ left: `${boundaryPct}%`, backgroundColor: 'rgba(13,148,136,0.22)' }}
            />

            {/* 阶段标题 —— 与年份网格同列,保证与下方节点对齐 */}
            <div
              className="relative grid"
              style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
            >
              <div
                className="px-4 pb-5 pt-5"
                style={{ gridColumn: `1 / span ${researchCount}` }}
              >
                <div
                  className="text-[9.5px] uppercase tracking-[0.24em]"
                  style={{ color: PHASE.research.color }}
                >
                  {PHASE.research.headingEn}
                </div>
                <div className="mt-1.5 text-[13px] font-medium leading-tight text-[#0A0A0F] md:text-sm">
                  {PHASE.research.headingZh}
                </div>
              </div>
              <div
                className="px-4 pb-5 pt-5"
                style={{ gridColumn: `${researchCount + 1} / span ${industrialCount}` }}
              >
                <div
                  className="text-[9.5px] uppercase tracking-[0.24em]"
                  style={{ color: PHASE.industrial.color }}
                >
                  {PHASE.industrial.headingEn}
                </div>
                <div className="mt-1.5 text-[13px] font-medium leading-tight text-[#0A0A0F] md:text-sm">
                  {PHASE.industrial.headingZh}
                </div>
              </div>
            </div>

            {/* 轨道 + 节点 + 年份 */}
            <div className="relative pb-5">
              {/* 两段轨道,各自使用阶段主题色 */}
              <div
                className="absolute h-px -translate-y-1/2"
                style={{
                  top: '6px',
                  left: `${researchRail.left}%`,
                  width: `${researchRail.width}%`,
                  backgroundColor: PHASE.research.rail,
                }}
              />
              <div
                className="absolute h-px -translate-y-1/2"
                style={{
                  top: '6px',
                  left: `${industrialRail.left}%`,
                  width: `${industrialRail.width}%`,
                  backgroundColor: PHASE.industrial.rail,
                }}
              />

              <div
                className="relative grid"
                style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
              >
                {data.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  const meta = PHASE[phaseOf(item.year)];
                  return (
                    <button
                      key={item.year}
                      type="button"
                      ref={(el) => { yearRefs.current[idx] = el; }}
                      onClick={() => select(idx)}
                      aria-current={isActive}
                      aria-label={item.year}
                      className="group flex cursor-pointer flex-col items-center gap-3"
                    >
                      {/* 固定 12px 高的节点槽位:选中时放大也不会让年份文字跳动 */}
                      <span className="flex h-3 items-center justify-center">
                        <span
                          className="block rounded-full transition-all duration-200"
                          style={
                            isActive
                              ? {
                                  width: 12,
                                  height: 12,
                                  backgroundColor: meta.color,
                                  boxShadow: `0 0 0 3px #FFFFFF, 0 0 0 4px ${meta.color}`,
                                }
                              : {
                                  width: 6,
                                  height: 6,
                                  backgroundColor: '#C9CCD3',
                                }
                          }
                        />
                      </span>
                      <span
                        className="text-xs tabular-nums transition-colors duration-200"
                        style={{
                          color: isActive ? '#0A0A0F' : '#A1A1AA',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {item.year}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected milestone */}
        <div className="mt-10 md:mt-14" aria-live="polite">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-light leading-none tabular-nums tracking-tight">
              {current.year}
            </span>
            {/* 轻量阶段标签 —— 随年份自动切换 */}
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none transition-colors duration-300"
              style={{ backgroundColor: cp.tagBg, color: cp.color }}
            >
              <span
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: cp.color }}
              />
              {isEn ? cp.tagEn : cp.tagZh}
            </span>
            <h3 className="w-full text-lg font-medium leading-tight tracking-tight md:w-auto md:text-2xl">
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
            onClick={() => select(activeIndex === 0 ? data.length - 1 : activeIndex - 1)}
            aria-label="Previous milestone"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[#0A0A0F]/15 bg-white text-[#0A0A0F] transition-colors hover:bg-[#F4F4F5]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => select((activeIndex + 1) % data.length)}
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
