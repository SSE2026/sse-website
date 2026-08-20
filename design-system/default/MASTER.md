# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** 深安锂能国际站 (Shenan Lithium International)
**Generated:** 2026-08-12
**Category:** B2B Industrial / Clean Energy / Battery Technology
**Design Reference:** Tesla + DJI — Premium Industrial

---

## Design Vision

### Brand Essence
- **Innovation meets Industrial Reliability** — 航空航天级品质 + 前沿技术创新
- **Silent Power** — 传达能源的沉稳、可靠、强大
- **Technical Precision** — 工程级严谨，不妥协的品质感

### Visual Identity
- Tesla式极简 + DJI式专业航空感
- 大量留白，大胆排版
- 技术感与高端感并存
- 深色/浅色双模式支持

---

## Color Palette

### Light Mode (Primary)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Primary** | `#0A0A0A` | `--color-primary` | 主标题、CTA按钮背景 |
| **On Primary** | `#FFFFFF` | `--color-on-primary` | 按钮上的文字 |
| **Secondary** | `#52525B` | `--color-secondary` | 次要文本、图标 |
| **Tertiary** | `#A1A1AA` | `--color-tertiary` | 占位符、禁用状态 |
| **Accent** | `#2563EB` | `--color-accent` | 链接、强调元素（Tesla蓝） |
| **Accent Hover** | `#1D4ED8` | `--color-accent-hover` | 悬停状态 |
| **Background** | `#FAFAFA` | `--color-background` | 页面背景 |
| **Surface** | `#FFFFFF` | `--color-surface` | 卡片、组件背景 |
| **Surface Elevated** | `#F4F4F5` | `--color-surface-elevated` | 抬升层级背景 |
| **Border** | `#E4E4E7` | `--color-border` | 边框线 |
| **Border Subtle** | `#F4F4F5` | `--color-border-subtle` | 细微分隔线 |
| **Destructive** | `#DC2626` | `--color-destructive` | 错误/警告状态 |
| **Success** | `#16A34A` | `--color-success` | 成功状态 |

### Dark Mode

| Role | Hex | CSS Variable |
|------|-----|--------------|
| **Primary** | `#FAFAFA` | `--color-primary-dark` |
| **On Primary** | `#0A0A0A` | `--color-on-primary-dark` |
| **Secondary** | `#A1A1AA` | `--color-secondary-dark` |
| **Tertiary** | `#71717A` | `--color-tertiary-dark` |
| **Accent** | `#3B82F6` | `--color-accent-dark` |
| **Background** | `#09090B` | `--color-background-dark` |
| **Surface** | `#18181B` | `--color-surface-dark` |
| **Surface Elevated** | `#27272A` | `--color-surface-elevated-dark` |
| **Border** | `#27272A` | `--color-border-dark` |

### Gradient Accents

```css
/* Tesla式蓝色渐变 - 用于Hero和CTA */
--gradient-primary: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
--gradient-hero: linear-gradient(180deg, #FAFAFA 0%, #F4F4F5 100%);
--gradient-dark-hero: linear-gradient(180deg, #09090B 0%, #18181B 100%);
```

---

## Typography

### Font Stack

```css
/* 主字体：Plus Jakarta Sans — 科技感 + 可读性 */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

/* 等宽字体：JetBrains Mono — 技术数据展示 */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

--font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
```

### Type Scale (Tesla/DJI风格 - 更大胆)

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| **Display** | 72px / 4.5rem | 800 | 1.0 | -0.03em |
| **H1** | 56px / 3.5rem | 700 | 1.1 | -0.02em |
| **H2** | 40px / 2.5rem | 700 | 1.15 | -0.02em |
| **H3** | 32px / 2rem | 600 | 1.2 | -0.01em |
| **H4** | 24px / 1.5rem | 600 | 1.3 | 0 |
| **Body Large** | 18px / 1.125rem | 400 | 1.6 | 0 |
| **Body** | 16px / 1rem | 400 | 1.6 | 0 |
| **Body Small** | 14px / 0.875rem | 400 | 1.5 | 0 |
| **Caption** | 12px / 0.75rem | 500 | 1.4 | 0.02em |
| **Label** | 11px / 0.6875rem | 600 | 1.2 | 0.08em |

### Text Utilities

