/**
 * 深安锂能 - 技术研发页面数据配置 V3.0
 * Technology R&D Page Data Configuration
 *
 * 极简工业科技版 - Premium Minimal Industrial Design
 */

export type ContentStatus = 'PUBLISHED' | 'CONTENT_REVIEW_REQUIRED';

export interface CoreTechnology {
  id: string;
  number: string;
  title: string;
  titleEn: string;
  summary: string;
  visual: string;
  details: Array<{
    text: string;
    status: ContentStatus;
  }>;
}

export interface RDStrength {
  id: string;
  number: string;
  title: string;
  titleEn: string;
  lines: string[];
  status: ContentStatus;
}

export interface TechnologyPageData {
  hero: {
    badge: string;
    title: string;
    titleEn: string;
    subtitle: string;
    image: string;
  };
  coreTechnologies: CoreTechnology[];
  rdStrengths: RDStrength[];
  cta: {
    title: string;
    titleEn: string;
    buttonText: string;
  };
}

export const technologyData: TechnologyPageData = {
  // --------------------------------------------------
  // SECTION 01: Hero
  // --------------------------------------------------
  hero: {
    badge: 'TECHNOLOGY & R&D',
    title: '以技术，定义为来',
    titleEn: 'ENGINEERING THE NEXT GENERATION OF ENERGY',
    subtitle: '持续突破材料、电芯与智能化技术边界',
    image: '/images/technology/hero-material.jpg',
  },

  // --------------------------------------------------
  // SECTION 02: Core Technology (4项)
  // --------------------------------------------------
  coreTechnologies: [
    {
      id: 'fast-charging',
      number: '01',
      title: '多维协同速热超充',
      titleEn: 'MULTI-DIMENSIONAL FAST CHARGING',
      summary: '高效离子传输与电热协同控制',
      visual: '/images/technology/solid-electrolyte.jpg',
      details: [
        { text: '超高离子导电液 / 添加剂', status: 'PUBLISHED' },
        { text: '高离子导高纯氧化物固态电解质', status: 'PUBLISHED' },
        { text: '快速无损自加热结构与电 & 热智能调控', status: 'PUBLISHED' },
      ],
    },
    {
      id: 'high-energy',
      number: '02',
      title: '高能量密度',
      titleEn: 'HIGH ENERGY DENSITY',
      summary: '高性能材料与紧凑结构协同设计',
      visual: '/images/technology/electrode-material.jpg',
      details: [
        { text: '高稳定微纳复合电极材料 + 耐高温阻燃电解质', status: 'PUBLISHED' },
        { text: '耐高温氧化物固态电解质创新应用', status: 'PUBLISHED' },
        { text: '原位界面柔化技术', status: 'PUBLISHED' },
        { text: '九系高镍领先体系 + 固态电解质', status: 'PUBLISHED' },
        { text: '亚微米多孔硅氧复合技术', status: 'PUBLISHED' },
        { text: '耐高压硅基 / 锂金属电解液', status: 'PUBLISHED' },
        { text: '超薄基材设计', status: 'PUBLISHED' },
      ],
    },
    {
      id: 'solid-state',
      number: '03',
      title: '固态材料与界面',
      titleEn: 'SOLID-STATE MATERIALS & INTERFACE',
      summary: '固态电解质与界面工程技术',
      visual: '/images/technology/interface-engineering.jpg',
      details: [
        { text: '耐高温氧化物固态电解质创新应用', status: 'PUBLISHED' },
        { text: '原位界面柔化技术', status: 'PUBLISHED' },
      ],
    },
    {
      id: 'smart-ops',
      number: '04',
      title: '智能运维',
      titleEn: 'INTELLIGENT OPERATION',
      summary: '机理模型与AI融合智能管理',
      visual: '/images/technology/battery-intelligence.jpg',
      details: [
        { text: '高精度电池机理模型', status: 'PUBLISHED' },
        { text: '多维异构数据库', status: 'PUBLISHED' },
        { text: '机理 - AI 融合云边系统智能运维', status: 'PUBLISHED' },
      ],
    },
  ],

  // --------------------------------------------------
  // SECTION 03: R&D Strength (6项)
  // --------------------------------------------------
  rdStrengths: [
    {
      id: 'talent',
      number: '01',
      title: '顶尖研发团队',
      titleEn: 'TOP R&D TEAM',
      lines: ['国家级人才领衔', '掌握核心前沿技术'],
      status: 'PUBLISHED',
    },
    {
      id: 'engineering',
      number: '02',
      title: '工程与技术团队',
      titleEn: 'ELITE ENGINEERING',
      lines: ['十年以上行业经验', '强工程化能力'],
      status: 'PUBLISHED',
    },
    {
      id: 'ip',
      number: '03',
      title: '自主知识产权',
      titleEn: 'PROPRIETARY IP',
      lines: ['20+', '专利申请', '10+', '授权专利'],
      status: 'CONTENT_REVIEW_REQUIRED',
    },
    {
      id: 'industrial',
      number: '04',
      title: '产业落地',
      titleEn: 'INDUSTRIALIZATION',
      lines: ['千吨级', '固态电解质原材料产业化落地'],
      status: 'PUBLISHED',
    },
    {
      id: 'supply',
      number: '05',
      title: '供应链协同',
      titleEn: 'SUPPLY CHAIN',
      lines: ['材料、设备、工艺', '协同开发'],
      status: 'PUBLISHED',
    },
    {
      id: 'demand',
      number: '06',
      title: '需求链协同',
      titleEn: 'DEMAND CHAIN',
      lines: ['低空经济、机器人', '等新兴应用领域'],
      status: 'PUBLISHED',
    },
  ],

  // --------------------------------------------------
  // SECTION 04: CTA
  // --------------------------------------------------
  cta: {
    title: '技术驱动未来',
    titleEn: 'ENGINEERING WHAT\'S NEXT',
    buttonText: '探索产品',
  },
};
