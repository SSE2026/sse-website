// 产品中心数据 — 云驰系列 (AeroRide)
//
// 三个子系列各自独立成页,路由见 seriesProfiles[x].slug。
// 同一系列内,标准电压 / 充放电区间 / 倍率档位 / 循环寿命 是共用的,
// 因此写在 profile.common 里,各型号只填自己变化的几项,避免逐条重复。

export type SeriesId = "360p" | "400e" | "460x";

export interface ProductSpec {
  /** 外形尺寸 (mm) */
  dimensions: string;
  /** 额定容量 (Ah) */
  capacity: string;
  /** 充放电区间 (V) */
  voltageRange: string;
  /** 标称电压 (V) */
  voltage: string;
  /** 重量 (g) */
  weight: string;
  /** 最大持续充/放电倍率 —— 360-P / 400-E 为 "充电/放电",460-X 仅放电 */
  chargeRate?: string;
  dischargeRate?: string;
  /** 最大持续放电倍率 (460-X) */
  continuous?: string;
  /** 瞬时放电倍率 (460-X) */
  peak?: string;
  /** 循环寿命 */
  cycleLife: { zh: string; en: string };
  /** 安全性 */
  safety?: { zh: string; en: string };
}

export interface Product {
  id: string;
  /** 型号 */
  sku: string;
  name: string;
  series: SeriesId;
  /** 质量能量密度 (Wh/kg) */
  energyDensity: string;
  energyDensityValue: number;
  image: string;
  spec: ProductSpec;
  seriesLabel: { zh: string; en: string };
  seriesSubtitle: { zh: string; en: string };
  /** 主力出货规格 —— 按型号末 5 位判定,见 BESTSELLER_SUFFIXES */
  bestseller: boolean;
}

/**
 * 热销规格的型号后缀。
 *
 * 型号本身编码了尺寸(如 SSE10588187 = 10.5 × 88 × 187),所以末 5 位就是
 * 「截面 × 高度」: 88187 = 88×187,70170 = 70×170 —— 这两种是主力出货形态。
 * 命中即打「爆品」标。
 */
const BESTSELLER_SUFFIXES = ["88187", "70170"];

function isBestseller(sku: string): boolean {
  return BESTSELLER_SUFFIXES.some((suffix) => sku.endsWith(suffix));
}

/** 各型号中随尺寸变化的几项 */
interface ModelRow {
  sku: string;
  dimensions: string;
  capacity: string;
  weight: string;
  energyDensity: number;
  /** 覆盖系列共用值(个别型号倍率档位不同时填写) */
  chargeRate?: string;
  dischargeRate?: string;
  continuous?: string;
  peak?: string;
}

interface SeriesProfile {
  id: SeriesId;
  slug: string;
  color: string;
  bgColor: string;
  label: { zh: string; en: string };
  subtitle: { zh: string; en: string };
  /** 产品卡片缩略图 */
  image: string;
  /** 详情页 Hero 大图(透明底产品图) */
  heroImage: string;
  /** 全系列共用参数 */
  common: {
    voltageRange: string;
    voltage: string;
    cycleLife: { zh: string; en: string };
    safety?: { zh: string; en: string };
    chargeRate?: string;
    dischargeRate?: string;
    continuous?: string;
    peak?: string;
  };
  hero: {
    eyebrow: { zh: string; en: string };
    title: { zh: string; en: string };
    description: { zh: string; en: string };
  };
  models: ModelRow[];
}

