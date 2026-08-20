"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

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
    title: "技术研究启动",
    titleEn: "R&D Initiation",
    tag: "技术研究",
    tagEn: "R&D",
    desc: "依托院士团队科研力量，围绕下一代高比能固态电解质与高硅负极体系开启底层技术攻关。",
    descEn: "Launched fundamental technology research on next-gen high-energy-density solid-state electrolytes and high-silicon anode systems with academician-led research team.",
  },
  {
    year: "2016",
    title: "Nature 正刊发表",
    titleEn: "Published in Nature",
    tag: "学术突破",
    tagEn: "Academic",
    desc: "关键电池材料突破性研究成果发表于国际顶级学术期刊《Nature》，奠定技术学术地位。",
    descEn: "Breakthrough research on key battery materials published in Nature, establishing academic leadership.",
    highlight: true,
  },
  {
    year: "2018",
    title: "极寒快充技术突破",
    titleEn: "Extreme Cold Fast-Charging",
    tag: "技术创新",
    tagEn: "Innovation",
    desc: "攻克 -40℃ 极寒低温环境下的高倍率快充与循环寿命衰减难题，拓展应用边界。",
    descEn: "Solved high-rate fast-charging and cycle life challenges at -40°C extreme cold, expanding application boundaries.",
  },
  {
    year: "2019",
    title: "全球首发速热 6C 超充",
    titleEn: "World's First 6C Rapid Heating",
    tag: "全球首发",
    tagEn: "World First",
    desc: "推出业界领先的速热 6C 超快充电池技术，实现分钟级补能与高安全性兼备。",
    descEn: "Launched industry's leading rapid-heating 6C ultra-fast charging technology, achieving minute-level energy replenishment with high safety.",
    highlight: true,
  },
  {
    year: "2021",
    title: "产业化团队组建",
    titleEn: "Industrialization Team",
    tag: "团队组建",
    tagEn: "Team",
    desc: "院士团队与资深新能源产业化工程专家共同组建实体公司，开启规模化商业落地。",
    descEn: "Founded the company with academician team and senior new energy industrialization experts, launching commercial-scale deployment.",
  },
  {
    year: "2022",
    title: "试制平台建成",
    titleEn: "Pilot Line Completed",
    tag: "中试验证",
    tagEn: "Pilot",
    desc: "搭建高标准中试生产线，启动先进电芯与模组在无人机及特种装备上的实测验证。",
    descEn: "Built high-standard pilot production line, launching real-world testing of advanced cells and modules in drones and specialized equipment.",
  },
  {
    year: "2023",
    title: "百吨级量产工艺开发",
    titleEn: "Hundred-Ton Production",
    tag: "规模量产",
    tagEn: "Mass Prod",
    desc: "攻克关键材料百吨级稳定制备与规模化涂布工艺，打通实验室到工厂的关键卡点。",
    descEn: "Mastered hundred-ton stable preparation and large-scale coating processes for key materials, bridging lab-to-factory gap.",
  },
  {
    year: "2024",
    title: "深圳总部设立",
    titleEn: "Shenzhen HQ Established",
    tag: "总部成立",
    tagEn: "HQ",
    desc: "深安锂能（深圳）总部正式成立，聚焦低空经济、具身智能与高端装备电源市场。",
    descEn: "Swift Safe Energy (Shenzhen) headquarters officially established, focusing on low-altitude economy, embodied intelligence, and high-end equipment power markets.",
  },
  {
    year: "2025",
    title: "融资规模超 1 亿元",
    titleEn: "100M+ RMB Funding Raised",
    tag: "战略融资",
    tagEn: "Funding",
    desc: "完成过亿元战略融资，资本与产业资源加码，加速产能建设与产品交付进程。",
    descEn: "Completed strategic financing exceeding 100M RMB, accelerating capacity building and product delivery.",
    highlight: true,
  },
  {
    year: "2026",
    title: "0.5GWh 生产基地建设",
    titleEn: "0.5GWh Gigafactory",
    tag: "超级工厂",
    tagEn: "Gigafactory",
    desc: "启动 0.5GWh 先进电池规模化生产基地建设，全面开启低空与工业级电源的大批量交付。",
    descEn: "Started 0.5GWh advanced battery mass production base construction, fully launching batch delivery for low-altitude and industrial-grade power.",
    highlight: true,
  },
];

export default function HistoryPage() {
  const [locale, setLocale] = useState<"en" | "zh">("zh");
  const currentMessages = messages[locale];
  const isZh = locale === "zh";
  const [activeYear, setActiveYear] = useState<string>("2026");

  return (
    <>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        forceLightText={true}
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
              <span>{isZh ? "发展历程" : "Milestones"}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white leading-tight">
                  {isZh ? (
                    <>
                      从技术研究到产业化
                      <br />
                      <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        十载创新之路
                      </span>
                    </>
                  ) : (
                    <>
                      From Research to
                      <br />
                      <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Industrialization
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
              {milestones.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    onMouseEnter={() => setActiveYear(item.year)}
                    className={`flex flex-col md:flex-row items-start ${
                      isEven ? "md:flex-row-reverse" : ""
                    } group`}
                  >
                    {/* Content card (half width) */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-10">
                      <div
                        className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
                          item.highlight
                            ? "bg-neutral-900/60 border-neutral-700 group-hover:border-[#2563EB]/50"
                            : "bg-neutral-900/20 border-neutral-800/80 group-hover:border-neutral-700"
                        }`}
                      >
                        {/* Year & Tag Header */}
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`text-3xl font-mono font-bold tracking-tight transition-colors duration-300 ${
                              item.highlight
                                ? "text-white group-hover:text-[#2563EB]"
                                : "text-white group-hover:text-slate-300"
                            }`}
                          >
                            {item.year}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">
                            {isZh ? item.tag : item.tagEn}
                          </span>
                        </div>

                        {/* Milestone title */}
                        <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                          <span>{isZh ? item.title : item.titleEn}</span>
                          {item.highlight && (
                            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                          )}
                        </h3>

                        {/* Milestone description */}
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light">
                          {isZh ? item.desc : item.descEn}
                        </p>
                      </div>
                    </div>

                    {/* Center axis node circle */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-6 flex items-center justify-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                          activeYear === item.year
                            ? "bg-[#2563EB] border-white scale-125 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                            : "bg-[#08090a] border-neutral-600 group-hover:border-slate-300"
                        }`}
                      />
                    </div>

                    {/* Empty space on the other side (for layout balance) */}
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
