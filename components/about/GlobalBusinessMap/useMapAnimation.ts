"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ANIMATION_CONFIG } from "./mapData";

/**
 * Animation Stage State Machine
 */
export type AnimationStage =
  | "idle"
  | "intro"
  | "nodes"
  | "hq_connections"
  | "china_reach"
  | "global_reach"
  | "complete";

/**
 * Animation State
 */
export interface AnimationState {
  stage: AnimationStage;
  progress: number; // 0-1 progress within current stage
  overallProgress: number; // 0-1 overall animation progress
  isPlaying: boolean;
  isLooping: boolean;
  reducedMotion: boolean;
}

/**
 * Hook for managing map animation state machine
 */
export function useMapAnimation(options?: {
  autoPlay?: boolean;
  loop?: boolean;
  duration?: number;
}) {
  const { autoPlay = true, loop = true, duration = 20000 } = options || {};

  const [state, setState] = useState<AnimationState>({
    stage: "idle",
    progress: 0,
    overallProgress: 0,
    isPlaying: false,
    isLooping: loop,
    reducedMotion: false,
  });

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const stageStartTimeRef = useRef<number>(0);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setState((prev) => ({ ...prev, reducedMotion: mediaQuery.matches }));

    const handler = (e: MediaQueryListEvent) => {
      setState((prev) => ({ ...prev, reducedMotion: e.matches }));
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Calculate stage timing
  const getStageProgress = useCallback(
    (
      elapsed: number
    ): { stage: AnimationStage; progress: number; overallProgress: number } => {
      const phases = ANIMATION_CONFIG.phases;

      if (elapsed < phases.intro.start * 1000) {
        return { stage: "idle", progress: 0, overallProgress: 0 };
      }
      if (elapsed < phases.intro.end * 1000) {
        const stageProgress =
          (elapsed - phases.intro.start * 1000) /
          ((phases.intro.end - phases.intro.start) * 1000);
        const overallProgress = stageProgress * 0.15;
        return { stage: "intro", progress: Math.min(stageProgress, 1), overallProgress };
      }
      if (elapsed < phases.nodes.end * 1000) {
        const stageProgress =
          (elapsed - phases.nodes.start * 1000) /
          ((phases.nodes.end - phases.nodes.start) * 1000);
        const overallProgress = 0.15 + stageProgress * 0.15;
        return { stage: "nodes", progress: Math.min(stageProgress, 1), overallProgress };
      }
      if (elapsed < phases.hq_connections.end * 1000) {
        const stageProgress =
          (elapsed - phases.hq_connections.start * 1000) /
          ((phases.hq_connections.end - phases.hq_connections.start) * 1000);
        const overallProgress = 0.3 + stageProgress * 0.2;
        return { stage: "hq_connections", progress: Math.min(stageProgress, 1), overallProgress };
      }
      if (elapsed < phases.china_reach.end * 1000) {
        const stageProgress =
          (elapsed - phases.china_reach.start * 1000) /
          ((phases.china_reach.end - phases.china_reach.start) * 1000);
        const overallProgress = 0.5 + stageProgress * 0.25;
        return { stage: "china_reach", progress: Math.min(stageProgress, 1), overallProgress };
      }
      if (elapsed < phases.global_reach.end * 1000) {
        const stageProgress =
          (elapsed - phases.global_reach.start * 1000) /
          ((phases.global_reach.end - phases.global_reach.start) * 1000);
        const overallProgress = 0.75 + stageProgress * 0.2;
        return { stage: "global_reach", progress: Math.min(stageProgress, 1), overallProgress };
      }

      const overallProgress = Math.min(0.95 + (elapsed - phases.complete.start * 1000) / 5000, 1);
      return { stage: "complete", progress: 1, overallProgress };
    },
    []
  );

  // Animation loop
  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const { stage, progress, overallProgress } = getStageProgress(elapsed);

      setState((prev) => ({
        ...prev,
        stage,
        progress,
        overallProgress,
        isPlaying: true,
      }));

      // Check if animation should loop
      if (elapsed >= duration && loop) {
        startTimeRef.current = timestamp;
      } else if (elapsed >= duration && !loop) {
        setState((prev) => ({ ...prev, isPlaying: false }));
        animationRef.current = null;
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [getStageProgress, duration, loop]
  );

  // Start animation
  const play = useCallback(() => {
    if (animationRef.current) return;
    startTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  // Pause animation
  const pause = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  // Reset animation
  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    startTimeRef.current = null;
    setState({
      stage: "idle",
      progress: 0,
      overallProgress: 0,
      isPlaying: false,
      isLooping: loop,
      reducedMotion: state.reducedMotion,
    });
  }, [loop, state.reducedMotion]);

  // Auto-play on mount
  useEffect(() => {
    if (autoPlay) {
      // Delay start to ensure component is visible
      const timer = setTimeout(play, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, play]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Get stage visibility
  const getStageVisibility = useCallback(
    (
      targetStage: AnimationStage
    ): {
      visible: boolean;
      opacity: number;
      scale: number;
    } => {
      const stages: AnimationStage[] = [
        "idle",
        "intro",
        "nodes",
        "hq_connections",
        "china_reach",
        "global_reach",
        "complete",
      ];

      const currentIndex = stages.indexOf(state.stage);
      const targetIndex = stages.indexOf(targetStage);

      // Calculate opacity based on timing within stage
      let opacity = 0;
      let scale = 0.9;

      if (currentIndex > targetIndex) {
        // Past stages - fully visible
        opacity = 1;
        scale = 1;
      } else if (currentIndex === targetIndex) {
        // Current stage - fade in and scale up
        opacity = Math.min(state.progress * 2, 1); // Quick fade in
        scale = 0.9 + state.progress * 0.1;
      }

      return {
        visible: currentIndex >= targetIndex,
        opacity,
        scale,
      };
    },
    [state.stage, state.progress]
  );

  return {
    ...state,
    play,
    pause,
    reset,
    getStageVisibility,
    getStageProgress,
  };
}

/**
 * Hook for viewport visibility detection
 */
export function useInViewport(threshold = 0.3) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
