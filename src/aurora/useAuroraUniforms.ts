import { useRef, useEffect, useCallback } from "react";

export interface AuroraUniforms {
  time: number;
  scroll: number;
  smoothScroll: number;
  scrollPixels: number;
  mouseX: number;
  mouseY: number;
  /** Lerped delta-per-frame of mouse, clamped. Drives shader wake. */
  mouseVelocityX: number;
  mouseVelocityY: number;
  /** Lerped scroll fraction velocity, clamped. Drives shader smear. */
  scrollVelocity: number;
  viewportWidth: number;
  viewportHeight: number;
  sectionIntensity: number;
  /** 0 = aurora/hero, 1 = deep space (lerped from scroll past hero) */
  sceneMode: number;
}

/**
 * Shared uniform values for all aurora engines.
 * Updated every frame via refs (no React re-renders).
 * Includes lerped smooth scroll for buttery parallax.
 */
export function useAuroraUniforms() {
  const uniforms = useRef<AuroraUniforms>({
    time: 0,
    scroll: 0,
    smoothScroll: 0,
    scrollPixels: 0,
    mouseX: 0,
    mouseY: 0,
    mouseVelocityX: 0,
    mouseVelocityY: 0,
    scrollVelocity: 0,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    sectionIntensity: 0.8,
    sceneMode: 0,
  });

  // Raw deltas captured from events; lerped into uniforms in tick().
  const rawDelta = useRef({ mx: 0, my: 0, scroll: 0, lastMx: 0, lastMy: 0, lastScroll: 0 });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      // Accumulate raw delta since last tick; clamp to keep wake gentle
      rawDelta.current.mx += Math.max(-0.4, Math.min(0.4, nx - rawDelta.current.lastMx));
      rawDelta.current.my += Math.max(-0.4, Math.min(0.4, ny - rawDelta.current.lastMy));
      rawDelta.current.lastMx = nx;
      rawDelta.current.lastMy = ny;
      uniforms.current.mouseX = nx;
      uniforms.current.mouseY = ny;
    };
    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const s = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      rawDelta.current.scroll += Math.max(-0.2, Math.min(0.2, s - rawDelta.current.lastScroll));
      rawDelta.current.lastScroll = s;
      uniforms.current.scroll = s;
      uniforms.current.scrollPixels = window.scrollY;
    };
    const onResize = () => {
      uniforms.current.viewportWidth = window.innerWidth;
      uniforms.current.viewportHeight = window.innerHeight;
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const tick = useCallback((deltaMs: number) => {
    uniforms.current.time += deltaMs * 0.001;
    // Smooth scroll lerp (buttery parallax)
    const target = uniforms.current.scroll;
    uniforms.current.smoothScroll +=
      (target - uniforms.current.smoothScroll) * 0.08;

    // Mouse velocity wake: lerp accumulated raw delta toward 0
    const mvTargetX = rawDelta.current.mx;
    const mvTargetY = rawDelta.current.my;
    uniforms.current.mouseVelocityX +=
      (mvTargetX - uniforms.current.mouseVelocityX) * 0.04;
    uniforms.current.mouseVelocityY +=
      (mvTargetY - uniforms.current.mouseVelocityY) * 0.04;
    // Decay raw accumulator so the wake fades
    rawDelta.current.mx *= 0.92;
    rawDelta.current.my *= 0.92;

    // Scroll velocity smear
    const svTarget = rawDelta.current.scroll;
    uniforms.current.scrollVelocity +=
      (svTarget - uniforms.current.scrollVelocity) * 0.05;
    rawDelta.current.scroll *= 0.88;

    // Scene mode: 0 (hero/aurora) → 1 (deep space). smoothstep over scroll fraction.
    const s = uniforms.current.scroll;
    const t = Math.max(0, Math.min(1, (s - 0.05) / (0.35 - 0.05)));
    const sceneTarget = t * t * (3 - 2 * t);
    uniforms.current.sceneMode +=
      (sceneTarget - uniforms.current.sceneMode) * 0.06;
  }, []);

  return { uniforms, tick };
}