export const seriesProfiles: Record<SeriesId, SeriesProfile> = {
  "360p": {
    id: "360p",
    slug: "cloudchi-360-p",
    color: "#2563eb",
    bgColor: "#eff6ff",
    label: { zh: "云驰 360-P 功率型", en: "AeroRide 360-P Power" },
    subtitle: { zh: "高能量 + 高功率型电芯", en: "High Energy + High Power Cell" },
    image: "/images/360-p.png",
    heroImage: "/images/hero/hero-360-p.png",
    common: {
      voltageRange: "2.5 ~ 4.3",
      voltage: "3.5",
      chargeRate: "2C",
      dischargeRate: "5C",
      cycleLife: { zh: "1000 (0.5C 充 / 1C 放)", en: "1000 (0.5C charge / 1C discharge)" },
    },
    hero: {
      eyebrow: { zh: "云驰系列 · 高功率型", en: "AeroRide Series · High Power" },
      title: { zh: "云驰 360-P 功率型", en: "AeroRide 360-P Power" },
      description: {
        zh: "高比能与高功率输出兼顾,2C 快充 / 5C 持续放电,面向低空飞行器的起飞、爬升与机动工况。",
        en: "High specific energy with high power output. 2C fast charge and 5C continuous discharge for take-off, climb and manoeuvre duty in low-altitude aircraft.",
      },
    },
    models: [
      { sku: "SSE10570163", dimensions: "10.5 × 70 × 163", capacity: "25", weight: "244", energyDensity: 358 },
      { sku: "SSE12070170", dimensions: "12 × 70 × 170", capacity: "28", weight: "278", energyDensity: 352 },
      { sku: "SSE10588187", dimensions: "10.5 × 88 × 187", capacity: "36", weight: "357", energyDensity: 353 },
      { sku: "SSE12288187", dimensions: "12.2 × 88 × 187", capacity: "43", weight: "423", energyDensity: 356 },
      { sku: "SSE100143154", dimensions: "10.0 × 143 × 154", capacity: "44", weight: "433", energyDensity: 356 },
    ],
  },

  "400e": {
    id: "400e",
    slug: "cloudchi-400-e",
    color: "#059669",
    bgColor: "#ecfdf5",
    label: { zh: "云驰 400-E 能量型", en: "AeroRide 400-E Energy" },
    subtitle: { zh: "高能量 + 长循环型电芯", en: "High Energy + Long Cycle Cell" },
    image: "/images/400-E.png",
    heroImage: "/images/hero/hero-400-e.png",
    common: {
      voltageRange: "2.5 ~ 4.3",
      voltage: "3.5",
      chargeRate: "1C",
      dischargeRate: "3C",
      cycleLife: { zh: "500 (0.5C 充 / 0.5C 放)", en: "500 (0.5C charge / 0.5C discharge)" },
      safety: { zh: "满足 GB38031-2020", en: "Meets GB38031-2020" },
    },
    hero: {
      eyebrow: { zh: "云驰系列 · 长循环型", en: "AeroRide Series · Long Cycle" },
      title: { zh: "云驰 400-E 能量型", en: "AeroRide 400-E Energy" },
      description: {
        zh: "面向具身智能与深海装备的长时作业工况,在 360-391 Wh/kg 的高比能下兼顾循环稳定性,并通过 GB38031-2020 安全验证。",
        en: "Built for long-duration duty in embodied AI and deep-sea equipment: 360-391 Wh/kg specific energy with cycle stability, verified to GB38031-2020.",
      },
    },
    models: [
      { sku: "SSE855897", dimensions: "8.5 × 58 × 97", capacity: "10", weight: "95", energyDensity: 368 },
      { sku: "SSE6570140", dimensions: "6.5 × 70 × 140", capacity: "12.5", weight: "122", energyDensity: 360 },
      { sku: "SSE12070170", dimensions: "12 × 70 × 170", capacity: "30", weight: "273", energyDensity: 385 },
      { sku: "SSE8588187", dimensions: "9.5 × 88 × 187", capacity: "36", weight: "323", energyDensity: 390, chargeRate: "1C", dischargeRate: "2C" },
      { sku: "SSE10588187", dimensions: "10.5 × 88 × 187", capacity: "41", weight: "367", energyDensity: 391, chargeRate: "1C", dischargeRate: "2C" },
    ],
  },

  "460x": {
    id: "460x",
    slug: "cloudchi-460-x",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    label: { zh: "云驰 460-X 超高能量型", en: "AeroRide 460-X Ultra-High Energy" },
    subtitle: { zh: "超高能量 + 超高倍率型电芯", en: "Ultra High Energy + High Rate Cell" },
    image: "/images/400-X.png",
    heroImage: "/images/hero/hero-460-x.png",
    common: {
      voltageRange: "3.0 ~ 4.4",
      voltage: "3.87",
      continuous: "10C",
      peak: "12C",
      cycleLife: { zh: "20 (0.2C 充 / 8C 放)", en: "20 (0.2C charge / 8C discharge)" },
    },
    hero: {
      eyebrow: { zh: "云驰系列 · 超高倍率型", en: "AeroRide Series · Ultra High Rate" },
      title: { zh: "云驰 460-X 超高能量型", en: "AeroRide 460-X Ultra-High Energy" },
      description: {
        zh: "3.87 V 高电压体系带来 453-460 Wh/kg 的超高比能,同时支持 10C 持续 / 12C 瞬时放电,为高机动平台提供瞬时功率。",
        en: "A 3.87 V high-voltage chemistry reaching 453-460 Wh/kg while sustaining 10C continuous and 12C peak discharge for high-manoeuvrability platforms.",
      },
    },
    models: [
      { sku: "SSE5556100", dimensions: "5.5 × 56 × 100", capacity: "11.5", weight: "100", energyDensity: 453 },
      { sku: "SSE7560125", dimensions: "7.5 × 60 × 125", capacity: "16", weight: "135", energyDensity: 455 },
      { sku: "SSE5070170", dimensions: "5.0 × 70 × 170", capacity: "18", weight: "153", energyDensity: 455 },
      { sku: "SSE7070170", dimensions: "7.0 × 70 × 170", capacity: "25", weight: "211", energyDensity: 458, continuous: "8C", peak: "10C" },
      { sku: "SSE8088187", dimensions: "8.0 × 88 × 187", capacity: "39", weight: "332", energyDensity: 460, continuous: "8C", peak: "10C" },
    ],
  },
};

