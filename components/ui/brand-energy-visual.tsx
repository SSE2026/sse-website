"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

/**
 * BrandEnergyVisual
 * -----------------
 * Renders the real /logo.png as the central brand element, with two
 * luminous orbits arcing around it and a mirror floor reflection
 * underneath. The 2D PNG is dressed up with multi-color glow + reflection
 * to read as a 3D crystalline cube against a clean silver backdrop.
 *
 * - No Three.js, no WebGL, no new deps. Pure SVG + CSS animations.
 * - Subtle vertical float on the logo (4-6px, 6-8s, ease-in-out).
 * - Two luminous highlight flows at different speeds (16s / 22s).
 * - Hover (pointer-fine): logo tilts ~1.5deg, orbits scale 1.04,
 *   highlight brightness lifts. ~600ms ease-out.
 * - prefers-reduced-motion → static, no animation.
 * - Touch / coarse pointer → hover disabled, animation softened.
 */

type Props = {
  logoSrc?: string;
  size?: number;
  className?: string;
};

export function BrandEnergyVisual({
  logoSrc = "/logo.png",
  className,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Defer animations until after first paint so the initial frame
  // doesn't snap with a stale transform on slow devices.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // SVG viewBox 0..600. Two orbits at different tilts; each is drawn
  // as a full closed ellipse so the path stroke-dashoffset animation
  // wraps cleanly without seams.
  const cx = 300;
  const cy = 300;

  // Track 1: very wide, tilt -16°, slow flow (16s).
  // Track 2: narrower tilt +16°, brighter, faster flow (22s, reverse).
  // Orbits are pushed well outside the logo so the arcs read as
  // sweeping ribbons of light, not as rings hugging the silhouette.
  const track1 = { rx: 305, ry: 190, tilt: -16, period: 16 };
  const track2 = { rx: 260, ry: 215, tilt: 16, period: 22 };

  const track1Path = `M ${cx + track1.rx} ${cy}
    a ${track1.rx} ${track1.ry} 0 1 1 -${track1.rx * 2} 0
    a ${track1.rx} ${track1.ry} 0 1 1 ${track1.rx * 2} 0 Z`;

  const track2Path = `M ${cx + track2.rx} ${cy}
    a ${track2.rx} ${track2.ry} 0 1 1 -${track2.rx * 2} 0
    a ${track2.rx} ${track2.ry} 0 1 1 ${track2.rx * 2} 0 Z`;

  return (
    <div
      className={["relative inline-block select-none brand-root", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: "100%",
        height: 0,
        paddingBottom: "100%",
        position: "relative",
        ["--orbit-hover-scale" as string]: hovering ? 1.04 : 1,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      data-hovering={hovering || undefined}
    >
      {/* Orbit layer — sits behind/around the logo, full square. */}
      <div
        className="brand-orbits"
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
        }}
      >
        <svg
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          aria-hidden="true"
          style={{ display: "block", overflow: "visible" }}
        >
          <defs>
            {/* Soft Gaussian blur — applied to the orbit paths so the
                stroke reads as light, not as a hard line. */}
            <filter
              id={`blur-soft-${uid}`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
            <filter
              id={`blur-strong-${uid}`}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="4.5" />
            </filter>

            {/* Highlight gradient — silver-white bloom fading to
                transparent at both ends. Used on the leading dash so
                each orbit reads as a sweeping ribbon of light. */}
            <linearGradient
              id={`hi-${uid}-1`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="50%" stopColor="rgba(255,255,255,1)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            <linearGradient
              id={`hi-${uid}-2`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(220,232,255,0)" />
              <stop offset="50%" stopColor="rgba(245,250,255,1)" />
              <stop offset="100%" stopColor="rgba(220,232,255,0)" />
            </linearGradient>

            {/* Logo radial glow — three brand-colour blobs sit under
                the silhouette so the cube reads as illuminated from
                inside, not pasted flat onto the page. */}
            <radialGradient
              id={`glow-blue-${uid}`}
              cx="50%"
              cy="22%"
              r="38%"
              fx="50%"
              fy="22%"
            >
              <stop offset="0%" stopColor="rgba(96,165,250,0.55)" />
              <stop offset="60%" stopColor="rgba(96,165,250,0.15)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0)" />
            </radialGradient>
            <radialGradient
              id={`glow-orange-${uid}`}
              cx="22%"
              cy="55%"
              r="35%"
              fx="22%"
              fy="55%"
            >
              <stop offset="0%" stopColor="rgba(251,146,60,0.45)" />
              <stop offset="60%" stopColor="rgba(251,146,60,0.12)" />
              <stop offset="100%" stopColor="rgba(251,146,60,0)" />
            </radialGradient>
            <radialGradient
              id={`glow-green-${uid}`}
              cx="78%"
              cy="55%"
              r="35%"
              fx="78%"
              fy="55%"
            >
              <stop offset="0%" stopColor="rgba(34,197,94,0.4)" />
              <stop offset="60%" stopColor="rgba(34,197,94,0.1)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0)" />
            </radialGradient>
          </defs>

          {/* === TRACK 1 — wider, slower === */}
          <g transform={`rotate(${track1.tilt} ${cx} ${cy})`}>
            {/* Track 1 base ring — faint silver, blurred so it reads
                as ambient glow, not as a hard line. */}
            <path
              d={track1Path}
              fill="none"
              stroke="rgba(120,128,148,0.22)"
              strokeWidth="1.2"
              filter={`url(#blur-soft-${uid})`}
            />
            {/* Track 1 moving highlight — bright dash, blurred. */}
            <path
              d={track1Path}
              fill="none"
              stroke={`url(#hi-${uid}-1)`}
              strokeWidth="3.2"
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray="180 820"
              filter={`url(#blur-strong-${uid})`}
              className={mounted ? "brand-flow-1" : ""}
              style={{ animationDuration: `${track1.period}s` }}
            />
            {/* Track 1 core highlight — sharper dash layered on top of
                the blurred one, gives the "lit core inside a soft
                halo" look. */}
            <path
              d={track1Path}
              fill="none"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth="1.4"
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray="120 880"
              className={mounted ? "brand-flow-1" : ""}
              style={{ animationDuration: `${track1.period}s` }}
            />
          </g>

          {/* === TRACK 2 — narrower, faster, counter-rotating === */}
          <g transform={`rotate(${track2.tilt} ${cx} ${cy})`}>
            <path
              d={track2Path}
              fill="none"
              stroke="rgba(140,148,170,0.25)"
              strokeWidth="1.2"
              filter={`url(#blur-soft-${uid})`}
            />
            <path
              d={track2Path}
              fill="none"
              stroke={`url(#hi-${uid}-2)`}
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray="150 850"
              filter={`url(#blur-strong-${uid})`}
              className={mounted ? "brand-flow-2" : ""}
              style={{ animationDuration: `${track2.period}s` }}
            />
            <path
              d={track2Path}
              fill="none"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth="1.3"
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray="100 900"
              className={mounted ? "brand-flow-2" : ""}
              style={{ animationDuration: `${track2.period}s` }}
            />
          </g>
        </svg>
      </div>

      {/* === LOGO + REFLECTION === */}
      <div
        className={mounted ? "brand-logo-float" : ""}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "62%",
          height: "62%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Inner glow stack — three brand-colour radial blobs sit
            immediately behind the silhouette so the cube reads as
            illuminated, not pasted flat. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 22%, rgba(96,165,250,0.55) 0%, rgba(96,165,250,0.12) 35%, transparent 60%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 22% 60%, rgba(251,146,60,0.4) 0%, rgba(251,146,60,0.1) 30%, transparent 55%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 78% 60%, rgba(34,197,94,0.4) 0%, rgba(34,197,94,0.1) 30%, transparent 55%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        {/* Mirror floor reflection. A flipped clone of the logo,
            masked from full opacity at the top down to transparent at
            the bottom, with a fade-out blur at the very bottom to
            suggest the reflection dissolving into the floor. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "100%",
            height: "70%",
            transform: "scaleY(-1)",
            transformOrigin: "top center",
            opacity: 0.55,
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.15) 65%, transparent 95%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.15) 65%, transparent 95%)",
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        >
          <Image
            src={logoSrc}
            alt=""
            width={560}
            height={560}
            priority={false}
            draggable={false}
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Floor contact shadow — a thin, dark ellipse below the
            logo grounds it on the mirror surface. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "5%",
            right: "5%",
            top: "calc(100% + 2px)",
            height: "18px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(15,15,30,0.28) 0%, rgba(15,15,30,0.1) 40%, transparent 70%)",
            filter: "blur(4px)",
            pointerEvents: "none",
          }}
        />

        {/* The actual Logo — sharp, crisp, on top of everything. */}
        <Image
          src={logoSrc}
          alt="Swift Safe Energy"
          width={560}
          height={560}
          priority
          draggable={false}
          className="brand-logo-img"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "relative",
            zIndex: 2,
            // Stacked drop-shadows give the cube a sense of volume:
            // a tight dark shadow for the silhouette, then a wider
            // coloured glow that bleeds into the surroundings.
            filter:
              "drop-shadow(0 12px 18px rgba(15,15,30,0.18)) drop-shadow(0 24px 60px rgba(15,15,30,0.12)) drop-shadow(0 0 40px rgba(96,165,250,0.18))",
          }}
        />
      </div>

      {/* Component-local CSS. Kept inline so the visual is self-
          contained and easy to delete without touching globals.css. */}
      <style jsx>{`
        /* Logo slow vertical float. ~5px amplitude, 7s, ease-in-out,
           alternate, so the eye follows it but never gets seasick. */
        @keyframes brand-float {
          0% {
            transform: translate(-50%, calc(-50% - 0px));
          }
          50% {
            transform: translate(-50%, calc(-50% - 5px));
          }
          100% {
            transform: translate(-50%, calc(-50% - 0px));
          }
        }

        /* Highlights travel along pathLength=1000, so dash math is
           independent of the actual ellipse perimeter. */
        @keyframes brand-flow-1 {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -1000;
          }
        }
        @keyframes brand-flow-2 {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: 1000;
          }
        }

        .brand-logo-float {
          animation: brand-float 7s ease-in-out infinite;
          will-change: transform;
        }
        .brand-flow-1 {
          animation-name: brand-flow-1;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: stroke-dashoffset;
        }
        .brand-flow-2 {
          animation-name: brand-flow-2;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: stroke-dashoffset;
        }

        /* Hover: scale the orbit ring up, brighten the logo image.
           Disabled on coarse pointers (touch / hover-unreliable). */
        @media (hover: hover) and (pointer: fine) {
          .brand-orbits {
            transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
              filter 600ms ease-out;
          }
          [data-hovering] .brand-orbits {
            transform: scale(1.04);
            filter: brightness(1.1);
          }
          [data-hovering] .brand-logo-img {
            transform: rotate(-1.5deg);
            transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
          }
        }

        /* Touch / coarse pointer: dampen the float cadence; hover
           doesn't fire reliably, so we skip it entirely. */
        @media (hover: none) {
          .brand-logo-float {
            animation-duration: 9s;
          }
        }

        /* Reduced motion: stop everything. Logo rests, highlights
           freeze, hover scale disabled. */
        @media (prefers-reduced-motion: reduce) {
          .brand-logo-float {
            animation: none;
          }
          .brand-flow-1,
          .brand-flow-2 {
            animation: none;
          }
          [data-hovering] .brand-orbits {
            transform: none;
          }
          [data-hovering] .brand-logo-img {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}