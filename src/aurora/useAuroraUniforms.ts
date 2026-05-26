import { useRef, useEffect, useCallback } from "react";

export interface AuroraUniforms {
  time: number;
  scroll: number;
  mouseX: number;
  mouseY: number;
  viewportWidth: number;
  viewportHeight: number;
  sectionIntensity: number;
}

/**
 * Shared uniform values for all aurora engines.
 * Updated every frame via refs (no React re-renders).
 */
export function useAuroraUniforms() {
  const uniforms = useRef<AuroraUniforms>({
    time: 0,
    scroll: 0,
    mouseX: 0,
    mouseY: 0,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    sectionIntensity: 0.8,
  });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      uniforms.current.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      uniforms.current.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      uniforms.current.scroll = totalHeight > 0 ? window.scrollY / totalHeight : 0;
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
  }, []);

  return { uniforms, tick };
}