```css
.text-display { font-size: 4.5rem; font-weight: 800; line-height: 1.0; letter-spacing: -0.03em; }
.text-h1 { font-size: 3.5rem; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
.text-h2 { font-size: 2.5rem; font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; }
.text-h3 { font-size: 2rem; font-weight: 600; line-height: 1.2; letter-spacing: -0.01em; }
.text-h4 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
.text-body-lg { font-size: 1.125rem; font-weight: 400; line-height: 1.6; }
.text-body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
.text-body-sm { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }
.text-caption { font-size: 0.75rem; font-weight: 500; line-height: 1.4; letter-spacing: 0.02em; }
.text-label { font-size: 0.6875rem; font-weight: 600; line-height: 1.2; letter-spacing: 0.08em; text-transform: uppercase; }
.text-mono { font-family: var(--font-mono); }
```

---

## Spacing System (8px Grid)

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
  --space-32: 8rem;    /* 128px */
}
```

### Section Spacing

| Section Type | Vertical Padding |
|-------------|-----------------|
| Hero | 120px - 160px |
| Content Section | 80px - 120px |
| Cards Grid | 64px - 96px |
| CTA Section | 64px - 80px |
| Footer | 48px - 64px |

---

## Components

### Buttons

#### Primary Button (Tesla风格)
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button
```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  background: transparent;
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1.5px solid var(--color-primary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
```

#### Accent/CTA Button (蓝色)
```css
.btn-accent {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--color-accent);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
}

.btn-accent:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}
```

#### Ghost Button
```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  color: var(--color-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-ghost:hover {
  color: var(--color-primary);
  background: var(--color-border-subtle);
}
```

### Cards

#### Product Card
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: var(--color-border-subtle);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.card-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
}

.card-content {
  padding: 24px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-primary);
}

.card-description {
  font-size: 0.875rem;
  color: var(--color-secondary);
  line-height: 1.6;
}
```

#### Feature Card (无边框)
```css
.card-feature {
  padding: 32px;
  background: transparent;
}

.card-feature:hover {
  background: var(--color-surface);
}
```

#### Stat Card (数据展示)
```css
.card-stat {
  padding: 24px;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 8px;
}
```

### Navigation

#### Header
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-subtle);
}

.header-dark {
  background: rgba(9, 9, 11, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-secondary);
  text-decoration: none;
  transition: color 200ms ease;
}

.nav-link:hover,
.nav-link-active {
  color: var(--color-primary);
}
```

#### Mobile Navigation
```css
.mobile-nav {
  position: fixed;
  inset: 0;
  background: var(--color-background);
  z-index: 200;
  padding: 24px;
}

.mobile-nav-link {
  display: block;
  padding: 16px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  font-family: var(--font-sans);
  color: var(--color-primary);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  transition: all 200ms ease;
  min-height: 48px;
}

.input::placeholder {
  color: var(--color-tertiary);
}

.input:hover {
  border-color: var(--color-secondary);
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-error {
  border-color: var(--color-destructive);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
```

### Badges/Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 4px;
  text-transform: uppercase;
}

.badge-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.badge-accent {
  background: rgba(37, 99, 235, 0.1);
  color: var(--color-accent);
}

.badge-success {
  background: rgba(22, 163, 74, 0.1);
  color: var(--color-success);
}
```

---

## Shadows

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.12);
  --shadow-2xl: 0 32px 64px rgba(0, 0, 0, 0.16);
  
  /* Dark mode shadows */
  --shadow-dark-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-dark-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-dark-lg: 0 12px 32px rgba(0, 0, 0, 0.5);
}
```

---

## Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
}
```

---

## Animation & Motion

### Timing Functions
```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

:root {
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
}
```

### Scroll Animations
```css
/* Section fade-in on scroll */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered children */
.stagger-children > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 400ms var(--ease-out), transform 400ms var(--ease-out);
}

.stagger-children.visible > *:nth-child(1) { transition-delay: 0ms; opacity: 1; transform: translateY(0); }
.stagger-children.visible > *:nth-child(2) { transition-delay: 100ms; opacity: 1; transform: translateY(0); }
.stagger-children.visible > *:nth-child(3) { transition-delay: 200ms; opacity: 1; transform: translateY(0); }
.stagger-children.visible > *:nth-child(4) { transition-delay: 300ms; opacity: 1; transform: translateY(0); }
.stagger-children.visible > *:nth-child(5) { transition-delay: 400ms; opacity: 1; transform: translateY(0); }
.stagger-children.visible > *:nth-child(6) { transition-delay: 500ms; opacity: 1; transform: translateY(0); }
```

