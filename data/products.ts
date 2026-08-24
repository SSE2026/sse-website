// 产品中心数据 - 云驰系列
// 修改这里的参数即可同步更新前端页面

export interface ProductSpec {
  // 基础参数
  voltage: string;        // 标称电压
  capacity: string;        // 额定容量
  dimensions: string;      // 外形尺寸
  weight: string;          // 参考重量
  // 倍率（统一字段，前端按需展示）
  continuous?: string;     // 持续放电 (460-X 系列)
  peak?: string;           // 峰值放电 (460-X 系列)
  chargeRate?: string;     // 充电倍率
  dischargeRate?: string;  // 放电倍率
  cycleLife?: string;      // 循环寿命
}

export interface Product {
  id: string;                          // 唯一标识
  sku: string;                         // 型号
  name: string;                        // 产品名称
  series: "360p" | "400e" | "460x";   // 所属系列
  energyDensity: string;               // 能量密度
  energyDensityValue: number;          // 能量密度数值（用于徽章颜色）
  image: string;                       // 产品图片路径
  spec: ProductSpec;
  // 系列标签
  seriesLabel: {
    zh: string;
    en: string;
  };
  seriesSubtitle: {
    zh: string;
    en: string;
  };
}

export const productSeries = {
  "360p": {
    color: "#2563EB",
    bgColor: "#eff6ff",
    title: { zh: "云驰 360-P 系列", en: "Aeroride 360-P Series" },
    subtitle: {
      zh: "高能量 + 高功率型电芯",
      en: "High Energy + High Power Cell",
    },
  },
  "400e": {
    color: "#059669",
    bgColor: "#ecfdf5",
    title: { zh: "云驰 400-E 系列", en: "Aeroride 400-E Series" },
    subtitle: {
      zh: "高能量 + 长循环型电芯",
      en: "High Energy + Long Cycle Cell",
    },
  },
  "460x": {
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    title: { zh: "云驰 460-X 系列", en: "Aeroride 460-X Series" },
    subtitle: {
      zh: "超高能量 + 超高倍率型电芯",
      en: "Ultra High Energy + High Rate Cell",
    },
  },
} as const;

export const products: Product[] = [
  // ===== 360-P 系列 =====
  {
    id: "sse10570163",
    sku: "SSE10570163",
    name: "SSE10570163",
    series: "360p",
    energyDensity: "358 Wh/kg",
    energyDensityValue: 358,
    image: "/images/360-p.png",
    spec: {
      voltage: "3.5 V",
      capacity: "25 Ah",
      dimensions: "10.5×70×163 mm",
      weight: "244 g",
      chargeRate: "2C",
      dischargeRate: "5C",
      cycleLife: "1000+ (0.5C/1C)",
    },
    seriesLabel: { zh: "云驰 360-P 系列", en: "Aeroride 360-P Series" },
    seriesSubtitle: { zh: "高能量 + 高功率型电芯", en: "High Energy + High Power Cell" },
  },
  {
    id: "sse10014315",
    sku: "SSE10014315",
    name: "SSE10014315",
    series: "360p",
    energyDensity: "356 Wh/kg",
    energyDensityValue: 356,
    image: "/images/360-p.png",
    spec: {
      voltage: "3.5 V",
      capacity: "44 Ah",
      dimensions: "10.0×143×154 mm",
      weight: "433 g",
      chargeRate: "2C",
      dischargeRate: "5C",
      cycleLife: "1000+ (0.5C/1C)",
    },
    seriesLabel: { zh: "云驰 360-P 系列", en: "Aeroride 360-P Series" },
    seriesSubtitle: { zh: "高能量 + 高功率型电芯", en: "High Energy + High Power Cell" },
  },
  // ===== 400-E 系列 =====
  {
    id: "sse10588187",
    sku: "SSE10588187",
    name: "SSE10588187",
    series: "400e",
    energyDensity: "391 Wh/kg",
    energyDensityValue: 391,
    image: "/images/400-E.png",
    spec: {
      voltage: "3.5 V",
      capacity: "41 Ah",
      dimensions: "10.5×88×187 mm",
      weight: "367 g",
      chargeRate: "1C",
      dischargeRate: "3C",
    },
    seriesLabel: { zh: "云驰 400-E 系列", en: "Aeroride 400-E Series" },
    seriesSubtitle: { zh: "高能量 + 长循环型电芯", en: "High Energy + Long Cycle Cell" },
  },
  {
    id: "sse855897",
    sku: "SSE855897",
    name: "SSE855897",
    series: "400e",
    energyDensity: "368 Wh/kg",
    energyDensityValue: 368,
    image: "/images/400-E.png",
    spec: {
      voltage: "3.7 V",
      capacity: "25 Ah",
      dimensions: "8.5×58×97 mm",
      weight: "95 g",
      chargeRate: "1C",
      dischargeRate: "3C",
    },
    seriesLabel: { zh: "云驰 400-E 系列", en: "Aeroride 400-E Series" },
    seriesSubtitle: { zh: "高能量 + 长循环型电芯", en: "High Energy + Long Cycle Cell" },
  },
  // ===== 460-X 系列 =====
  {
    id: "sse8088187",
    sku: "SSE8088187",
    name: "SSE8088187",
    series: "460x",
    energyDensity: "460+ Wh/kg",
    energyDensityValue: 460,
    image: "/images/400-X.png",
    spec: {
      voltage: "3.8 V",
      capacity: "39 Ah",
      dimensions: "8.0×88×187 mm",
      weight: "332 g",
      continuous: "8C",
      peak: "10C",
    },
    seriesLabel: { zh: "云驰 460-X 系列", en: "Aeroride 460-X Series" },
    seriesSubtitle: { zh: "超高能量 + 超高倍率型电芯", en: "Ultra High Energy + High Rate Cell" },
  },
  {
    id: "sse5556100",
    sku: "SSE5556100",
    name: "SSE5556100",
    series: "460x",
    energyDensity: "453 Wh/kg",
    energyDensityValue: 453,
    image: "/images/400-X.png",
    spec: {
      voltage: "3.8 V",
      capacity: "11.5 Ah",
      dimensions: "5.5×56×100 mm",
      weight: "100 g",
      continuous: "10C",
      peak: "12C",
    },
    seriesLabel: { zh: "云驰 460-X 系列", en: "Aeroride 460-X Series" },
    seriesSubtitle: { zh: "超高能量 + 超高倍率型电芯", en: "Ultra High Energy + High Rate Cell" },
  },
];

// 按系列分组
export function getProductsBySeries(series: "360p" | "400e" | "460x"): Product[] {
  return products.filter((p) => p.series === series);
}

// 按 SKU 查询
export function getProductBySku(sku: string): Product | undefined {
  return products.find((p) => p.sku === sku);
}
