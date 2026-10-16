// 解决方案页「行业挑战 → 核心解决能力」的配对关系。
//
// 这两组文案本来是两个独立区块,各说各话;现在合并成一屏「挑战 → 应对」对照。
// 但两边数量并不相等(挑战 4 条,能力 5–6 条),而且是一对多:
// 例如低空的「瞬时大功率与热管理」由「持续/脉冲大电流」+「两级热设计」两项能力共同解决。
//
// 所以这里用「下标」而不是文案来做映射 —— 文案是双语的,按下标映射对中英文同时生效,
// 改文案不用改这里。每条数字是该页面 highlights.items 里的下标。
//
// ⚠️ 如果调整了 messages 里 highlights 的**顺序**,这里要跟着改。

export type SolutionSlug = "lowAltitude" | "embodiedAI" | "marine" | "specialOps";

/** 每个挑战对应哪几项能力(highlights.items 的下标) */
export const CHALLENGE_TO_CAPABILITIES: Record<SolutionSlug, number[][]> = {
  // 续航与载荷受限 → 高能量密度
  // 高低温容量衰减 → -40℃ ~ 60℃
  // 瞬时大功率与热管理 → 持续/脉冲大电流 + 两级热设计
  // 供应链多方割裂 → 专用 BMS
  lowAltitude: [[0], [1], [2, 4], [3]],

  // 空间受限与重心偏移 → 轻量化 PACK + 双电池热插拔
  // 脉冲大负载 → 超大瞬时脉冲
  // 户外可靠性与温域 → 抗振动抗冲击 + -40℃ ~ 60℃
  // 电量估算精度不足 → 定制化 BMS
  embodiedAI: [[0, 4], [1], [2, 5], [3]],

  // 舱体适配与浮力配平 → 高能量密度 PACK + 异形 PACK 定制
  // 盐雾腐蚀与耐压 → 耐盐雾抗振动
  // 低温与密闭散热 → 宽温域电芯
  // 检修成本与可靠性 → 海洋适配自研 BMS
  marine: [[0, 4], [1], [2], [3]],

  // 极端工况适应 → -40℃ ~ 60℃ + 抗冲击抗振动
  // 任务关键可靠性 → 定制化 BMS + 台架模拟验证
  // 形态与电压多样化 → 非标定制
  // 脉冲负载与安全防护 → 协同安全防护
  specialOps: [[0, 1], [3, 5], [2], [4]],
};

export interface ChallengeItem {
  keyword: string;
  desc: string;
}

export interface CapabilityItem {
  label: string;
  desc: string;
}

export interface ChallengeSolutionRow {
  challenge: ChallengeItem;
  solutions: CapabilityItem[];
}

/**
 * 把挑战与能力按上面的映射组装成对照行。
 * 下标越界的能力会被忽略(并在开发环境提示),避免内容改动后整页崩掉。
 */
export function pairChallengesWithCapabilities(
  slug: SolutionSlug,
  challenges: ChallengeItem[],
  capabilities: CapabilityItem[],
): ChallengeSolutionRow[] {
  const map = CHALLENGE_TO_CAPABILITIES[slug];

  return challenges.map((challenge, i) => {
    const indexes = map[i] ?? [];

    const solutions = indexes
      .map((idx) => capabilities[idx])
      .filter((c): c is CapabilityItem => Boolean(c));

    if (process.env.NODE_ENV !== "production" && solutions.length !== indexes.length) {
      console.warn(
        `[solutionPairing] ${slug} 第 ${i + 1} 条挑战引用了不存在的能力下标 ${JSON.stringify(indexes)}`,
      );
    }

    return { challenge, solutions };
  });
}
