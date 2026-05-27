import { useRef, useEffect, useCallback } from "react";

export interface AuroraUniforms {
  time: number;
  scroll: number;
  smoothScroll: number;
  scrollPixels: number;
  mouseX: number;
  mouseY: number;
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
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    sectionIntensity: 0.8,
    sceneMode: 0,
  });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      uniforms.current.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      uniforms.current.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      uniforms.current.scroll = totalHeight > 0 ? window.scrollY / totalHeight : 0;
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

    // Scene mode: 0 (hero/aurora) → 1 (deep space). smoothstep over scroll fraction.
    const s = uniforms.current.scroll;
    const t = Math.max(0, Math.min(1, (s - 0.05) / (0.35 - 0.05)));
    const sceneTarget = t * t * (3 - 2 * t);
    uniforms.current.sceneMode +=
      (sceneTarget - uniforms.current.sceneMode) * 0.06;
  }, []);

  return { uniforms, tick };
}
