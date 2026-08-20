// components/ui/circular-gallery.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface CircularGalleryProps {
  images: string[];
  title?: string;
  subtitle?: string;
}

const TOTAL_CARDS = 10;
// 卡片 CSS 尺寸 - 这些是 transform 的基准
const CARD_WIDTH = 320;
const CARD_HEIGHT = 200;
const RADIUS = 550;
const PERSPECTIVE = 1200;
const ROTATION_DURATION = 90; // seconds per full rotation

const CARD_POSITIONS: { angle: number }[] = [];
for (let i = 0; i < TOTAL_CARDS; i++) {
  const angle = (360 / TOTAL_CARDS) * i;
  CARD_POSITIONS.push({ angle });
}

// ============================================
// 图片配置 - 根据 3D Carousel 卡片真实渲染尺寸计算
// ============================================
//
// 卡片 CSS 尺寸: 320 × 200px
// Next.js 会根据 sizes 和 DPR 计算最优加载尺寸
//
// sizes 配置策略:
// - 卡片实际渲染宽度约 320px
// - 1x 屏: 请求 w=384
// - 2x Retina: 请求 w=640
// - 3x 高分: 请求 w=1080
//
// Next.js 会自动基于原图(最大1672px)压缩出对应尺寸的 AVIF/WebP

const IMAGE_CONFIG = {
  quality: 90,
  // 显式告诉 Next.js 卡片最大渲染宽度为 320px
  sizes: "(max-width: 768px) 100vw, 320px",
};

function CarouselCard({
  pos,
  imageSrc,
  index,
  priority = false
}: {
  pos: typeof CARD_POSITIONS[0];
  imageSrc: string;
  index: number;
  priority?: boolean;
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        marginLeft: `${-CARD_WIDTH / 2}px`,
        marginTop: `${-CARD_HEIGHT / 2}px`,
        transform: `rotateY(${pos.angle}deg) translateZ(${RADIUS}px)`,
        transformStyle: "preserve-3d" as const,
        backfaceVisibility: "visible" as const,
      }}
    >
      {/*
        容器使用 rounded-2xl 和 overflow-hidden
        注意：由于 3D 变换，图片在边缘可能被拉伸，但这是 3D Carousel 的固有特性
      */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-[#1a1a1a]">
        <Image
          src={imageSrc}
          alt={`Product ${index + 1}`}
          fill
          priority={priority}
          quality={IMAGE_CONFIG.quality}
          sizes={IMAGE_CONFIG.sizes}
          // 使用 contain 确保图片完整显示，不裁切
          // 背景色与 Hero 区域匹配，避免白边
          className="object-contain"
        />
      </div>
    </div>
  );
}

function AnimatedCarousel({ images }: { images: readonly string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - lastTimeRef.current) / 1000;
      const degreesPerSecond = 360 / ROTATION_DURATION;
      const rotation = (elapsed * degreesPerSecond) % 360;

      container.style.transform = `rotateY(${rotation}deg)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const getImage = (i: number) => images[i % images.length];

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        transformStyle: "preserve-3d" as const,
        // 这个容器的实际尺寸包含所有卡片
        width: `${CARD_WIDTH + RADIUS * 2}px`,
        height: `${CARD_HEIGHT}px`,
      }}
    >
      {CARD_POSITIONS.map((pos, i) => (
        <CarouselCard
          key={i}
          pos={pos}
          imageSrc={getImage(i)}
          index={i}
          priority={i === 0} // 首图优先加载
        />
      ))}
    </div>
  );
}

export default function CircularGallery({
  images,
  title = "Aeroride Series",
  subtitle = "Premium Battery Solutions",
}: CircularGalleryProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-[50vh] bg-[#050505]" />
    );
  }

  return (
    <section className="relative min-h-[50vh] bg-[#050505] overflow-hidden">
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "50% 50%" }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-[#0d0d0d] via-[#080808] to-[#050505]" />

        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            transform: "perspective(400px) rotateX(65deg) translateY(35%)",
            transformOrigin: "center bottom",
          }}
        />

        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-radial from-[#2563EB]/25 via-[#2563EB]/10 to-transparent blur-3xl" />

        <div className="absolute top-16 left-0 right-0 text-center z-30 px-4">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
            {title}
          </h2>
          <p className="text-white/70 text-sm tracking-[0.3em] uppercase drop-shadow-md">{subtitle}</p>
        </div>

        <AnimatedCarousel images={images} />

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

// 导出类型供其他组件使用
export type { CircularGalleryProps };

// 导出图片配置供其他地方使用
export { IMAGE_CONFIG };
