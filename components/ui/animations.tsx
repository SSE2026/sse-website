"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* ============================================
   Design System Animation Constants
   ============================================ */

export const EASING = {
  expo: [0.16, 1, 0.3, 1] as const,
  quint: [0.22, 1, 0.36, 1] as const,
  spring: [0.175, 0.885, 0.32, 1.275] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
};

export const DURATION = {
  instant: 0.05,
  fast: 0.1,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
  slowest: 0.7,
};

/* ============================================
   Animation Variants
   ============================================ */

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASING.expo },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.normal, ease: EASING.expo },
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slower, ease: EASING.expo },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: DURATION.normal, ease: EASING.expo },
  },
};

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slower, ease: EASING.expo },
  },
};

export const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slower, ease: EASING.expo },
  },
};

export const fadeInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slower, ease: EASING.expo },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slower, ease: EASING.expo },
  },
};

export const slideInUpVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: DURATION.slowest, ease: EASING.expo },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: DURATION.slow, ease: EASING.expo },
  },
};

/* ============================================
   Animation Hooks
   ============================================ */

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

export function useInViewAnimation(options?: {
  threshold?: number;
  margin?: string;
  once?: boolean;
}) {
  const { threshold = 0.1, margin = "-50px", once = true } = options ?? {};

  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once, threshold, margin },
  };
}

/* ============================================
   Page Loader Component
   ============================================ */

interface PageLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function PageLoader({ isLoading, onComplete }: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.slower, ease: EASING.expo }}
          className="fixed inset-0 z-[9999] bg-[#FAFAFA] flex items-center justify-center"
          onAnimationComplete={onComplete}
        >
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: DURATION.slower, ease: EASING.expo }}
            className="relative"
          >
            {/* Rotating rings - Tesla Blue */}
            <motion.div
              className="w-24 h-24 rounded-full border border-[#2563EB]/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 w-20 h-20 rounded-full border border-[#3B82F6]/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 w-16 h-16 rounded-full border border-[#2563EB]/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Center pulse */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-4 h-4 rounded-full bg-[#2563EB]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8],
                  boxShadow: [
                    "0 0 20px rgba(37, 99, 235, 0.5)",
                    "0 0 40px rgba(37, 99, 235, 0.8)",
                    "0 0 20px rgba(37, 99, 235, 0.5)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-[#52525B] tracking-widest uppercase"
            >
              Loading
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================
   Fade Components
   ============================================ */

interface FadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: React.ElementType;
}

export function Fade({
  children,
  className,
  delay = 0,
  duration = DURATION.slow,
  as: Component = "div",
}: FadeProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className, delay = 0, as = "div" }: Omit<FadeProps, "duration">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
      transition={{ delay, duration: DURATION.slow }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, className, delay = 0, as = "div" }: Omit<FadeProps, "duration">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUpVariants}
      transition={{ delay, duration: DURATION.slower }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInDown({ children, className, delay = 0, as = "div" }: Omit<FadeProps, "duration">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInDownVariants}
      transition={{ delay, duration: DURATION.slower }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInLeft({ children, className, delay = 0, as = "div" }: Omit<FadeProps, "duration">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInLeftVariants}
      transition={{ delay, duration: DURATION.slower }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInRight({ children, className, delay = 0, as = "div" }: Omit<FadeProps, "duration">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInRightVariants}
      transition={{ delay, duration: DURATION.slower }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0 }: Omit<FadeProps, "duration">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleInVariants}
      transition={{ delay, duration: DURATION.slower }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   Pulse Animations
   ============================================ */

export function Pulse({ children, className, ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PulseRing({ className, ...props }: { className?: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.5], opacity: [1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      className={cn("rounded-full", className)}
    />
  );
}

/* ============================================
   Shimmer - Loading Skeleton
   ============================================ */

interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Shimmer({ className, width, height }: ShimmerProps) {
  return (
    <motion.div
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        width,
        height,
        background: "linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.06) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
      }}
      className={cn("rounded", className)}
    />
  );
}

/* ============================================
   Glow Pulse - Brand Effect
   ============================================ */

export function GlowPulse({ children, className, color = "#3B82F6" }: { children?: React.ReactNode; className?: string; color?: string }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 20px ${color}33`,
          `0 0 40px ${color}66`,
          `0 0 20px ${color}33`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   Float - Subtle Movement
   ============================================ */

export function Float({ children, className, range = 10, duration = 6 }: { children?: React.ReactNode; className?: string; range?: number; duration?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -range, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   Spin - Loading Spinner
   ============================================ */

export function Spin({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

/* ============================================
   Stagger Children - Group Animation
   ============================================ */

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0,
  direction = "up",
}: StaggerChildrenProps) {
  const getInitial = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 20 };
      case "down": return { opacity: 0, y: -20 };
      case "left": return { opacity: 0, x: 20 };
      case "right": return { opacity: 0, x: -20 };
      default: return { opacity: 0, y: 20 };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: getInitial(),
            visible: {
              opacity: 1,
              x: 0,
              y: 0,
              transition: { duration: DURATION.slower, ease: EASING.expo },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ============================================
   Stagger Fade - Simple Stagger
   ============================================ */

export function StaggerFade({ children, className, staggerDelay = 0.075 }: StaggerChildrenProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: DURATION.normal } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ============================================
   Section Reveal
   ============================================ */

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: SectionRevealProps) {
  const getVariants = (): Variants => {
    const base = { opacity: 0, transition: { duration: DURATION.slowest, ease: EASING.expo, delay } };
    switch (direction) {
      case "up": return { hidden: { ...base, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: DURATION.slowest, ease: EASING.expo, delay } } };
      case "down": return { hidden: { ...base, y: -60 }, visible: { opacity: 1, y: 0, transition: { duration: DURATION.slowest, ease: EASING.expo, delay } } };
      case "left": return { hidden: { ...base, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: DURATION.slowest, ease: EASING.expo, delay } } };
      case "right": return { hidden: { ...base, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: DURATION.slowest, ease: EASING.expo, delay } } };
      default: return { hidden: { ...base, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: DURATION.slowest, ease: EASING.expo, delay } } };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   Stagger Container (for custom children)
   ============================================ */

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: staggerDelay, delayChildren },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION.slower, ease: EASING.expo },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   Magnetic Button Effect
   ============================================ */

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className, strength = 0.3 }: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   Gradient Text Animation
   ============================================ */

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
  duration?: number;
}

export function GradientText({
  children,
  className,
  from = "#2563EB",
  to = "#3B82F6",
  duration = 4,
}: GradientTextProps) {
  return (
    <motion.span
      className={className}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{
        background: `linear-gradient(90deg, ${from}, ${to}, ${from})`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </motion.span>
  );
}

/* ============================================
   Cursor Follower
   ============================================ */

interface CursorFollowerProps {
  color?: string;
  size?: number;
}

export function CursorFollower({ color = "rgba(59, 130, 246, 0.08)", size = 400 }: CursorFollowerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        animate={{
          x: mousePosition.x - size / 2,
          y: mousePosition.y - size / 2,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ============================================
   Utility: cn helper (local copy)
   ============================================ */

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
