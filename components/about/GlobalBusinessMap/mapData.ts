// 全球业务网络地图数据

export interface MapNode {
  id: string;
  name: string;
  nameEn?: string;
  role?: string;
  roleEn?: string;
  coordinates: [number, number]; // [lng, lat]
  type: 'hq' | 'business' | 'manufacturing' | 'international';
  domestic: boolean;
  showLabel: boolean;
  color: string;
  glowColor?: string;
  description?: string;
  descriptionEn?: string;
  keywords?: string[];
  keywordsEn?: string[];
  size: number;
  // 动画参数
  appearAt?: number; // timeline progress 0-1 时出现
  pulseOffset?: number; // 扩散波相位偏移
}

export interface MapRoute {
  id: string;
  from: string; // node id
  to: string;   // node id
  type: 'domestic' | 'manufacturing' | 'international';
  color: string;
  appearAt?: number;
  curveness?: number;
}

// 颜色语义系统
// HQ: #38EF7D (绿色 - 核心/总部)
// Business: #8F9BAF (灰蓝色 - 业务中心)
// Manufacturing: #F59E0B (橙色 - 制造基地)
// International: #7DB7FF (冰蓝色 - 全球辐射)

export const COLORS = {
  hq: '#38EF7D',
  business: '#8F9BAF',
  manufacturing: '#F59E0B',
  international: '#7DB7FF',
  primary: '#2563EB',
  primaryLight: '#60A5FA',
  secondary: '#8B5CF6',
  ocean: '#0A1628',
  land: '#1E293B',
  landStroke: '#334155',
  textPrimary: '#F5F5F5',
  textSecondary: '#8A8A8A',
  textMuted: '#6B7280',
};

export const ANIMATION_CONFIG = {
  phases: {
    intro: { start: 0, end: 1.5 },
    nodes: { start: 1.5, end: 3 },
    hq_connections: { start: 3, end: 4.5 },
    china_reach: { start: 4.5, end: 6 },
    global_reach: { start: 6, end: 8 },
    complete: { start: 8, end: 10 },
  },
  nodeAppear: 1.5,
  hqConnections: 1.5,
  radiation: 1.5,
  globalReach: 2,
  totalDuration: 8,
};

export function getNodeSize(type: MapNode['type']): { size: number; glow: number; pulse: number; core: number } {
  switch (type) {
    case 'hq':
      return { size: 12, glow: 24, pulse: 36, core: 12 };
    case 'business':
      return { size: 8, glow: 16, pulse: 24, core: 8 };
    case 'manufacturing':
      return { size: 10, glow: 20, pulse: 30, core: 10 };
    case 'international':
      return { size: 6, glow: 12, pulse: 18, core: 6 };
    default:
      return { size: 8, glow: 16, pulse: 24, core: 8 };
  }
}

// 国内节点
// 时间表：深圳(0) → 广州/上海/杭州(0.2) → 绍兴(0.3) → 北京(0.4) → 国际(0.5-0.65)
export const DOMESTIC_NODES: MapNode[] = [
  {
    id: 'shenzhen',
    name: '深圳总部',
    nameEn: 'Shenzhen HQ',
    coordinates: [114.0579, 22.5431],
    type: 'hq',
    domestic: true,
    showLabel: true,
    color: '#38EF7D', // 绿色 - 总部
    size: 12,
    appearAt: 0,
    pulseOffset: 0,
  },
  {
    id: 'guangzhou',
    name: '广州业务中心',
    nameEn: 'Guangzhou',
    coordinates: [113.2644, 23.1291],
    type: 'business',
    domestic: true,
    showLabel: true,
    color: '#8F9BAF', // 灰蓝色 - 业务中心
    size: 8,
    appearAt: 0.18,  // 与飞线同时
    pulseOffset: 0.25,
  },
  {
    id: 'shanghai',
    name: '上海业务中心',
    nameEn: 'Shanghai',
    coordinates: [121.4737, 31.2304],
    type: 'business',
    domestic: true,
    showLabel: true,
    color: '#8F9BAF', // 灰蓝色 - 业务中心
    size: 8,
    appearAt: 0.18,  // 与飞线同时
    pulseOffset: 0.5,
  },
  {
    id: 'hangzhou',
    name: '杭州业务中心',
    nameEn: 'Hangzhou',
    coordinates: [120.1551, 30.2741],
    type: 'business',
    domestic: true,
    showLabel: true,
    color: '#8F9BAF', // 灰蓝色 - 业务中心
    size: 8,
    appearAt: 0.18,  // 与飞线同时
    pulseOffset: 0.8,
  },
  {
    id: 'shaoxing',
    name: '绍兴生产基地',
    nameEn: 'Shaoxing Base',
    coordinates: [120.5821, 30.0515],
    type: 'manufacturing',
    domestic: true,
    showLabel: true,
    color: '#F59E0B', // 橙色 - 制造基地
    size: 10,
    appearAt: 0.3,  // 业务中心之后
    pulseOffset: 0.2,
  },
  {
    id: 'beijing',
    name: '北京中心',
    nameEn: 'Beijing',
    coordinates: [116.4074, 39.9042],
    type: 'business',
    domestic: true,
    showLabel: true,
    color: '#8F9BAF', // 灰蓝色 - 业务中心
    size: 8,
    appearAt: 0.4,  // 绍兴之后
    pulseOffset: 1.0,
  },
];

