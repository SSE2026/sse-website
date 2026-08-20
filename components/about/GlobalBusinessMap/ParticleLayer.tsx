"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { COLORS } from "./mapData";

/**
 * ParticleLayer Component
 *
 * Canvas-based particle system for ambient effects:
 * - Floating particles in the background
 * - Subtle movement and glow
 * - Performance optimized with requestAnimationFrame
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleLayerProps {
  width: number;
  height: number;
  particleCount?: number;
  reducedMotion?: boolean;
  isActive?: boolean;
  className?: string;
}

export function ParticleLayer({
  width,
  height,
  particleCount = 50,
  reducedMotion = false,
  isActive = true,
  className = "",
}: ParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width, height });

  // Generate initial particles
  const generateParticles = useMemo(() => {
    return (count: number, w: number, h: number): Particle[] => {
      const particles: Particle[] = [];
      const colors = [
        COLORS.primary,
        COLORS.primaryLight,
        COLORS.secondary,
        COLORS.business,
      ];

      for (let i = 0; i < count; i++) {
        const maxLife = 200 + Math.random() * 300;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.3 - 0.1,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: Math.random() * maxLife,
          maxLife,
        });
      }

      return particles;
    };
  }, []);

  // Update particle dimensions on resize
  useEffect(() => {
    setDimensions({ width, height });
  }, [width, height]);

  // Initialize particles
  useEffect(() => {
    particlesRef.current = generateParticles(
      reducedMotion ? Math.floor(particleCount / 3) : particleCount,
      width,
      height
    );
  }, [generateParticles, particleCount, reducedMotion, width, height]);

  // Animation loop
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        if (!reducedMotion) {
          particle.x += particle.vx * (deltaTime / 16);
          particle.y += particle.vy * (deltaTime / 16);
          particle.life += deltaTime / 16;

          // Wrap around screen
          if (particle.x < 0) particle.x = dimensions.width;
          if (particle.x > dimensions.width) particle.x = 0;
          if (particle.y < 0) particle.y = dimensions.height;
          if (particle.y > dimensions.height) particle.y = 0;

          // Reset particle if life exceeded
          if (particle.life > particle.maxLife) {
            particle.x = Math.random() * dimensions.width;
            particle.y = Math.random() * dimensions.height;
            particle.life = 0;
          }
        }

        // Calculate fade in/out
        const lifeRatio = particle.life / particle.maxLife;
        const fadeOpacity =
          lifeRatio < 0.1
            ? lifeRatio * 10
            : lifeRatio > 0.9
              ? (1 - lifeRatio) * 10
              : 1;

        const currentOpacity = particle.opacity * fadeOpacity;

        // Draw particle glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = currentOpacity * 0.3;
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();

        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, reducedMotion, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`particle-layer ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}

export default ParticleLayer;