### Hover Effects
```css
/* Scale on hover */
.hover-scale {
  transition: transform 300ms var(--ease-out);
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Lift on hover */
.hover-lift {
  transition: transform 300ms var(--ease-out), box-shadow 300ms var(--ease-out);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Image zoom on card hover */
.card-image-wrapper {
  overflow: hidden;
}

.card-image-wrapper img {
  transition: transform 500ms var(--ease-out);
}

.card:hover .card-image-wrapper img {
  transform: scale(1.05);
}
```

---

## Responsive Breakpoints

```css
/* Mobile First */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Usage in Tailwind */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Container Widths
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 32px;
  }
}

@media (min-width: 1280px) {
  .container {
    padding: 0 48px;
  }
}
```

---

## Style Guidelines

### Style: Premium Industrial

**Keywords:** Tesla, DJI, aerospace, precision, clean energy, innovation, B2B enterprise, high-end manufacturing

**Core Attributes:**
- 极简主义 — 减少视觉噪音，突出内容
- 大胆排版 — 使用更大的标题，更强的视觉冲击
- 技术感 — JetBrains Mono用于数据，等宽字体传递专业感
- 大量留白 — 呼吸空间，高端感
- 微妙动效 — 精致的hover和scroll动画

**Color Application:**
- Primary (#0A0A0A) 用于标题和重要元素
- Accent (#2563EB) Tesla蓝 用于CTA和链接
- Neutrals 用于背景和分隔
- 渐变仅用于Hero和重要CTA区域

**Light/Dark Mode:**
- 浅色模式为主要模式（工业B2B首选）
- 深色模式作为补充
- 自动检测系统偏好

---

## Page Layout Patterns

### Hero Section
1. 大标题 (Display/H1)
2. 副标题 (Body Large)
3. CTA按钮组
4. Hero图像/视频

### Features Section
1. Section标题
2. 3-4列功能卡片网格
3. 每个卡片：图标 + 标题 + 描述

### Stats Section
1. 4列数字统计卡片
2. 每个卡片：大数字 + 标签

### Products Section
1. Section标题 + 描述
2. 3列产品卡片网格
3. 每个卡片：图片 + 标题 + 描述 + CTA

### CTA Section
1. 大标题
2. 描述文字
3. CTA按钮
4. 背景渐变或图案

### Footer
1. Logo + 公司描述
2. 4列链接组
3. 社交媒体
4. 版权信息

---

## Anti-Patterns (Do NOT Use)

- ❌ **Emojis as icons** — 使用 SVG icons (Heroicons, Lucide)
- ❌ **过度使用渐变** — 仅用于Hero和CTA
- ❌ **多种字体** — 只使用 Plus Jakarta Sans + JetBrains Mono
- ❌ **彩色图标** — 图标应为单色或浅灰色
- ❌ **复杂的阴影** — 使用微妙的扁平阴影
- ❌ **过多动画** — 保持克制，只有功能性动效
- ❌ **低对比度** — 始终保持 4.5:1 以上

### Additional Rules

- ❌ **Missing cursor:pointer** — 所有可点击元素必须有 cursor:pointer
- ❌ **Layout-shifting hovers** — 避免改变布局的scale效果
- ❌ **Instant state changes** — 始终使用 transitions (150-300ms)
- ❌ **Invisible focus states** — 无障碍支持键盘导航
- ❌ **No prefers-reduced-motion** — 必须尊重用户偏好

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Dark mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] Touch targets minimum 44×44px
- [ ] No decorative-only animations

---

## Implementation Priority

### Phase 1: Foundation
1. CSS Variables 定义
2. Typography 系统
3. Button 组件
4. Card 组件
5. Input 组件

### Phase 2: Layout
1. Container 系统
2. Header/Navigation
3. Footer
4. Section spacing

### Phase 3: Pages
1. Homepage Hero
2. Products page
3. About page
4. Contact page

### Phase 4: Polish
1. Scroll animations
2. Hover effects
3. Dark mode
4. Accessibility audit
