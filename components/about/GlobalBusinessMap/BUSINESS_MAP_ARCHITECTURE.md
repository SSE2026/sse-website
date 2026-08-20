# 全球业务网络动画架构文档

## 1. 技术选型

### 核心依赖（已有）
- **GSAP 3.15+**: 统一 Timeline 控制器 ✅
- **ECharts 5.4+**: Geo 可视化 ✅
- **Framer Motion**: React 组件动画（可选）

### 不使用
- ❌ setInterval / setTimeout 多套独立定时器
- ❌ requestAnimationFrame 独立驱动
- ❌ 多层 Canvas 叠加导致不同步

## 2. 统一 Timeline 架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Master Timeline (GSAP)                    │
│                    Total: 20 seconds                         │
├─────────────────────────────────────────────────────────────┤
│  0s      4s      9s      16s     20s                      │
│  ├───────┼───────┼────────┼───────┤                       │
│  Phase 1 Phase 2 Phase 3   Loop                          │
│  Regional China  Global   Zoom Back                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
        ┌───────────────────────────────────────┐
        │           Timeline Progress             │
        │    0.0 ────────────────────── 1.0    │
        └───────────────────────────────────────┘
                              ↓
        ┌───────────────────────────────────────┐
        │         Interpolated Values            │
        │  • camera.center [lng, lat]          │
        │  • camera.zoom                       │
        │  • nodes[].visible                   │
        │  • nodes[].pulsePhase               │
        │  • routes[].opacity                  │
        │  • routes[].particleProgress        │
        └───────────────────────────────────────┘
                              ↓
        ┌───────────────────────────────────────┐
        │           ECharts Option              │
        │  • geo.center                        │
        │  • geo.zoom                          │
        │  • series[].data                    │
        │  • series[].effect.show              │
        └───────────────────────────────────────┘
```

## 3. 动画阶段

| 阶段 | 时间 | Camera | 节点 | 飞线 |
|------|------|--------|------|------|
| Phase 1 | 0-4s | Regional [114, 22] zoom:6 | 深圳 | 无 |
| Phase 2 | 4-9s | China [106, 35] zoom:2.2 | 顺序出现国内节点 | 顺序出现国内飞线 |
| Phase 3 | 9-16s | Global [15, 25] zoom:1.15 | 全球节点 | 全球飞线 |
| Loop | 16-20s | Zoom back | 保持 | 淡出 |

## 4. 数据结构

### 节点
```typescript
interface MapNode {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  type: 'hq' | 'business' | 'manufacturing' | 'international';
  domestic: boolean;
  showLabel: boolean;
  color: string;
  size: number;
}
```

### 飞线
```typescript
interface MapRoute {
  id: string;
  from: string; // node id
  to: string;   // node id
  type: 'domestic' | 'manufacturing' | 'international';
  color: string;
}
```

## 5. 视觉规范

### 颜色系统
```css
--bg-primary: #05070B;      /* 深蓝黑背景 */
--bg-gradient: radial-gradient(#101923 0%, #060A0F 55%, #030507 100%);
--map-fill: #0B1118;        /* 地图深灰蓝 */
--map-border: #1C2A4A;      /* 地图边界 */
--node-hq: #38EF7D;         /* 深圳总部 - 荧光绿 */
--node-business: #E2E8F0;    /* 业务节点 - 冷白 */
--node-manufacturing: #F59E0B; /* 绍兴基地 - 暖金 */
--node-international: #A78BFA; /* 海外节点 - 淡紫 */
--flyline-domestic: #60A5FA; /* 国内飞线 - 冷蓝 */
--flyline-intl: #A855F7;    /* 国际飞线 - 紫色 */
```

### 节点大小
- 深圳总部: 12px
- 绍兴基地: 10px
- 其他国内: 8px
- 海外: 6px

### 字体
- 标签: 12px, font-weight: 400, 冷白

## 6. 性能优化

- [x] 统一 GSAP Timeline，避免多套定时器
- [x] ECharts 批量 setOption，减少重绘
- [x] 页面不可见时暂停动画 (Page Visibility API)
- [x] prefers-reduced-motion 支持
- [x] 移动端减少粒子数量

## 7. 文件结构

```
components/
└── about/
    └── GlobalBusinessMap/
        ├── GlobalBusinessMap.tsx      # 主组件
        ├── useBusinessMapTimeline.ts  # GSAP Timeline Hook
        ├── mapData.ts                 # 节点/飞线数据
        └── BUSINESS_MAP_ARCHITECTURE.md
```

## 8. 如何修改

### 修改节点
编辑 `mapData.ts` 中的 `NODES` 数组。

### 修改动画速度
修改 GSAP Timeline 的 `duration` 参数。

### 修改颜色
修改 CSS variables 或 `mapData.ts` 中的 `color` 字段。
