"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * PointLattice
 * ------------
 * A wireframe icosahedron — twelve nodes joined by thirty edges — that
 * turns slowly behind the R&D hero. Reads as a crystal lattice, which is
 * the right metaphor for a materials company, and stays a diagram rather
 * than an object because no faces are ever filled.
 *
 * Pure SVG: the vertices are rotated and perspective-projected in a
 * requestAnimationFrame loop, then written straight onto the DOM nodes.
 * No Three.js, no WebGL, no re-render per frame, no new deps — the same
 * approach BrandEnergyVisual takes.
 *
 * Depth is carried by the projection itself: nodes nearer the camera get
 * a larger radius and a stronger fill, edges nearer the camera get a
 * heavier, darker stroke. That is what sells the perspective; without it
 * the shape reads as a flat spinning decal.
 *
 * prefers-reduced-motion → held at a single static pose, no loop.
 */

const PHI = (1 + Math.sqrt(5)) / 2;

// The classic φ construction: three orthogonal golden rectangles. Their
// corners are equidistant, so the same array yields both the nodes and,
// below, the edges.
const VERTICES: ReadonlyArray<readonly [number, number, number]> = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];

const EDGE_LENGTH = 2;
const CIRCUMRADIUS = Math.hypot(1, PHI);

// Derived rather than hand-listed, so the mesh stays correct if the
// vertex set ever changes.
const EDGES: ReadonlyArray<readonly [number, number]> = (() => {
  const found: Array<[number, number]> = [];
  for (let i = 0; i < VERTICES.length; i++) {
    for (let j = i + 1; j < VERTICES.length; j++) {
      const [ax, ay, az] = VERTICES[i];
      const [bx, by, bz] = VERTICES[j];
      if (Math.abs(Math.hypot(ax - bx, ay - by, az - bz) - EDGE_LENGTH) < 1e-6) {
        found.push([i, j]);
      }
    }
  }
  return found;
})();

interface PointLatticeProps {
  className?: string;
  /** Node and edge colour. Defaults to the brand blue. */
  color?: string;
  /** Seconds for one full turn about the vertical axis. */
  period?: number;
}

export function PointLattice({
  className,
  color = "#2563EB",
  period = 52,
}: PointLatticeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const edgeRefs = useRef<Array<SVGLineElement | null>>([]);
  const nodeRefs = useRef<Array<SVGCircleElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const box = svg.viewBox.baseVal;
    const cx = box.width / 2;
    const cy = box.height / 2;
    const cameraDistance = 3.4;

    // How far the solid can spread on screen, as a multiple of the
    // circumradius — a vertex's projection runs away as it nears the
    // camera. Sizing from this keeps the near pole inside the viewBox;
    // without it the shape gets guillotined by the SVG's own clip.
    const spread =
      (CIRCUMRADIUS * cameraDistance) /
      Math.sqrt(cameraDistance * cameraDistance - CIRCUMRADIUS * CIRCUMRADIUS);
    const radius = ((Math.min(box.width, box.height) / 2) * 0.92) / spread;

    // Flat buffer of screenX / screenY / depth per vertex, reused every
    // frame so the loop allocates nothing.
    const projected = new Float64Array(VERTICES.length * 3);

    let frame = 0;
    let origin = 0;

    const paint = (time: number) => {
      if (!origin) origin = time;
      const elapsed = (time - origin) / 1000;

      // One slow turn about Y plus a gentle nod on X, so the silhouette
      // keeps changing instead of reading as a flat spinning plate.
      const yaw = reducedMotion ? 0.6 : 0.6 + (elapsed / period) * Math.PI * 2;
      const pitch = reducedMotion ? -0.2 : -0.2 + Math.sin(elapsed / 13) * 0.2;

      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      for (let i = 0; i < VERTICES.length; i++) {
        const [x, y, z] = VERTICES[i];

        const xYaw = x * cosYaw + z * sinYaw;
        const zYaw = -x * sinYaw + z * cosYaw;
        const yPitch = y * cosPitch - zYaw * sinPitch;
        const zPitch = y * sinPitch + zYaw * cosPitch;

        // Weak perspective: nearer vertices splay outward and away from
        // the centre, which is what gives the shape its solidity.
        const scale = cameraDistance / (cameraDistance + zPitch);
        const screenX = cx + xYaw * scale * radius;
        const screenY = cy + yPitch * scale * radius;
        // 0 at the far pole, 1 at the near pole.
        const depth = (1 - zPitch / CIRCUMRADIUS) / 2;

        const node = nodeRefs.current[i];
        if (node) {
          node.setAttribute("cx", screenX.toFixed(1));
          node.setAttribute("cy", screenY.toFixed(1));
          node.setAttribute("r", (1.4 + depth * 3.6).toFixed(2));
          node.setAttribute("fill-opacity", (0.16 + depth * 0.66).toFixed(3));
        }

        projected[i * 3] = screenX;
        projected[i * 3 + 1] = screenY;
        projected[i * 3 + 2] = depth;
      }

      for (let i = 0; i < EDGES.length; i++) {
        const edge = edgeRefs.current[i];
        if (!edge) continue;
        const [a, b] = EDGES[i];

        edge.setAttribute("x1", projected[a * 3].toFixed(1));
        edge.setAttribute("y1", projected[a * 3 + 1].toFixed(1));
        edge.setAttribute("x2", projected[b * 3].toFixed(1));
        edge.setAttribute("y2", projected[b * 3 + 1].toFixed(1));

        const depth = (projected[a * 3 + 2] + projected[b * 3 + 2]) / 2;
        edge.setAttribute("stroke-opacity", (0.07 + depth * 0.3).toFixed(3));
        edge.setAttribute("stroke-width", (0.9 + depth * 2.4).toFixed(2));
      }

      if (!reducedMotion) frame = requestAnimationFrame(paint);
    };

    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, [period, reducedMotion]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={className}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      <g stroke={color} strokeLinecap="round">
        {EDGES.map((_, i) => (
          <line
            key={i}
            ref={(element) => {
              edgeRefs.current[i] = element;
            }}
          />
        ))}
      </g>
      <g fill={color}>
        {VERTICES.map((_, i) => (
          <circle
            key={i}
            ref={(element) => {
              nodeRefs.current[i] = element;
            }}
          />
        ))}
      </g>
    </svg>
  );
}
