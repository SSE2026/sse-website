"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Mouse Follower Component
interface MouseFollowerProps {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  color?: string;
  isActive?: boolean;
}

export function MouseFollower({
  children,
  className,
  size = 300,
  color = "rgba(245, 158, 11, 0.1)",
  isActive = true,
}: MouseFollowerProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isActive, isVisible]);

  return (
    <div
      ref={cursorRef}
      className={cn("pointer-events-none fixed inset-0 z-0", className)}
      style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
    >
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute rounded-full blur-3xl"
          style={{
            width: size,
            height: size,
            background: color,
            transform: `translate(-${size / 2}px, -${size / 2}px)`,
          }}
        />
      )}
    </div>
  );
}

// Animated Number Counter
interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 50,
    damping: 20,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      motionValue.set(value);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, delay, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}

// Staggered Text Reveal
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.03,
  once = true,
}: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-1">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "100%" },
              visible: {
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: delay + i * stagger,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// Typing Effect
interface TypingEffectProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
}

export function TypingEffect({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isTyping, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {cursor && isTyping && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

// Marquee Effect
interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "overflow-hidden",
        pauseOnHover && "hover:[&>div]:animation-pause",
        className
      )}
    >
      <motion.div
        className="flex gap-8"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {/* Duplicate content for seamless loop */}
        <div className="flex gap-8 shrink-0">{children}</div>
        <div className="flex gap-8 shrink-0">{children}</div>
      </motion.div>
    </div>
  );
}

// Pulsing Dot
interface PulsingDotProps {
  size?: number;
  color?: string;
  className?: string;
}

export function PulsingDot({
  size = 8,
  color = "#F59E0B",
  className,
}: PulsingDotProps) {
  return (
    <motion.span
      className={cn("inline-block rounded-full", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Skeleton Loader
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <motion.div
      className={cn(
        "bg-white/5 animate-pulse",
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}