// 海外节点 - 日韩先出现，欧美后出现
export const INTERNATIONAL_NODES: MapNode[] = [
  {
    id: 'korea',
    name: '韩国',
    coordinates: [126.9780, 37.5665],
    type: 'international',
    domestic: false,
    showLabel: false,
    color: '#7DB7FF', // 冰蓝色
    size: 8,
    appearAt: 0.55,
    pulseOffset: 0.1,
  },
  {
    id: 'japan',
    name: '日本',
    coordinates: [139.6917, 35.6895],
    type: 'international',
    domestic: false,
    showLabel: false,
    color: '#7DB7FF', // 冰蓝色
    size: 8,
    appearAt: 0.55,
    pulseOffset: 0.2,
  },
  {
    id: 'germany',
    name: '德国',
    coordinates: [8.6821, 50.1109],
    type: 'international',
    domestic: false,
    showLabel: false,
    color: '#7DB7FF', // 冰蓝色
    size: 8,
    appearAt: 0.65,  // 欧美后出现
    pulseOffset: 0.4,
  },
  {
    id: 'poland',
    name: '波兰',
    coordinates: [21.0122, 52.2297],
    type: 'international',
    domestic: false,
    showLabel: false,
    color: '#7DB7FF', // 冰蓝色
    size: 8,
    appearAt: 0.65,  // 欧美后出现
    pulseOffset: 0.5,
  },
  {
    id: 'newyork',
    name: '纽约',
    coordinates: [-74.006, 40.7128],
    type: 'international',
    domestic: false,
    showLabel: false,
    color: '#7DB7FF', // 冰蓝色
    size: 8,
    appearAt: 0.65,  // 欧美后出现
    pulseOffset: 0.6,
  },
  {
    id: 'kyiv',
    name: '基辅',
    coordinates: [30.5234, 50.4501],
    type: 'international',
    domestic: false,
    showLabel: false,
    color: '#7DB7FF', // 冰蓝色
    size: 8,
    appearAt: 0.65,  // 欧美后出现
    pulseOffset: 0.7,
  },
];

// 国内飞线 - 同时发射：深圳→上海/杭州/广州，然后绍兴，然后北京
export const DOMESTIC_ROUTES: MapRoute[] = [
  { id: 'sz-sh', from: 'shenzhen', to: 'shanghai', type: 'domestic', color: '#8F9BAF', appearAt: 0.18, curveness: 0.2 },
  { id: 'sz-hz', from: 'shenzhen', to: 'hangzhou', type: 'domestic', color: '#8F9BAF', appearAt: 0.18, curveness: 0.18 },
  { id: 'sz-gz', from: 'shenzhen', to: 'guangzhou', type: 'domestic', color: '#8F9BAF', appearAt: 0.18, curveness: 0.15 },
  { id: 'sz-sx', from: 'shenzhen', to: 'shaoxing', type: 'manufacturing', color: '#F59E0B', appearAt: 0.32, curveness: 0.15 },
  { id: 'sz-bj', from: 'shenzhen', to: 'beijing', type: 'domestic', color: '#8F9BAF', appearAt: 0.42, curveness: 0.25 },
];

