import { useEffect, useRef, useCallback } from "react";
import { useMatterEngine } from "@/physics/useMatterEngine";
import { useAurora } from "@/aurora/AuroraProvider";

interface TimelinePhysicsSpineProps {
  /** Total height of the timeline container in px */
  height: number;
  /** Number of timeline entries (node count) */
  nodeCount: number;
}

/**
 * Matter.js chain spine for the timeline.
 * Replaces static CSS gradient line with physics-driven SVG path.
 * Chain sways on scroll velocity.
 */
export function TimelinePhysicsSpine({
  height,
  nodeCount,
}: TimelinePhysicsSpineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { registerEngine, config } = useAurora();

  const chainLength = config.physicsChainBodies || 12;
  const segmentLength = height / (chainLength - 1) || 40;

  const { states, step, applyLateralForce, setSleeping } = useMatterEngine({
    chainLength,
    segmentLength,
    pinEnds: true,
    centerX: 0,
    startY: 0,
  });

  const lastScrollY = useRef(window.scrollY);

  // Register with engine coordinator
  useEffect(() => {
    if (chainLength === 0) return;

    const unregister = registerEngine("timeline-spine", (_time, delta) => {
      // Scroll velocity → lateral force
      const scrollY = window.scrollY;
      const velocity = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      if (Math.abs(velocity) > 1) {
        applyLateralForce(velocity * 0.8);
      }

      step(delta);

      // Update SVG path from chain body positions
      if (pathRef.current && states.current.length > 1) {
        const pts = states.current;
        let d = `M ${pts[0].x} ${pts[0].y}`;

        // Smooth cubic bezier through all points
        for (let i = 1; i < pts.length; i++) {
          const prev = pts[i - 1];
          const curr = pts[i];
          const cpY = (prev.y + curr.y) / 2;
          d += ` C ${prev.x} ${cpY}, ${curr.x} ${cpY}, ${curr.x} ${curr.y}`;
        }

        pathRef.current.setAttribute("d", d);
      }
    });

    return unregister;
  }, [registerEngine, step, applyLateralForce, states, chainLength]);

  if (chainLength === 0) {
    // Fallback: static gradient line (low tier)
    return (
      <div
        aria-hidden
        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/15 to-transparent md:-translate-x-1/2"
      />
    );
  }

  return (
    <svg
      ref={svgRef}
      className="absolute left-4 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 overflow-visible"
      width="2"
      height={height}
      viewBox={`-60 0 120 ${height}`}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="aurora-spine-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="15%" stopColor="hsl(var(--aurora-green))" stopOpacity="0.6" />
          <stop offset="35%" stopColor="hsl(var(--aurora-teal))" stopOpacity="0.8" />
          <stop offset="50%" stopColor="hsl(var(--aurora-cyan))" stopOpacity="1" />
          <stop offset="70%" stopColor="hsl(var(--aurora-violet))" stopOpacity="0.7" />
          <stop offset="85%" stopColor="hsl(var(--aurora-magenta))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={`M 0 0 L 0 ${height}`}
        fill="none"
        stroke="url(#aurora-spine-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
