import { useRef, useEffect, useState } from "react";

/**
 * Aurora wave divider replacing static hairline dividers.
 * Animated SVG wave with aurora gradient stroke that wobbles on scroll.
 */
export function SectionTransition() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrollOffset(window.scrollY * 0.002);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate wave continuously
  useEffect(() => {
    let running = true;
    let t = 0;

    const animate = () => {
      if (!running || !pathRef.current) return;
      t += 0.015;

      const w = 1200;
      const amp = 6 + Math.sin(scrollOffset) * 3;
      const freq = 0.008;
      const points: string[] = [`M 0 20`];

      for (let x = 0; x <= w; x += 20) {
        const y =
          20 +
          Math.sin(x * freq + t) * amp +
          Math.sin(x * freq * 1.7 + t * 1.3) * (amp * 0.4) +
          Math.cos(x * freq * 0.5 + t * 0.7 + scrollOffset) * (amp * 0.3);
        points.push(`L ${x} ${y.toFixed(2)}`);
      }

      pathRef.current.setAttribute("d", points.join(" "));
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => {
      running = false;
    };
  }, [scrollOffset]);

  return (
    <div className="relative w-full h-10 overflow-hidden" aria-hidden="true">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="aurora-wave-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="hsl(var(--aurora-green))" stopOpacity="0.4" />
            <stop offset="35%" stopColor="hsl(var(--aurora-teal))" stopOpacity="0.7" />
            <stop offset="50%" stopColor="hsl(var(--aurora-cyan))" stopOpacity="0.9" />
            <stop offset="70%" stopColor="hsl(var(--aurora-violet))" stopOpacity="0.6" />
            <stop offset="85%" stopColor="hsl(var(--aurora-magenta))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="aurora-wave-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={pathRef}
          d="M 0 20 L 1200 20"
          fill="none"
          stroke="url(#aurora-wave-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#aurora-wave-glow)"
        />
      </svg>
    </div>
  );
}