// 国际飞线 - 日韩先发，欧美后发
export const INTERNATIONAL_ROUTES: MapRoute[] = [
  { id: 'sz-kr', from: 'shenzhen', to: 'korea', type: 'international', color: '#7DB7FF', appearAt: 0.55, curveness: 0.35 },
  { id: 'sh-jp', from: 'shanghai', to: 'japan', type: 'international', color: '#7DB7FF', appearAt: 0.55, curveness: 0.4 },
  { id: 'sz-de', from: 'shenzhen', to: 'germany', type: 'international', color: '#7DB7FF', appearAt: 0.65, curveness: 0.42 },
  { id: 'hz-pl', from: 'hangzhou', to: 'poland', type: 'international', color: '#7DB7FF', appearAt: 0.65, curveness: 0.4 },
  { id: 'sz-us', from: 'shenzhen', to: 'newyork', type: 'international', color: '#7DB7FF', appearAt: 0.65, curveness: 0.5 },
  { id: 'sh-ua', from: 'shanghai', to: 'kyiv', type: 'international', color: '#7DB7FF', appearAt: 0.65, curveness: 0.45 },
];

export const ALL_NODES = [...DOMESTIC_NODES, ...INTERNATIONAL_NODES];

export const ALL_ROUTES = [...DOMESTIC_ROUTES, ...INTERNATIONAL_ROUTES];

// Camera 关键帧 - 配合节点时间
// 深圳(0) → 广州/上海/杭州(0.2) → 绍兴(0.3) → 北京(0.4) → 国际(0.5-0.65)
export const CAMERA_KEYFRAMES = [
  { progress: 0, center: [114.05, 22.54] as [number, number], zoom: 15 },    // 深圳特写
  { progress: 0.1, center: [115, 27] as [number, number], zoom: 12 },       // 广州/上海/杭州辐射 - 更大缩放
  { progress: 0.25, center: [115, 27] as [number, number], zoom: 10 },       // 绍兴辐射
  { progress: 0.4, center: [115, 30] as [number, number], zoom: 6 },         // 北京
  { progress: 0.5, center: [80, 35] as [number, number], zoom: 4 },         // 国际开始
  { progress: 0.65, center: [40, 30] as [number, number], zoom: 2 },        // 全球视图
  { progress: 1.0, center: [40, 30] as [number, number], zoom: 2 },          // 保持
];

// 工具函数：根据 progress 插值
export function interpolateKeyframes(progress: number, keyframes: typeof CAMERA_KEYFRAMES) {
  // 找到当前所在的两个关键帧
  let startFrame = keyframes[0];
  let endFrame = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (progress >= keyframes[i].progress && progress <= keyframes[i + 1].progress) {
      startFrame = keyframes[i];
      endFrame = keyframes[i + 1];
      break;
    }
  }

  // 计算局部 progress
  const range = endFrame.progress - startFrame.progress;
  const localProgress = range > 0 ? (progress - startFrame.progress) / range : 0;

  // 使用 easeInOutCubic
  const eased = easeInOutCubic(localProgress);

  // 插值
  return {
    center: [
      startFrame.center[0] + (endFrame.center[0] - startFrame.center[0]) * eased,
      startFrame.center[1] + (endFrame.center[1] - startFrame.center[1]) * eased,
    ] as [number, number],
    zoom: startFrame.zoom + (endFrame.zoom - startFrame.zoom) * eased,
  };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// 根据节点 ID 获取节点
export function getNodeById(id: string): MapNode | undefined {
  return ALL_NODES.find(n => n.id === id);
}

// 根据节点 ID 获取坐标
export function getNodeCoords(id: string): [number, number] | undefined {
  const node = getNodeById(id);
  return node?.coordinates;
}

// 构建飞线数据
export function buildRouteCoords(route: MapRoute): [number, number][] | undefined {
  const fromCoords = getNodeCoords(route.from);
  const toCoords = getNodeCoords(route.to);
  if (!fromCoords || !toCoords) return undefined;
  return [fromCoords, toCoords];
}
