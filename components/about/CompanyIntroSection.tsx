'use client';

import React from 'react';

export default function CompanyIntroSection() {
  return (
    <section className="w-full py-12 px-6 md:px-12 bg-[#07090e] text-slate-100 font-sans antialiased overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-3 border-b border-neutral-800/60 pb-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            ABOUT SHENAN LITHIUM
          </div>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white">
            深安锂能（深圳）
          </h2>
        </div>

        {/* Main intro */}
        <div className="space-y-4">
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
            由高校院士团队与资深产业化专家共同组建，专注于高比能、高安全先进电池研发与产业化，致力于拓展高端装备电动化的性能与应用边界。
          </p>
          <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
            面向低空经济、具身智能、深空深海、工程机械及特种装备等新兴场景，围绕材料体系、电芯设计、先进制造与智能电池系统开展全链条技术创新。
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-neutral-500">01 / 应用场景</div>
            <h3 className="text-sm font-medium text-white">前沿新兴领域</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              低空经济、具身智能机器人、深空深海、特种装备等高门槛场景
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-neutral-500">02 / 核心技术</div>
            <h3 className="text-sm font-medium text-white">全栈自主技术</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              高硅/全硅负极、固态电解质、物理 AI 驱动设计与智能制造
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-neutral-500">03 / 产品矩阵</div>
            <h3 className="text-sm font-medium text-white">云驰 & 磐石</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              「云驰」高比能系列 + 「磐石」高安全系列，已进入批量交付阶段
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
