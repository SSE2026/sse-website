"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { newsItems, getCategoryLabel } from "@/data/news"
import en from "@/messages/en.json"
import zh from "@/messages/zh.json"

const messages = { en, zh }

// Extended news content data
const newsContent: Record<number, { content: string; contentZh: string }> = {
  22: {
    content: `Deep Safe Energy is pioneering a new approach to aviation battery electrolyte R&D by integrating physics-based AI models that truly "understand" electrochemistry.

By embedding fundamental electrochemical principles into AI training data and model architecture, our team has achieved a breakthrough in electrolyte development efficiency—nearly **4x faster** than traditional trial-and-error methods.

## Key Achievements

**Physics-Enhanced AI**: Unlike pure data-driven approaches, our physics-enhanced AI models incorporate:
- Electrochemical reaction kinetics
- Ionic transport mechanisms
- Electrolyte stability boundaries
- Thermal behavior prediction

**Development Acceleration**: The integration of physics-based constraints dramatically reduces the search space for optimal electrolyte formulations, enabling rapid iteration and validation.

**Aviation-Grade Performance**: The resulting electrolytes meet the stringent requirements for next-generation aviation batteries, including:
- Wide operating temperature range
- High ionic conductivity
- Exceptional thermal stability
- Long cycle life

"Our physics-enhanced AI approach represents a paradigm shift in battery materials discovery," said Prof. Yang Xiaoguang. "By combining fundamental electrochemical principles with machine learning, we're not just accelerating R&D—we're making it fundamentally smarter."`,
    contentZh: `深安锂能正在引领一种全新的航空电池电解液研发方法——让AI"懂电化学"的物理增强AI。

通过将电化学基本原理嵌入AI训练数据和模型架构，我们的团队在电解液开发效率方面取得了突破——比传统试错法快了将近**4倍**。

## 关键成就

**物理增强AI**：与纯数据驱动方法不同，我们的物理增强AI模型整合了：
- 电化学反应动力学
- 离子传输机制
- 电解液稳定性边界
- 热行为预测

**研发加速**：物理约束的整合大大缩小了最优电解液配方的搜索空间，实现了快速迭代和验证。

**航空级性能**：所开发的电解液满足下一代航空电池的严格要求，包括：
- 宽工作温度范围
- 高离子电导率
- 卓越的热稳定性
- 长循环寿命

"我们的物理增强AI方法代表了电池材料发现的范式转变，"杨晓光教授表示。"通过将电化学基本原理与机器学习相结合，我们不仅在加速研发——更是在让它从根本上变得更智能。"`,
  },
  21: {
    content: `Deep Safe Energy is entering a new phase of industrialization and delivery, expanding our reach across air, land, sea, and space applications.

## Strategic Progress

**Production Capacity**: Our 0.5GWh production base is now under construction, with pilot production lines already operational.

**Application Expansion**: From UAV batteries to marine equipment, our solid-state battery solutions are enabling electrification across diverse boundary scenarios.

**Partnership Network**: Strategic collaborations with industry leaders in drones, robotics, and heavy machinery are accelerating market adoption.

## Vision Forward

We remain committed to our mission of "Engineering the next generation of energy" while expanding our capabilities to serve an increasingly diverse range of applications.`,
    contentZh: `深安锂能正在进入产业化和交付的新阶段，将业务扩展到空、天、地、海应用领域。

## 战略进展

**产能建设**：我们的0.5GWh生产基地正在建设中，中试生产线已投入运营。

**应用拓展**：从无人机电池到海洋装备，我们的固态电池解决方案正在赋能多元边界场景的电动化。

**合作网络**：与无人机、机器人、重型机械等行业领袖的战略合作正在加速市场采用。

## 未来愿景

我们将继续践行"定义下一代能源"的使命，同时拓展能力，为日益多元化的应用场景提供服务。`,
  },
  20: {
    content: `Recent policy developments are driving the industrialization of low-altitude logistics, with high-energy-density batteries emerging as a key enabler for next-generation cargo UAVs.

## Policy Landscape

**Urban Air Mobility (UAM)**: Government initiatives are creating a favorable environment for cargo drone operations in urban areas.

**Low-Altitude Economy**: Strategic support for low-altitude commerce is opening new possibilities for aerial delivery and logistics.

**Battery Requirements**: Extended range and heavier payload capacity require batteries with significantly improved energy density.

## Technology Enablement

High-energy-density batteries are解锁无人机载重与航程新边界, enabling:
- Longer flight distances
- Greater cargo capacity
- Reduced charging frequency
- Improved operational efficiency

As policy support continues to strengthen, the intersection of favorable regulations and advanced battery technology is creating unprecedented opportunities for the low-altitude logistics industry.`,
    contentZh: `近期政策发展正在推动低空物流产业化，高能量密度电池正成为下一代货运无人机的关键赋能技术。

## 政策环境

**城市空中交通（UAM）**：政府举措正在为城市地区货运无人机运营创造有利环境。

**低空经济**：对低空经济的战略支持正在为空中配送和物流开辟新的可能性。

**电池需求**：更长的续航和更大的有效载荷需要能量密度显著提升的电池。

## 技术赋能

高能量密度电池正在解锁无人机载重与航程新边界，实现：
- 更长的飞行距离
- 更大的货物容量
- 减少充电频率
- 提高运营效率

随着政策支持持续加强，利好政策与先进电池技术的交汇正在为低空物流行业创造前所未有的机遇。`,
  },
  19: {
    content: `Deep Safe Energy proudly announces the launch of YunChi 460-X: our groundbreaking anode-free battery achieving **460Wh/kg**.

## Breakthrough Achievement

The YunChi 460-X represents a paradigm shift in battery design. By eliminating the traditional anode and utilizing innovative materials, we've achieved unprecedented energy density.

### Key Specifications

| Parameter | Value |
|-----------|-------|
| Energy Density | 460 Wh/kg |
| Chemistry | Anode-free |
| Application | Extreme endurance / High power |
| Peak Discharge | 10C |

## Technical Innovation

**Anode-Free Design**: By removing the anode entirely, we've dramatically increased energy density while reducing weight.

**Advanced Materials**: Proprietary cathode materials and solid-state electrolyte technology enable this breakthrough.

**Safety First**: Despite the extreme energy density, the YunChi 460-X maintains our signature safety performance through solid-state technology.

## Applications

The YunChi 460-X is ideal for:
- Long-endurance UAVs
- eVTOL aircraft
- High-power robotics
- Space-constrained applications requiring maximum energy`,
    contentZh: `深安锂能骄傲地发布云驰460-X：我们突破性的无负极电池，能量密度达到**460Wh/kg**。

## 突破性成就

云驰460-X代表了电池设计的范式转变。通过消除传统负极并采用创新材料，我们实现了前所未有的能量密度。

### 关键规格

| 参数 | 数值 |
|------|------|
| 能量密度 | 460 Wh/kg |
| 化学体系 | 无负极 |
| 应用 | 极限续航 / 高功率 |
| 峰值放电 | 10C |

## 技术创新

**无负极设计**：通过完全去除负极，我们大幅提升了能量密度同时减轻了重量。

**先进材料**：专有的正极材料和固态电解质技术实现了这一突破。

**安全优先**：尽管能量密度极高，云驰460-X通过固态技术保持了我们标志性的安全性能。

## 应用场景

云驰460-X适用于：
- 长航时无人机
- eVTOL飞行器
- 高功率机器人
- 需要最大能量的空间受限应用`,
  },
  18: {
    content: `Deep Safe Energy and Liugong have signed a strategic cooperation agreement to jointly advance the R&D and industrialization of solid-state battery systems for construction machinery.

## Partnership Overview

This collaboration brings together Deep Safe Energy's expertise in solid-state battery technology with Liugong's leadership in construction equipment manufacturing.

### Key Focus Areas

**Heavy-Duty Applications**: Developing solid-state battery solutions capable of powering large-scale construction machinery.

**Extreme Conditions**: Creating batteries optimized for the demanding environments of construction sites.

**Long-Term Partnership**: A multi-year collaboration focused on bringing products to market.

## Strategic Significance

"Partnering with Liugong represents a significant step in our mission to enable electrification across all boundary scenarios," said Prof. Yang Xiaoguang. "Construction machinery is a critical area where high-performance batteries can drive meaningful environmental impact."

## Timeline

- Phase 1: Joint R&D and prototype development
- Phase 2: Testing and validation
- Phase 3: Pilot production and market introduction
- Phase 4: Full-scale industrialization`,
    contentZh: `深安锂能与柳工签署战略合作协议，共同推进工程机械固态电池系统关键技术研发与产业化。

## 合作概况

此次合作将深安锂能在固态电池技术方面的专业知识与柳工在工程机械制造领域的领导地位相结合。

### 关键重点领域

**重型应用**：开发能够为大型工程机械提供动力的固态电池解决方案。

**极端条件**：打造针对工程机械严苛工作环境优化的电池。

**长期合作**：聚焦产品市场化多年的合作。

## 战略意义

"与柳工的合作是我们使命中的重要一步，即实现所有边界场景的电动化，"杨晓光教授表示。"工程机械是一个关键领域，高性能电池可以推动有意义的环境影响。"

## 时间表

- 第一阶段：联合研发与原型开发
- 第二阶段：测试与验证
- 第三阶段：中试生产与市场导入
- 第四阶段：规模化产业化`,
  },
  17: {
    content: `The convergence of the trillion-dollar low-altitude economy and embodied AI represents the next frontier of industrial transformation—and battery technology sits at its center.

## Two Trillion-Dollar Opportunities

**Low-Altitude Economy**: From urban air mobility to cargo delivery, the low-altitude sector is projected to become a major economic driver.

**Embodied AI**: Humanoid robots and autonomous systems represent a massive market with demanding power requirements.

## The Battery Bottleneck

Both industries face a common challenge: current battery technology cannot meet the demanding requirements of these applications.

### Key Limitations

- **Energy Density**: Existing batteries limit flight time and operational duration
- **Power Output**: High-power applications require batteries that can deliver sustained performance
- **Safety**: Aviation and robotics demand exceptional safety standards
- **Cycle Life**: Commercial viability requires long-lasting batteries

## The Path Forward

Advanced solid-state battery technology offers the path to overcoming these limitations. Higher energy density, improved safety, and longer cycle life make solid-state batteries the enabling technology for both industries.

"The ceiling for these industries is ultimately determined by what's possible in battery technology," noted our R&D team. "We're working to raise that ceiling."`,
    contentZh: `万亿低空经济与万亿具身智能的交汇代表了产业转型的下一个前沿——而电池技术正位于其核心。

## 两个万亿级机遇

**低空经济**：从城市空中交通到货运配送，低空领域预计将成为主要的经济驱动力。

**具身智能**：人形机器人和自主系统代表着一个对功率要求苛刻的巨大市场。

## 电池瓶颈

两个行业面临着共同的挑战：现有电池技术无法满足这些应用的苛刻要求。

### 关键限制

- **能量密度**：现有电池限制了飞行时间和运行持续时间
- **功率输出**：高功率应用需要能够持续输出的电池
- **安全性**：航空和机器人行业要求卓越的安全标准
- **循环寿命**：商业可行性需要长寿命电池

## 前进之路

先进的固态电池技术提供了克服这些限制的路径。更高的能量密度、更高的安全性和更长的循环寿命使固态电池成为两个行业的赋能技术。

"这些产业的天花板最终取决于电池技术可能达到的高度，"我们的研发团队指出。"我们正在努力提升那个天花板。"`,
  },
  16: {
    content: `Deep Safe Energy has completed a tens of millions RMB angel funding round to accelerate the industrialization of high-energy-density ultra-fast charging solid-state batteries.

## Funding Highlights

**Investment Amount**: Tens of millions RMB
**Stage**: Angel Round
**Purpose**: Accelerate mass production and market expansion

## Strategic Investments

The funding will be used to:

### 1. Production Scale-Up
- Complete construction of 0.5GWh production base
- Procure advanced manufacturing equipment
- Build out quality control systems

### 2. R&D Advancement
- Continue development of next-generation materials
- Expand testing and validation capabilities
- Strengthen IP portfolio

### 3. Team Growth
- Recruit top engineering talent
- Build out commercial and operations teams
- Expand technical support capabilities

## Investor Confidence

"This funding round reflects investor confidence in our technology and business model," said Prof. Yang Xiaoguang. "We're grateful for the support and committed to delivering results."

## Looking Ahead

With this funding, Deep Safe Energy is well-positioned to accelerate our path to mass production and establish ourselves as a leader in next-generation battery technology.`,
    contentZh: `深安锂能完成数千万人民币天使轮融资，加快高比能超充固态电池产业化进程。

## 融资亮点

**融资金额**：数千万人民币
**轮次**：天使轮
**用途**：加快量产与市场拓展

## 战略投资方向

融资将用于：

### 1. 产能扩大
- 完成0.5GWh生产基地建设
- 采购先进生产设备
- 建立质量控制体系

### 2. 研发推进
- 持续开发下一代材料
- 扩展测试验证能力
- 加强知识产权布局

### 3. 团队建设
- 招募顶尖工程人才
- 建立商业和运营团队
- 扩展技术支持能力

## 投资人信心

"本轮融资体现了投资人对我们技术和商业模式的信心，"杨晓光教授表示。"我们感谢支持，并致力于交付成果。"

## 展望未来

有了这笔融资，深安锂能正处于加速量产和确立下一代电池技术领先地位的有利位置。`,
  },
  15: {
    content: `Deep Safe Energy showcased our next-generation ultra-fast charging solid-state battery technology at CIBF2025, with Founder Prof. Yang Xiaoguang delivering a keynote speech.

## CIBF2025 Highlights

**Event**: China International Battery Fair 2025
**Location**: Shenzhen, China
**Date**: May 2025

## Exhibition Showcase

Our booth featured:

### Technology Demonstrations
- Ultra-fast charging solid-state battery cells
- High-energy-density battery modules
- Application solutions for UAVs and robotics

### Live Presentations
- Real-time charging performance demonstrations
- Safety testing showcases
- Technical specification reviews

## Keynote Speech

Prof. Yang Xiaoguang delivered a keynote on "The Future of Solid-State Battery Technology" covering:

**Technical Advances**: Our latest breakthroughs in materials and cell design

**Application Insights**: How our batteries are enabling new possibilities in aviation, robotics, and marine applications

**Industry Vision**: The roadmap for solid-state battery commercialization

## Industry Recognition

The presentation generated significant interest from industry attendees, with many expressing interest in potential partnerships and applications of our technology.

## Looking Forward

CIBF2025 reinforced our position as a leading innovator in solid-state battery technology and opened new opportunities for collaboration.`,
    contentZh: `深安锂能携下一代超充固态电池技术亮相CIBF2025，创始人杨晓光教授发表主题演讲。

## CIBF2025 亮点

**活动**：2025中国国际电池技术交流会/展览会
**地点**：中国深圳
**时间**：2025年5月

## 展览展示

我们的展位展示了：

### 技术演示
- 超充固态电池电芯
- 高能量密度电池模组
- 无人机和机器人应用解决方案

### 现场演示
- 实时充电性能演示
- 安全测试展示
- 技术规格说明

## 主题演讲

杨晓光教授发表了关于"固态电池技术的未来"的主题演讲，涵盖：

**技术进展**：我们在材料和电芯设计方面的最新突破

**应用洞察**：我们的电池如何赋能航空、机器人和海洋应用的新可能

**行业愿景**：固态电池商业化路线图

## 行业认可

演讲引发了行业参会者的极大兴趣，许多人表示对潜在合作和应用我们的技术感兴趣。

## 展望未来

CIBF2025巩固了我们在固态电池技术领域的领先创新者地位，并开启了新的合作机会。`,
  },
}

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [locale, setLocale] = useState<"en" | "zh">("en")
  const currentMessages = messages[locale]
  const isZh = locale === "zh"

  // Find the news item by slug
  const newsItem = newsItems.find((item) => item.slug === slug) || newsItems[0]
  const content = newsContent[newsItem.id] || {
    content: "Content coming soon...",
    contentZh: "内容即将发布...",
  }

  // Get related news (exclude current)
  const relatedNews = newsItems.filter((item) => item.slug !== slug).slice(0, 2)

  const formattedDate = newsItem.date.replace(/-/g, ".")

  // Simple markdown-like renderer
  const renderContent = (text: string) => {
    const paragraphs = text.split("\n\n")
    return paragraphs.map((para, i) => {
      if (para.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-medium text-[#111111] mt-8 mb-3">
            {para.replace("## ", "")}
          </h2>
        )
      }
      if (para.startsWith("### ")) {
        return (
          <h3 key={i} className="text-lg font-medium text-[#111111] mt-6 mb-2">
            {para.replace("### ", "")}
          </h3>
        )
      }
      if (para.startsWith("| ")) {
        const rows = para.split("\n").filter((line) => line.trim())
        const headerCells = rows[0].split("|").filter(Boolean).map((cell) => cell.trim())
        const bodyRows = rows.slice(2).map((row) => row.split("|").filter(Boolean).map((cell) => cell.trim()))

        return (
          <div key={i} className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {headerCells.map((cell, j) => (
                    <th key={j} className="text-left py-2 pr-4 font-medium text-[#555555]">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, j) => (
                  <tr key={j} className="border-b border-[#E5E7EB] last:border-b-0">
                    {row.map((cell, k) => (
                      <td key={k} className="py-2 pr-4 text-[#111111]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      if (para.startsWith("- ")) {
        const items = para.split("\n").filter((line) => line.startsWith("- "))
        return (
          <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-[#555555]">
            {items.map((item, j) => (
              <li key={j}>{item.replace("- ", "")}</li>
            ))}
          </ul>
        )
      }
      if (para.startsWith("**") && para.endsWith("**")) {
        return <p key={i} className="font-medium text-[#111111] my-4">{para.replace(/\*\*/g, "")}</p>
      }
      if (para.startsWith("**")) {
        // Bold inline
        const parts = para.split(/(\*\*[^*]+\*\*)/g)
        return (
          <p key={i} className="text-[#555555] leading-relaxed my-4">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j} className="font-medium text-[#111111]">{part.replace(/\*\*/g, "")}</strong>
              }
              return part
            })}
          </p>
        )
      }
      return <p key={i} className="text-[#555555] leading-relaxed my-4">{para}</p>
    })
  }

  return (
    <>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
      />

      <main className="min-h-screen bg-[#F7F8FA] pt-[72px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <div className="py-4">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-[13px] text-[#8A8F98] hover:text-[#555555] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isZh ? "返回新闻列表" : "Back to News"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <section className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <div className="py-10 lg:py-14 max-w-[900px]">
              {/* Category and Date */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 mb-5"
              >
                <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#155EEF]">
                  {getCategoryLabel(newsItem.category, locale)}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
                <span className="text-[13px] text-[#8A8F98]">{formattedDate}</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[28px] lg:text-[36px] font-medium leading-[1.25] text-[#111111] mb-6"
              >
                {newsItem.title}
              </motion.h1>

              {/* Featured Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-[16/9] overflow-hidden bg-[#F7F8FA] mb-8"
              >
                <Image
                  src={newsItem.image}
                  alt={newsItem.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <div className="max-w-[720px] pb-12 lg:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {renderContent(isZh ? content.contentZh : content.content)}
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[#E5E7EB]"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] text-[#8A8F98] border border-[#E5E7EB]">
                  <Tag className="w-3 h-3" />
                  {getCategoryLabel(newsItem.category, locale)}
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <section className="bg-[#F7F8FA] border-t border-[#E5E7EB]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
              <div className="py-12 lg:py-16">
                <h2 className="text-[18px] font-medium text-[#111111] mb-6">
                  {isZh ? "相关阅读" : "Related Articles"}
                </h2>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  {relatedNews.map((item, index) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="bg-white border border-[#E5E7EB]"
                    >
                      <Link href={`/news/${item.slug}`} className="block group">
                        {/* Image */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-[#F7F8FA]">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#155EEF]">
                              {getCategoryLabel(item.category, locale)}
                            </span>
                            <span className="text-[12px] text-[#8A8F98]">
                              {item.date.replace(/-/g, ".")}
                            </span>
                          </div>

                          <h3 className="text-[16px] font-medium leading-[1.4] text-[#111111] group-hover:text-[#155EEF] transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {/* View All */}
                <div className="mt-8 text-center">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-[#111111] group"
                  >
                    <span>{isZh ? "查看全部新闻" : "View All News"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-[#F1F3F5] border-t border-[#E5E7EB]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <div className="py-12 lg:py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="text-[20px] lg:text-[24px] font-medium text-[#111111] mb-2">
                  {isZh ? "准备好突破能量边界了吗？" : "Ready to break energy limits?"}
                </h3>
                <p className="text-[14px] text-[#555555]">
                  {isZh
                    ? "了解我们的技术如何为您的应用提供动力。"
                    : "Discover how our technology can power your applications."}
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/products/cloudchi-360-p"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-white bg-[#111111] hover:bg-[#333333] transition-colors"
                >
                  {isZh ? "浏览产品" : "View Products"}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium text-[#111111] border border-[#E5E7EB] hover:bg-white transition-colors"
                >
                  {isZh ? "联系我们" : "Contact Us"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer translations={currentMessages} locale={locale} />
    </>
  )
}
