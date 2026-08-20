# 全球业务网络动画 · 实施文档

> 深安锂能官网 · 关于我们页面
> 版本: v2.0 (统一 Timeline 架构)

---

## 目录

1. [架构概览](#1-架构概览)
2. [技术栈](#2-技术栈)
3. [统一 Timeline 设计](#3-统一-timeline-设计)
4. [数据结构](#4-数据结构)
5. [Camera 动画](#5-camera-动画)
6. [节点系统](#6-节点系统)
7. [飞线系统](#7-飞线系统)
8. [视觉规范](#8-视觉规范)
9. [性能优化](#9-性能优化)
10. [组件 API](#10-组件-api)
11. [文件结构](#11-文件结构)

---

## 1. 架构概览

### 设计原则

```
单一真相来源 (Single Source of Truth)
└── GSAP Timeline ─── globalProgress (0→1)
    ├── Camera 插值
    ├── 节点可见性
    └── 飞线可见性
```

### 动画阶段

| Phase | 时间范围 | globalProgress | 画面 |
|-------|----------|----------------|------|
| Phase 1 | 0–4s | 0.00–0.20 | 深圳总部特写 |
| Phase 2 | 4–9s | 0.20–0.45 | 中国业务网络展开 |
| Phase 3 | 9–16s | 0.45–0.80 | 全球业务辐射 |
| Loop | 16–20s | 0.80–1.00 | 淡出 → 重置 |

### 核心特性

- ✅ **统一 Timeline**: 所有动画由单一 GSAP Timeline 驱动
- ✅ **Camera 平滑过渡**: easeInOutCubic 缓动函数
- ✅ **节点呼吸效果**: ECharts rippleEffect
- ✅ **飞线动态效果**: 沿曲线的粒子流动
- ✅ **Page Visibility API**: 页面不可见时暂停
- ✅ **reduced-motion 支持**: 无障碍适配

---

## 2. 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| 地图引擎 | ECharts 5.4.3 | geo 坐标系 + effectScatter + lines |
| 动画引擎 | GSAP 3.x | Timeline 统一驱动 |
| 框架 | React 19 + Next.js 15 | 组件化 |
| 样式 | Tailwind CSS | 布局 + 响应式 |
| 地图数据 | ECharts world.js | 世界地图 geoJSON |

---

## 3. 统一 Timeline 设计

### 核心实现

```typescript
// useBusinessMapTimeline.ts
const tl = gsap.timeline({
  repeat: -1,
  paused: paused,
});

tl.to(stateRef.current, {
  progress: 1,           // 0→1 全局进度
  duration: totalDuration,
  ease: 'none',          // 线性，因为我们在内部做 easeInOutCubic
  onUpdate: function() {
    const progress = stateRef.current.progress;

    // Camera 插值
    const camera = interpolateKeyframes(progress, CAMERA_KEYFRAMES);

    // 节点可见性
    const visibleNodes = ALL_NODES
      .filter(n => progress >= (n.appearAt ?? 1))
      .map(n => n.id);

    // 飞线可见性
    const visibleRoutes = ALL_ROUTES
      .filter(r => progress >= (r.appearAt ?? 1))
      .map(r => r.id);

    // 更新状态
    stateRef.current.camera = camera;
    stateRef.current.visibleNodes = visibleNodes;
    stateRef.current.visibleRoutes = visibleRoutes;

    // 回调更新 ECharts
    onUpdate?.(stateRef.current);
  },
});
```

### 关键帧插值

```typescript
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function interpolateKeyframes(progress: number, keyframes: CameraKeyframe[]) {
  let start = keyframes[0];
  let end = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (progress >= keyframes[i].progress && progress <= keyframes[i + 1].progress) {
      start = keyframes[i];
      end = keyframes[i + 1];
      break;
    }
  }

  const range = end.progress - start.progress;
  const localProgress = range > 0 ? (progress - start.progress) / range : 0;
  const eased = easeInOutCubic(localProgress);

  return {
    center: [
      start.center[0] + (end.center[0] - start.center[0]) * eased,
      start.center[1] + (end.center[1] - start.center[1]) * eased,
    ],
    zoom: start.zoom + (end.zoom - start.zoom) * eased,
  };
}
```

---

## 4. 数据结构

### 节点类型

```typescript
interface MapNode {
  id: string;
  name: string;           // 中文名称
  nameEn?: string;        // 英文名称
  coordinates: [number, number]; // [lng, lat]
  type: 'hq' | 'business' | 'manufacturing' | 'international';
  domestic: boolean;      // true = 国内节点
  showLabel: boolean;     // 是否显示标签
  color: string;          // 节点颜色
  size: number;           // 节点大小
  appearAt?: number;      // globalProgress 到达此值时显示
  pulseOffset?: number;   // 扩散波相位偏移
}
```

### 飞线类型

```typescript
interface MapRoute {
  id: string;
  from: string;           // 起点节点 ID
  to: string;             // 终点节点 ID
  type: 'domestic' | 'manufacturing' | 'international';
  color: string;
  appearAt?: number;      // globalProgress 到达此值时显示
  curveness?: number;     // 曲线弯曲度 (0-1)
}
```

### Camera 关键帧

```typescript
interface CameraKeyframe {
  progress: number;       // 0-1
  center: [number, number]; // [lng, lat]
  zoom: number;
}
```

---

## 5. Camera 动画

### 关键帧定义

| progress | center | zoom | 阶段 |
|----------|--------|------|------|
| 0.00 | [114.06, 22.54] | 6.0 | 深圳特写 |
| 0.20 | [114.06, 22.54] | 6.0 | 停留 |
| 0.35 | [110, 30] | 3.5 | 缩小 |
| 0.45 | [106, 35] | 2.5 | 中国 |
| 0.50 | [106, 35] | 2.5 | 停留 |
| 0.65 | [106, 35] | 2.2 | 再缩小 |
| 0.70 | [50, 35] | 1.5 | 亚洲 |
| 0.80 | [15, 30] | 1.2 | 欧洲 |
| 0.90 | [15, 25] | 1.0 | 全球 |
| 1.00 | [15, 25] | 1.0 | 保持 |

### 缓动效果

使用 `easeInOutCubic` 实现平滑过渡：
- 加速启动
- 匀速中间
- 减速结束

---

## 6. 节点系统

### 节点配置

#### 国内节点

| ID | 名称 | 坐标 | 类型 | 颜色 | appearAt |
|----|------|------|------|------|----------|
| shenzhen | 深圳总部 | [114.06, 22.54] | hq | #38EF7D | 0.00 |
| guangzhou | 广州业务中心 | [113.26, 23.13] | business | #E2E8F0 | 0.20 |
| shanghai | 上海业务中心 | [121.47, 31.23] | business | #E2E8F0 | 0.30 |
| hangzhou | 杭州业务中心 | [120.16, 30.27] | business | #E2E8F0 | 0.40 |
| shaoxing | 绍兴生产基地 | [120.58, 30.05] | manufacturing | #F59E0B | 0.50 |
| beijing | 北京中心 | [116.41, 39.90] | business | #E2E8F0 | 0.60 |

#### 海外节点

| ID | 名称 | 坐标 | 类型 | 颜色 | appearAt |
|----|------|------|------|------|----------|
| germany | 德国 | [8.68, 50.11] | international | #A78BFA | 0.70 |
| netherlands | 荷兰 | [4.90, 52.37] | international | #A78BFA | 0.75 |
| poland | 波兰 | [21.01, 52.23] | international | #A78BFA | 0.80 |
| newyork | 纽约 | [-74.01, 40.71] | international | #A78BFA | 0.85 |
| kyiv | 基辅 | [30.52, 50.45] | international | #A78BFA | 0.90 |

### 节点视觉

```
深圳总部 (HQ)
├── 颜色: #38EF7D (荧光绿)
├── 大小: 12px
├── 标签: 显示
└── 效果: rippleEffect (呼吸扩散)

业务中心 (Business)
├── 颜色: #E2E8F0 (冷白)
├── 大小: 8px
├── 标签: 显示
└── 效果: rippleEffect

生产基地 (Manufacturing)
├── 颜色: #F59E0B (暖金)
├── 大小: 10px
├── 标签: 显示
└── 效果: rippleEffect

国际节点 (International)
├── 颜色: #A78BFA (紫)
├── 大小: 6px
├── 标签: 不显示
└── 效果: rippleEffect
```

### 标签显示规则

```typescript
// mapData.ts
label: {
  show: n.showLabel,
  position: 'right',
  formatter: n.domestic ? '{b}' : '',  // 海外节点不显示标签
  color: n.domestic ? n.color : 'transparent',
  fontSize: 11,
  fontWeight: 400,
  backgroundColor: 'rgba(5, 7, 11, 0.8)',
  padding: [4, 8],
  borderRadius: 4,
}
```

---

## 7. 飞线系统

### 飞线配置

#### 国内飞线

| ID | From | To | 类型 | 颜色 | curveness | appearAt |
|----|------|-----|------|------|-----------|----------|
| sz-gz | 深圳 | 广州 | domestic | #60A5FA | 0.15 | 0.25 |
| sz-sh | 深圳 | 上海 | domestic | #60A5FA | 0.20 | 0.35 |
| sz-hz | 深圳 | 杭州 | domestic | #60A5FA | 0.18 | 0.45 |
| hz-sx | 杭州 | 绍兴 | manufacturing | #F59E0B | 0.10 | 0.55 |
| sh-sx | 上海 | 绍兴 | manufacturing | #F59E0B | 0.12 | 0.58 |
| sz-bj | 深圳 | 北京 | domestic | #60A5FA | 0.25 | 0.65 |

#### 国际飞线

| ID | From | To | 类型 | 颜色 | curveness | appearAt |
|----|------|-----|------|------|-----------|----------|
| sz-de | 深圳 | 德国 | international | #A855F7 | 0.35 | 0.72 |
| sh-nl | 上海 | 荷兰 | international | #A855F7 | 0.40 | 0.77 |
| hz-pl | 杭州 | 波兰 | international | #A855F7 | 0.38 | 0.82 |
| sz-us | 深圳 | 纽约 | international | #A855F7 | 0.50 | 0.87 |
| sh-ua | 上海 | 基辅 | international | #A855F7 | 0.42 | 0.92 |

### 飞线视觉

```typescript
{
  name: 'flylines',
  type: 'lines',
  coordinateSystem: 'geo',
  z: 2,
  effect: {
    show: true,
    period: 4,          // 4秒完成一次流动
    trailLength: 0.15,  // 轨迹长度
    symbolSize: 4,      // 粒子大小
    color: '#ffffff',   // 粒子颜色
  },
  lineStyle: {
    width: 1.5,
    opacity: 0.6,
    curveness: 0.2,     // 曲线弯曲度
  },
}
```

---

## 8. 视觉规范

### 配色系统

| 用途 | 色值 | 说明 |
|------|------|------|
| 背景渐变 | #101923 → #060A0F → #030507 | 径向渐变 |
| 地图底色 | #0B1118 | 深色背景 |
| 地图边框 | #1C2A4A | 微光边框 |
| 深圳 HQ | #38EF7D | 荧光绿 |
| 业务中心 | #E2E8F0 | 冷白 |
| 绍兴基地 | #F59E0B | 暖金 |
| 国际节点 | #A78BFA | 紫色 |
| 国内飞线 | #60A5FA | 天蓝 |
| 制造业飞线 | #F59E0B | 暖金 |
| 国际飞线 | #A855F7 | 紫 |

### 设计风格

- 深蓝科技背景
- 克制发光效果
- 少量强调色点缀
- Apple/DJI/Porsche Design 风格
- 非赛博朋克 / 非廉价科技蓝

### 字体

使用官网统一字体：
- 中文: Noto Sans SC
- 英文: Plus Jakarta Sans

---

## 9. 性能优化

### 动画控制

```typescript
// Page Visibility API
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      pause();  // 页面不可见时暂停
    } else {
      play();   // 页面可见时继续
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [play, pause]);
```

### reduced-motion 支持

```typescript
// 检测用户偏好
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// 如开启，减少动画复杂度或使用静态展示
```

### 响应式策略

| 设备 | 策略 |
|------|------|
| Desktop | 全功能，60fps |
| Tablet | 减少粒子数量 |
| Mobile | 简化显示，30fps |

### ECharts 优化

```typescript
// 禁用 ECharts 内置动画（由 GSAP 控制）
chart.setOption({
  animation: false,
  // ...
});
```

---

## 10. 组件 API

### GlobalBusinessMap

```typescript
interface GlobalBusinessMapProps {
  locale?: 'zh' | 'en';  // 语言，默认 'zh'
  className?: string;     // 自定义类名
}

// 使用示例
<GlobalBusinessMap locale="zh" className="w-full h-[600px]" />
```

### useBusinessMapTimeline

```typescript
interface UseBusinessMapTimelineOptions {
  totalDuration?: number;  // 总时长，默认 20s
  onUpdate?: (state: TimelineState) => void;
  paused?: boolean;
}

interface TimelineState {
  progress: number;        // 0-1
  camera: {
    center: [number, number];
    zoom: number;
  };
  visibleNodes: string[];   // 可见节点 ID 列表
  visibleRoutes: string[];  // 可见飞线 ID 列表
}

interface ReturnValue {
  state: TimelineState;
  timeline: gsap.core.Timeline;
  play: () => void;
  pause: () => void;
  reset: () => void;
  seek: (progress: number) => void;
  dispose: () => void;
}
```

---

## 11. 文件结构

```
components/
└── about/
    └── GlobalBusinessMap/
        ├── GlobalBusinessMap.tsx      # 主组件
        ├── useBusinessMapTimeline.ts  # Timeline Hook
        ├── mapData.ts                 # 节点/飞线数据
        ├── index.ts                   # 导出入口
        └── BUSINESS_MAP_ARCHITECTURE.md  # 架构文档

public/
└── maps/
    └── business-map.html              # 独立 HTML 版本
```

---

## 更新日志

### v2.0 (2026-08-18)
- 重构为统一 GSAP Timeline 架构
- 移除独立 setTimeout/setInterval
- 所有动画由单一 `globalProgress` 驱动
- 新增 `easeInOutCubic` 缓动函数
- Camera 关键帧插值优化

### v1.0 (2026-08-16)
- 初始版本
- ECharts geo 坐标系
- 独立定时器控制各阶段
