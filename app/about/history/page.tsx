"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { resolveInitialLocale } from "@/lib/locale";

const messages = { en, zh };

/** 把里程碑按 2021 切成两段:
 *  - 2021 本身: 转折点(特殊卡片)
 *  - < 2021:   科研突破期
 *  - > 2021:   产业化落地期 */
type Phase = "research" | "transition" | "industrialization";
function phaseOf(year: string): Phase {
  const y = parseInt(year, 10);
  if (y === 2021) return "transition";
  return y < 2021 ? "research" : "industrialization";
}

/** 时间轴里插入的阶段标题条 —— 告诉读者"从这一年开始,故事换了主线"。 */
function PhaseBanner({
  phase,
  labelZh,
  labelEn,
  years,
  isZh,
}: {
  phase: 1 | 2;
  labelZh: string;
  labelEn: string;
  years: string;
  isZh: boolean;
}) {
  const isPhase2 = phase === 2;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="relative flex items-center justify-center"
    >
      {/* 轴线在阶段条处保持贯通,不打断 */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-12 w-px bg-neutral-800 z-0" />
      <div className="w-full md:w-2/3 lg:w-1/2 pl-12 md:pl-0 md:px-10 relative z-10">
        <div
          className={
            "relative p-5 rounded-2xl border backdrop-blur-sm " +
            (isPhase2
              ? "border-[#0D9488]/35 bg-gradient-to-r from-[#0D9488]/15 via-[#0D9488]/5 to-transparent"
              : "border-white/10 bg-gradient-to-r from-slate-600/10 via-slate-600/5 to-transparent")
          }
        >
          <div
            className={
              "text-[10px] font-mono tracking-[0.3em] uppercase mb-2 " +
              (isPhase2 ? "text-[#0D9488]" : "text-slate-400")
            }
          >
            PHASE 0{phase}
          </div>
          <div className="text-xl md:text-2xl font-light text-white mb-1">
            {isZh ? labelZh : labelEn}
          </div>
          <div className="text-sm text-slate-400 font-mono">{years}</div>
        </div>
      </div>
    </motion.div>
  );
}

interface Milestone {
  year: string;
  title: string;
  titleEn: string;
  tag: string;
  tagEn: string;
  desc: string;
  descEn: string;
  highlight?: boolean;
}

const milestones: Milestone[] = [
  {
    year: "2014",
    title: "开启固态电池前沿研究",
    titleEn: "Advancing Solid-State Battery Research",
    tag: "技术研究",
    tagEn: "R&D",
    desc: "创始人加入国际顶尖电池研究机构，联合全球领先固态电池企业开展核心技术攻关",
    descEn: "The founder joined a world-leading battery research institute and collaborated with leading solid-state battery companies to advance core technologies.",
  },
  {
    year: "2016",
    title: "全气候电池成果发表于《Nature》",
    titleEn: "All-Climate Battery Research Published in Nature",
    tag: "学术突破",
    tagEn: "Academic",
    desc: "突破电池低温应用瓶颈，为后续冬奥会新能源汽车的全气候应用奠定理论基础",
    descEn: "A breakthrough in low-temperature battery performance laid the scientific groundwork for all-climate electric vehicle applications at the Beijing Winter Olympics.",
    highlight: true,
  },
  {
    year: "2017",
    title: "开创锂电池寿命预测新方法",
    titleEn: "Pioneering Lithium-Ion Battery Life Prediction",
    tag: "方法创新",
    tagEn: "Methodology",
    desc: "发布全球首个锂电池全生命周期寿命预测模型，推动行业广泛应用，相关论文累计被引1,200余次",
    descEn: "Developed the world’s first physics-based model that can predict the full lifespan of lithium-ion batteries. The research paper has been cited more than 1,200 times.",
  },
  {
    year: "2018",
    title: "突破−50°C极寒快充瓶颈",
    titleEn: "A Breakthrough in Fast Charging at −50°C",
    tag: "技术创新",
    tagEn: "Innovation",
    desc: "攻克极寒环境下的快充难题，相关研究实现15分钟快充及4,500次循环，成果发表于《PNAS》",
    descEn: "Advanced fast-charging technology for extreme cold, with research demonstrating 15-minute charging and 4,500 cycles. The findings were published in PNAS.",
    highlight: true,
  },
  {
    year: "2019",
    title: "首创速热6C超快充技术",
    titleEn: "Pioneering Thermally-modulated 6C Ultrafast Charging",
    tag: "全球首创",
    tagEn: "World First",
    desc: "以速热技术实现10分钟超快充，创新电池热管理范式，研究成果发表于《Joule》",
    descEn: "Developed an asymmetric thermal modulation approach that enabled 10-minute charging. The research was published in Joule.",
    highlight: true,
  },
  {
    year: "2020",
    title: "率先明确eVTOL电池性能需求",
    titleEn: "Defining Battery Requirements for eVTOL Aircraft",
    tag: "行业首部",
    tagEn: "Industry First",
    desc: "发表全球首篇聚焦eVTOL电池需求的研究论文，明确“三高一快”的核心性能要求",
    descEn: "Published the world’s first paper dedicated to eVTOL battery requirements, setting out the core performance criteria for electric flight.",
    highlight: true,
  },
  {
    year: "2021",
    title: "归国创业，推动技术产业化",
    titleEn: "Returning to China to Bring Research to Market",
    tag: "团队组建",
    tagEn: "Team",
    desc: "创始人全职归国，组建产业化团队，推进超快充、高能量密度与固态电池核心技术的研发与成果转化",
    descEn: "The founder returned to China to focus on commercialization, assembling a team to develop technologies for ultrafast charging, high energy density, and solid-state batteries.",
  },
  {
    year: "2023",
    title: "高性能固态电解质实现吨级试制",
    titleEn: "Tonne-Scale Pilot Production of High-Performance Solid Electrolytes",
    tag: "规模量产",
    tagEn: "Mass Prod",
    desc: "攻克氧化物与聚合物固态电解质材料的规模化制备难题，实现吨级试制",
    descEn: "Overcame key manufacturing challenges in oxide and polymer solid electrolytes, achieving pilot production at the tonne scale.",
  },
  {
    year: "2024",
    title: "深安锂能成立，启动产线建设",
    titleEn: "Swift Safe Energy Founded",
    tag: "公司成立",
    tagEn: "Founded",
    desc: "启动MWh级固态电池试制线与百吨级固态电解质产线建设，加快科研成果产业化",
    descEn: "Began construction of an MWh-scale solid-state battery pilot line and a 100-tonne-scale solid electrolyte production line, accelerating the transition from research to production.",
  },
  {
    year: "2025",
    title: "高比能电芯通过头部客户验证",
    titleEn: "High-Specific-Energy Cells Validated by Leading Customers",
    tag: "客户验证",
    tagEn: "Validation",
    desc: "产品通过中汽研等权威第三方机构检测认证，完成行业头部客户送样验证，推进商业化应用",
    descEn: "Products passed third-party testing and certification, including assessments by CATARC. Successful sample validation with leading industry customers marked a further step toward commercialization.",
  },
  {
    year: "2026",
    title: "完成数亿元融资，迈向规模制造",
    titleEn: "New Funding Secured to Scale Manufacturing",
    tag: "战略融资",
    tagEn: "Funding",
    desc: "完成数亿元融资，取得高比能固态电池批量订单，启动0.5 GWh高标准产线建设",
    descEn: "Raised hundreds of millions of yuan in funding, secured volume orders for solid-state batteries with high specific energy, and began construction of a 0.5 GWh production line.",
    highlight: true,
  },
];

