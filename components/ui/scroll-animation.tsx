"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export function ScrollAnimation({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
  threshold = 0.1,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const directionVariants = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all",
        isInView ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        transform: isInView
          ? `translate(${directionVariants[direction].x}px, ${directionVariants[direction].y}px)`
          : `translate(${directionVariants[direction].x * 2}px, ${directionVariants[direction].y * 2}px)`,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay * 1000}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

// Staggered children animation
interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  staggerDirection?: "up" | "down" | "left" | "right";
  once?: boolean;
  threshold?: number;
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.1,
  staggerDirection = "up",
  once = true,
  threshold = 0.1,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all",
            isInView ? "opacity-100" : "opacity-0"
          )}
          style={{
            transform:
              isInView
                ? "translate(0, 0)"
                : `translate(${
                    staggerDirection === "left"
                      ? 30
                      : staggerDirection === "right"
                      ? -30
                      : 0
                  }px, ${
                    staggerDirection === "up"
                      ? 30
                      : staggerDirection === "down"
                      ? -30
                      : 0
                  }px)`,
            transitionDuration: "0.6s",
            transitionDelay: `${index * staggerDelay}s`,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Counter animation hook
export function useCounterAnimation(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true,
  decimals: number = 0
) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startOnView || isInView) {
      if (hasStarted.current) return;
      hasStarted.current = true;

      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = end * easeOut;

        setCount(Number(currentValue.toFixed(decimals)));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [end, duration, startOnView, isInView, decimals]);

  return { count, ref, isInView };
}

// Animated number display
interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const { count, ref } = useCounterAnimation(value, duration, true, decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
