import { useEffect, useRef } from "react";
import { usePhysicsParallaxContext } from "@/physics/PhysicsParallaxProvider";
import { useAurora } from "@/aurora/AuroraProvider";

const SHAPES = [
  { type: "triangle", size: 18, colorVar: "--aurora-green" },
  { type: "circle", size: 14, colorVar: "--aurora-teal" },
  { type: "hexagon", size: 16, colorVar: "--aurora-cyan" },
  { type: "triangle", size: 12, colorVar: "--aurora-violet" },
  { type: "diamond", size: 15, colorVar: "--aurora-magenta" },
  { type: "circle", size: 10, colorVar: "--aurora-blue" },
  { type: "hexagon", size: 13, colorVar: "--aurora-pink" },
  { type: "diamond", size: 11, colorVar: "--aurora-green" },
];

function ShapeSVG({ type, size }: { type: string; size: number }) {
  const s = size;
  switch (type) {
    case "triangle":
      return (
        <polygon
          points={`${s},0 ${s * 2},${s * 1.7} 0,${s * 1.7}`}
          fill="currentColor"
        />
      );
    case "circle":
      return <circle cx={s} cy={s} r={s} fill="currentColor" />;
    case "hexagon": {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        return `${s + s * Math.cos(angle)},${s + s * Math.sin(angle)}`;
      }).join(" ");
      return <polygon points={pts} fill="currentColor" />;
    }
    case "diamond":
      return (
        <polygon
          points={`${s},0 ${s * 2},${s} ${s},${s * 2} 0,${s}`}
          fill="currentColor"
        />
      );
    default:
      return <circle cx={s} cy={s} r={s} fill="currentColor" />;
  }
}

/**
 * Floating geometric shapes driven by Cannon.js physics parallax.
 * Positioned absolutely within the About section.
 */
export function AboutPhysicsElements() {
  const { getTransform } = usePhysicsParallaxContext();
  const { config } = useAurora();
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const count = Math.min(SHAPES.length, config.physicsFloatBodies);

  // Update transforms via rAF (physics provider ticks via coordinator)
  useEffect(() => {
    if (count === 0) return;
    let running = true;

    const update = () => {
      if (!running) return;
      elementsRef.current.forEach((el, i) => {
        if (el) {
          el.style.transform = getTransform(i);
        }
      });
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);

    return () => {
      running = false;
    };
  }, [getTransform, count]);

  if (count === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {SHAPES.slice(0, count).map((shape, i) => (
        <div
          key={i}
          ref={(el) => {
            elementsRef.current[i] = el;
          }}
          className="absolute opacity-15 will-change-transform"
          style={{
            color: `hsl(var(${shape.colorVar}))`,
            left: `${10 + (i * 80) / count}%`,
            top: `${15 + ((i * 37) % 70)}%`,
          }}
        >
          <svg
            width={shape.size * 2}
            height={shape.size * 2}
            viewBox={`0 0 ${shape.size * 2} ${shape.size * 2}`}
          >
            <ShapeSVG type={shape.type} size={shape.size} />
          </svg>
        </div>
      ))}
    </div>
  );
}