export default function HistoryPage() {
  const [locale, setLocale] = useState<"en" | "zh">(() => resolveInitialLocale());
  const currentMessages = messages[locale];
  const isZh = locale === "zh";
  const [activeYear, setActiveYear] = useState<string>("2026");

  // 渲染序列:Phase 01 标题条 → 2014/2016/2017/2018/2019/2020 →
  // Phase 02 标题条 → 2021 转折点(特殊满宽卡片)→ 2023/2024/2025/2026
  const slots: any[] = [];
  {
    let phase1Emitted = false;
    milestones.forEach((m: any, i: number) => {
      if (!phase1Emitted) {
        slots.push({ kind: "banner", phase: 1, labelZh: "01 · 科研突破期", labelEn: "01 · Research Era", years: "2014 — 2020" });
        phase1Emitted = true;
      }
      if (m.year === "2021") {
        slots.push({ kind: "banner", phase: 2, labelZh: "02 · 产业化落地期", labelEn: "02 · Industrialization Era", years: "2021 —" });
      }
      slots.push({ kind: "milestone", item: m, index: i });
    });
  }

  return (
    <>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        forceLightText={false}
      />

      <main className="w-full bg-[#08090a] text-slate-100 min-h-screen font-sans antialiased">
        {/* Back Button */}
        <div className="fixed top-20 left-4 md:left-8 z-40">
          <Link
            href="/about"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-full text-sm text-slate-400 hover:text-white hover:border-neutral-600 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isZh ? "关于我们" : "About Us"}</span>
          </Link>
        </div>

        {/* ================= 1. Header 头部区域 ================= */}
        <section className="border-b border-neutral-900 pt-28 pb-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              <span>{isZh ? "创新与发展历程" : "Our Journey"}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white leading-tight">
                  {isZh ? (
                    <>
                      创新与发展历程
                      <br />
                      <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        从科研突破到产业应用
                      </span>
                    </>
                  ) : (
                    <>
                      Our Journey
                      <br />
                      <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        From Research to Commercialization
                      </span>
                    </>
                  )}
                </h1>
              </div>
              <div className="lg:col-span-4">
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  {isZh
                    ? "记录深安锂能从顶尖实验室底层学术突破，到规模化制造与全球高端装备市场落地的跨越历程。"
                    : "Recording Swift Safe Energy's journey from top-tier lab breakthroughs to large-scale manufacturing and global high-end equipment market deployment."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. 纵向时间轴区域 ================= */}
        <section className="py-24 px-6 md:px-12 relative overflow-hidden">
          {/* Background subtle grid */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(rgba(37,99,235,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />

          <div className="max-w-5xl mx-auto relative">
            {/* Center axis line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-neutral-800 -translate-x-1/2 z-0" />

            {/* Timeline list */}
            <div className="space-y-16 md:space-y-24 relative z-10">
              {slots.map((s, i) => {
                if (s.kind === "banner") {
                  return <PhaseBanner key={`b-${s.phase}-${i}`} phase={s.phase} labelZh={s.labelZh} labelEn={s.labelEn} years={s.years} isZh={isZh} />;
                }
                const item = s.item;
                const phase = phaseOf(item.year);
                const isEven = s.index % 2 === 0;

                // 2021 转折点 —— 满宽、强调色、不再左右交替
                if (phase === "transition") {
                  return (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: s.index * 0.05 }}
                      onMouseEnter={() => setActiveYear(item.year)}
                      className="flex flex-col items-center group"
                    >
                      <div className="w-full md:max-w-2xl pl-12 md:pl-0 relative">
                        <div className="relative p-8 md:p-10 rounded-2xl border-2 border-[#0D9488]/45 bg-gradient-to-br from-[#0D9488]/15 via-[#0D9488]/5 to-transparent backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-mono tracking-[0.3em] text-[#0D9488] uppercase">
                              {isZh ? "里程碑转折 · A Pivotal Year" : "A Pivotal Year · 里程碑转折"}
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
                          </div>
                          <div className="text-5xl md:text-6xl font-mono font-bold text-white mb-4 tracking-tight">2021</div>
                          <h3 className="text-xl md:text-2xl font-medium text-white mb-3 flex items-center gap-2">
                            {isZh ? item.title : item.titleEn}
                          </h3>
                          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                            {isZh ? item.desc : item.descEn}
                          </p>
                        </div>
                      </div>
                      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-6 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-[#0D9488] shadow-[0_0_24px_rgba(13,148,136,0.7)]" />
                      </div>
                    </motion.div>
                  );
                }

                // 科研期偏冷、产业化期更亮
                const isResearch = phase === "research";
                const borderClass = isResearch
                  ? "border-slate-700/40 group-hover:border-slate-600/60"
                  : "border-[#0D9488]/25 group-hover:border-[#0D9488]/50";
                const bgClass = isResearch ? "bg-neutral-900/20" : "bg-neutral-900/30";
                const yearColor = isResearch
                  ? "text-slate-300 group-hover:text-white"
                  : "text-white group-hover:text-[#0D9488]";
                const descColor = isResearch
                  ? "text-slate-500 group-hover:text-slate-400"
                  : "text-slate-400 group-hover:text-slate-300";
                const nodeColor = isResearch
                  ? activeYear === item.year
                    ? "bg-[#2563EB] border-white scale-125 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                    : "bg-[#08090a] border-slate-600 group-hover:border-slate-300"
                  : activeYear === item.year
                    ? "bg-[#0D9488] border-white scale-125 shadow-[0_0_20px_rgba(13,148,136,0.5)]"
                    : "bg-[#0a0a0f] border-[#0D9488]/50 group-hover:border-[#0D9488]";

                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: s.index * 0.05 }}
                    onMouseEnter={() => setActiveYear(item.year)}
                    className={`flex flex-col md:flex-row items-start ${isEven ? "md:flex-row-reverse" : ""} group`}
                  >
                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-10">
                      <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 ${borderClass} ${bgClass}`}>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-3xl font-mono font-bold tracking-tight transition-colors duration-300 ${yearColor}`}>
                            {item.year}
                          </span>
                          <span className={`text-[10px] font-mono uppercase tracking-widest bg-neutral-900 px-2.5 py-1 rounded border ${isResearch ? "text-slate-500 border-neutral-800" : "text-[#0D9488] border-[#0D9488]/30"}`}>
                            {isZh ? item.tag : item.tagEn}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                          <span>{isZh ? item.title : item.titleEn}</span>
                          {item.highlight && (
                            <Sparkles className={`w-3.5 h-3.5 ${isResearch ? "text-slate-400" : "text-[#0D9488]"}`} />
                          )}
                        </h3>
                        <p className={`text-xs md:text-sm leading-relaxed font-light transition-colors duration-300 ${descColor}`}>
                          {isZh ? item.desc : item.descEn}
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-6 flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${nodeColor}`} />
                    </div>
                    <div className="hidden md:block w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 3. 底部总结 & 按钮 ================= */}
        <section className="py-20 border-t border-neutral-900 bg-[#060708] text-center px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
              {isZh ? "未来展望" : "Future Outlook"}
            </span>
            <h2 className="text-2xl md:text-3xl font-light text-white">
              {isZh
                ? "坚持自主创新，赋能高端装备电动化"
                : "Persist in Independent Innovation, Empowering High-End Equipment Electrification"}
            </h2>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-200"
              >
                <span>{isZh ? "联系我们探讨技术合作" : "Contact Us for Tech Cooperation"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer translations={currentMessages} locale={locale} />
    </>
  );
}
