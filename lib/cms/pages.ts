// CMS 页面定义 — 每页的内容块 schema 和默认值
// 前台页面从数据库读 content，缺失字段时回退到默认值（这里）或组件内兜底。

export type FieldType = "text" | "textarea" | "image" | "json";

export interface CmsField {
  key: string;
  label: string;
  type: FieldType;
}

export interface CmsSection {
  key: string;
  label: string;
  fields: CmsField[];
}

export interface CmsPageDef {
  key: string;
  label: string;
  labelZh: string;
  sections: CmsSection[];
  /** 默认 content（前端硬编码值的快照，作为兜底/初始化） */
  defaultContent: Record<string, unknown>;
}

export const PAGE_DEFS: CmsPageDef[] = [
  {
    key: "home",
    label: "首页",
    labelZh: "首页",
    sections: [
      {
        key: "hero",
        label: "主视觉",
        fields: [
          { key: "slidesJson", label: "轮播图（JSON 数组，覆盖下方单字段）", type: "json" },
          { key: "eyebrow", label: "眉标", type: "text" },
          { key: "title", label: "标题", type: "text" },
          { key: "description", label: "描述", type: "textarea" },
          { key: "ctaText", label: "按钮文字", type: "text" },
          { key: "ctaLink", label: "按钮链接", type: "text" },
          { key: "videoUrl", label: "视频 URL", type: "image" },
          { key: "posterUrl", label: "封面 URL", type: "image" },
          { key: "statsJson", label: "数据（JSON）", type: "json" },
        ],
      },
    ],
    defaultContent: {
      hero: {
        eyebrow: "Solid-State Battery Tech",
        title: "Aeroride Series",
        description:
          "Next-generation high energy density solid-state power solutions for low-altitude flight, embodied AI, and deep-sea equipment.",
        ctaText: "Customize Now",
        ctaLink: "/contact",
        videoUrl: "/videos/homepage-hero-new.webm",
        posterUrl: "",
        statsJson: '[{"value":"500+","unit":"Wh/kg","label":"Energy Density"},{"value":"10C+","unit":"","label":"Peak Discharge"},{"value":"1000+","unit":"cycles","label":"Cycle Life"}]',
      },
    },
  },
  {
    key: "about",
    label: "关于我们",
    labelZh: "关于我们",
    sections: [
      {
        key: "hero",
        label: "主视觉（地图页文字）",
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "subtitle", label: "副标题", type: "text" },
          { key: "auxText", label: "辅助文字", type: "text" },
        ],
      },
      {
        key: "intro",
        label: "公司介绍",
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "body", label: "正文（段落间用空行分隔）", type: "textarea" },
        ],
      },
      {
        key: "milestones",
        label: "发展历程",
        fields: [
          { key: "itemsJson", label: "发展历程（JSON 数组）", type: "json" },
        ],
      },
      {
        key: "cta",
        label: "底部 CTA",
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "desc", label: "描述", type: "textarea" },
          { key: "button", label: "按钮文字", type: "text" },
        ],
      },
    ],
    defaultContent: {
      hero: { title: "", subtitle: "", auxText: "" },
      intro: {
        title: "深安锂能",
        body: `深安锂能（深圳）科技有限公司是一家专注于高比能、高安全先进电池研发与产业化的科技创新企业，由高校院士团队与资深产业化团队共同组建。`,
      },
      milestones: { itemsJson: "[]" },
      cta: { title: "", desc: "", button: "" },
    },
  },
  {
    key: "technology",
    label: "技术研发",
    labelZh: "技术研发",
    sections: [
      {
        key: "hero",
        label: "主视觉",
        fields: [
          { key: "badge", label: "徽标", type: "text" },
          { key: "title", label: "标题", type: "text" },
          { key: "subtitle", label: "副标题", type: "textarea" },
        ],
      },
      {
        key: "coreTech",
        label: "核心技术",
        fields: [
          { key: "label", label: "区块标题", type: "text" },
          { key: "title", label: "标题", type: "text" },
          { key: "subtitle", label: "副标题", type: "textarea" },
          { key: "itemsJson", label: "技术条目（JSON 数组）", type: "json" },
        ],
      },
      {
        key: "cta",
        label: "底部 CTA",
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "titleEn", label: "标题（英文）", type: "text" },
          { key: "button", label: "按钮文字", type: "text" },
        ],
      },
      {
        key: "rdStrength",
        label: "研发实力",
        fields: [
          { key: "label", label: "区块标题", type: "text" },
          { key: "title", label: "标题", type: "text" },
          { key: "certsJson", label: "证书图片（JSON 数组：src/alt）", type: "json" },
        ],
      },
    ],
    defaultContent: {
      hero: { badge: "", title: "", subtitle: "" },
      coreTech: { label: "", title: "", subtitle: "", itemsJson: "[]" },
      cta: { title: "", titleEn: "", button: "" },
      rdStrength: { label: "", title: "", certsJson: "[]" },
    },
  },
  {
    key: "products",
    label: "产品中心",
    labelZh: "产品中心",
    sections: [
      {
        key: "hero",
        label: "主视觉",
        fields: [
          { key: "badge", label: "徽标", type: "text" },
          { key: "title", label: "标题", type: "text" },
          { key: "subtitle", label: "副标题", type: "textarea" },
        ],
      },
      {
        key: "series",
        label: "系列文案",
        fields: [
          { key: "seriesJson", label: "系列标题/描述/图片（JSON 数组，key 为 power/storage/drone）", type: "json" },
        ],
      },
      {
        key: "comparison",
        label: "技术对比表",
        fields: [
          { key: "eyebrow", label: "眉标", type: "text" },
          { key: "title", label: "标题", type: "text" },
          { key: "rowsJson", label: "对比行（JSON 数组：feature/liion/ss）", type: "json" },
        ],
      },
      {
        key: "cta",
        label: "底部 CTA",
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "desc", label: "描述", type: "textarea" },
          { key: "button", label: "按钮文字", type: "text" },
        ],
      },
    ],
    defaultContent: {
      hero: { badge: "Products", title: "Aeroride Series", subtitle: "" },
      series: { seriesJson: "[]" },
      comparison: { eyebrow: "", title: "", rowsJson: "[]" },
      cta: { title: "", desc: "", button: "" },
    },
  },
  {
    key: "cases",
    label: "客户案例",
    labelZh: "客户案例",
    sections: [
      {
        key: "hero",
        label: "主视觉",
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "subtitle", label: "副标题", type: "textarea" },
        ],
      },
      {
        key: "case01",
        label: "案例 01",
        fields: [
          { key: "highlight", label: "主数据（如 5h）", type: "text" },
          { key: "platform", label: "平台", type: "text" },
          { key: "battery", label: "电池配置", type: "text" },
          { key: "highlightLabel", label: "主数据说明", type: "text" },
          { key: "videoUrl", label: "视频地址", type: "image" },
        ],
      },
      {
        key: "case02",
        label: "案例 02",
        fields: [
          { key: "highlight", label: "主数据（如 -40°C）", type: "text" },
          { key: "platform", label: "平台", type: "text" },
          { key: "battery", label: "电池配置", type: "text" },
          { key: "highlightLabel", label: "主数据说明", type: "text" },
          { key: "videoUrl", label: "视频地址", type: "image" },
        ],
      },
      {
        key: "case03",
        label: "案例 03",
        fields: [
          { key: "highlight", label: "主数据（如 2h）", type: "text" },
          { key: "platform", label: "平台", type: "text" },
          { key: "battery", label: "电池配置", type: "text" },
          { key: "highlightLabel", label: "主数据说明", type: "text" },
          { key: "videoUrl", label: "视频地址", type: "image" },
        ],
      },
      {
        key: "case04",
        label: "案例 04",
        fields: [
          { key: "highlight", label: "主数据（如 3h）", type: "text" },
          { key: "platform", label: "平台", type: "text" },
          { key: "battery", label: "电池配置", type: "text" },
          { key: "highlightLabel", label: "主数据说明", type: "text" },
          { key: "videoUrl", label: "视频地址", type: "image" },
        ],
      },
      {
        key: "workflow",
        label: "工程流程",
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "subtitle", label: "副标题", type: "textarea" },
          { key: "stepsJson", label: "流程步骤（JSON 数组）", type: "json" },
          { key: "keywordsJson", label: "关键词（JSON 数组）", type: "json" },
        ],
      },
    ],
    defaultContent: {
      hero: { title: "", subtitle: "" },
      case01: { highlight: "", platform: "", battery: "", highlightLabel: "", videoUrl: "" },
      case02: { highlight: "", platform: "", battery: "", highlightLabel: "", videoUrl: "" },
      case03: { highlight: "", platform: "", battery: "", highlightLabel: "", videoUrl: "" },
      case04: { highlight: "", platform: "", battery: "", highlightLabel: "", videoUrl: "" },
      workflow: { title: "", subtitle: "", stepsJson: "[]", keywordsJson: "[]" },
    },
  },
  {
    key: "contact",
    label: "联系我们",
    labelZh: "联系我们",
    sections: [
      {
        key: "contact",
        label: "联系信息",
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "subtitle", label: "副标题", type: "textarea" },
          { key: "email", label: "邮箱", type: "text" },
          { key: "phone", label: "电话", type: "text" },
          { key: "address", label: "地址", type: "textarea" },
          { key: "studioTitle", label: "表单标题", type: "text" },
          { key: "studioDesc", label: "表单说明", type: "textarea" },
        ],
      },
    ],
    defaultContent: {
      contact: {
        title: "与深安锂能\n工程团队取得联系",
        subtitle: "",
        email: "changhao@ssebatt.com",
        phone: "+86 13651071130",
        address: "深圳市坪山区坑梓街道沙田社区坪山大道6352号2栋210",
        studioTitle: "",
        studioDesc: "",
      },
    },
  },
  {
    key: "news",
    label: "新闻中心",
    labelZh: "新闻中心",
    sections: [
      {
        key: "hero",
        label: "主视觉",
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "subtitle", label: "副标题", type: "textarea" },
        ],
      },
    ],
    defaultContent: {
      hero: { title: "", subtitle: "" },
    },
  },
];

export function getPageDef(page: string): CmsPageDef | undefined {
  return PAGE_DEFS.find((p) => p.key === page);
}

// 把扁平字段还原为嵌套 content（表单值 → content 结构）
export function flattenContent(content: Record<string, unknown>, sectionKey: string): Record<string, string> {
  const section = (content[sectionKey] ?? {}) as Record<string, unknown>;
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(section)) {
    flat[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return flat;
}

export function unflattenContent(
  flat: Record<string, string>,
  sectionKey: string,
  current: Record<string, unknown>,
): Record<string, unknown> {
  const section: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(flat)) {
    if (v === undefined || v === null || v === "") continue;
    // Try to parse JSON for json-type fields; but only if it looks like JSON
    if (v.trim().startsWith("[") || v.trim().startsWith("{")) {
      try {
        section[k] = JSON.parse(v);
        continue;
      } catch {
        // fall through to string
      }
    }
    section[k] = v;
  }
  return { ...current, [sectionKey]: section };
}