/** 系列展示顺序 */
export const SERIES_ORDER: SeriesId[] = ["360p", "400e", "460x"];

/** 把 profile + models 展开成扁平的 Product 列表 */
function buildProducts(): Product[] {
  return SERIES_ORDER.flatMap((seriesId) => {
    const profile = seriesProfiles[seriesId];
    return profile.models.map<Product>((row) => ({
      id: row.sku.toLowerCase(),
      sku: row.sku,
      name: row.sku,
      series: seriesId,
      energyDensity: `${row.energyDensity} Wh/kg`,
      energyDensityValue: row.energyDensity,
      image: profile.image,
      spec: {
        dimensions: `${row.dimensions} mm`,
        capacity: `${row.capacity} Ah`,
        voltageRange: profile.common.voltageRange,
        voltage: `${profile.common.voltage} V`,
        weight: `${row.weight} g`,
        chargeRate: row.chargeRate ?? profile.common.chargeRate,
        dischargeRate: row.dischargeRate ?? profile.common.dischargeRate,
        continuous: row.continuous ?? profile.common.continuous,
        peak: row.peak ?? profile.common.peak,
        cycleLife: profile.common.cycleLife,
        safety: profile.common.safety,
      },
      seriesLabel: profile.label,
      seriesSubtitle: profile.subtitle,
      bestseller: isBestseller(row.sku),
    }));
  });
}

export const products: Product[] = buildProducts();

/** 按系列分组 */
export function getProductsBySeries(series: SeriesId): Product[] {
  return products.filter((p) => p.series === series);
}

/** 按型号查询 */
export function getProductBySku(sku: string): Product | undefined {
  return products.find((p) => p.sku === sku);
}

/** 由路由 slug 反查所属系列 */
export function getSeriesBySlug(slug: string): SeriesProfile | undefined {
  return SERIES_ORDER.map((id) => seriesProfiles[id]).find((p) => p.slug === slug);
}
