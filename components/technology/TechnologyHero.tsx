"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CoreTechnology } from "@/data/technology";

interface HeroProps {
  badge: string;
  title: string;
  subtitle: string;
  stats: {
    patents: string;
    papers: string;
    production: string;
    samples: string;
  };
}

interface TechnologyHeroProps {
  hero: HeroProps;
  technologies?: CoreTechnology[];
}

function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function TechnologyHero({ hero }: TechnologyHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative bg-[#050508] text-white min-h-[90vh] flex flex-col justify-between items-center overflow-hidden font-sans select-none"
    >
      {/* 背景流光弧线 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* 大气隐约光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-cyan-500/10 blur-[150px] rounded-full" />

        {/* 精密 SVG 弧线 */}
        <svg
          className="w-full h-full absolute inset-0 opacity-90"
          viewBox="0 0 1440 600"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="-100,120 Q 600,280 1540,550"
            stroke="url(#laser-gradient)"
            strokeWidth="2.5"
          />
          <path
            d="-100,120 Q 600,280 1540,550"
            stroke="url(#laser-gradient-glow)"
            strokeWidth="8"
            opacity="0.4"
            className="blur-sm"
          />
          <defs>
            <linearGradient id="laser-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.1" />
              <stop offset="45%" stopColor="#00f0ff" stopOpacity="1" />
              <stop offset="65%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="laser-gradient-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="30%" stopColor="#00f0ff" />
              <stop offset="70%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        {/* 粒子微光效果 */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* 波动光纹 */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-wave-line-1" />
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-wave-line-2" />
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent animate-wave-line-3" />
        </div>
      </div>

      {/* 中央内容核心 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-28 pb-16 my-auto flex flex-col items-center"
      >
        {/* 巨型优雅标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
        >
          <span className="text-white">{hero.title.split('，')[0]}，</span>
          <span className="text-shimmer">{hero.title.split('，')[1]}</span>
        </motion.h1>

        {/* 简练副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed mb-10 tracking-wide"
        >
          {hero.subtitle}
        </motion.p>

        {/* 正弦波效果 */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full max-w-2xl h-12 overflow-hidden"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 400 48"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,24 C50,0 100,48 150,24 C200,0 250,48 300,24 C350,0 400,48 450,24 C500,0 550,48 600,24"
              stroke="url(#sine-gradient)"
              strokeWidth="2"
              fill="none"
            >
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values="
                  M0,24 C50,0 100,48 150,24 C200,0 250,48 300,24 C350,0 400,48 450,24 C500,0 550,48 600,24;
                  M-50,24 C0,0 50,48 100,24 C150,0 200,48 250,24 C300,0 350,48 400,24 C450,0 500,48 550,24;
                  M0,24 C50,0 100,48 150,24 C200,0 250,48 300,24 C350,0 400,48 450,24 C500,0 550,48 600,24
                "
              />
            </path>
            <path
              d="M0,24 C50,48 100,0 150,24 C200,48 250,0 300,24 C350,48 400,0 450,24 C500,48 550,0 600,24"
              stroke="url(#sine-gradient-2)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            >
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M0,24 C50,48 100,0 150,24 C200,48 250,0 300,24 C350,48 400,0 450,24 C500,48 550,0 600,24;
                  M-50,24 C0,48 50,0 100,24 C150,48 200,0 250,24 C300,48 350,0 400,24 C450,48 500,0 550,24;
                  M0,24 C50,48 100,0 150,24 C200,48 250,0 300,24 C350,48 400,0 450,24 C500,48 550,0 600,24
                "
              />
            </path>
            <defs>
              <linearGradient id="sine-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
                <stop offset="20%" stopColor="#00f0ff" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#00f0ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="sine-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>

      {/* 底部悬浮数据背书 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              <CountUp end={20} suffix="+" />
            </div>
            <div className="text-xs text-slate-500 mt-1 font-light tracking-wider uppercase">{hero.stats.patents}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              <CountUp end={50} suffix="+" />
            </div>
            <div className="text-xs text-slate-500 mt-1 font-light tracking-wider uppercase">{hero.stats.papers}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              <CountUp end={1000} suffix="吨" />
            </div>
            <div className="text-xs text-slate-500 mt-1 font-light tracking-wider uppercase">{hero.stats.production}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">A 样</div>
            <div className="text-xs text-slate-500 mt-1 font-light tracking-wider uppercase">{hero.stats.samples}</div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            opacity: 0.2;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-20px) scale(1.5);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes waveLine1 {
          0%, 100% { top: 20%; opacity: 0.3; }
          50% { top: 25%; opacity: 0.6; }
        }
        @keyframes waveLine2 {
          0%, 100% { top: 45%; opacity: 0.2; }
          50% { top: 50%; opacity: 0.5; }
        }
        @keyframes waveLine3 {
          0%, 100% { top: 70%; opacity: 0.25; }
          50% { top: 65%; opacity: 0.45; }
        }
        .animate-wave-line-1 {
          animation: waveLine1 6s ease-in-out infinite;
        }
        .animate-wave-line-2 {
          animation: waveLine2 8s ease-in-out infinite;
        }
        .animate-wave-line-3 {
          animation: waveLine3 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
