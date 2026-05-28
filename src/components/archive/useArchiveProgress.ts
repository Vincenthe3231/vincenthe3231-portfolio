import { useEffect, useRef } from "react";

export interface ArchiveProgress {
  /** Section scroll progress 0..1 (clamped). */
  raw: number;
  /** Total pages to turn (one per entry + 1 cover). */
  total: number;
  /** Continuous turn value 0..total. Floor = current page index, frac = turn progress. */
  turn: number;
}

/**
 * Maps document scroll position across a target section element to a continuous
 * page-turn value. Updates via rAF-driven scroll listener, written into a ref —
 * no React re-renders.
 */
export function useArchiveProgress(
  sectionRef: React.RefObject<HTMLElement>,
  totalPages: number,
): React.MutableRefObject<ArchiveProgress> {
  const progressRef = useRef<ArchiveProgress>({ raw: 0, total: totalPages, turn: 0 });

  useEffect(() => {
    let frameId = 0;
    const compute = () => {
      const el = sectionRef.current;
      if (!el) {
        frameId = 0;
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Section progress: 0 when top enters viewport bottom, 1 when bottom leaves viewport top
      const total = rect.height - vh;
      const raw = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
      progressRef.current.raw = raw;
      // Skip the first 5% so the book is visible before any turn starts;
      // last 5% lets the back-cover settle
      const active = Math.max(0, Math.min(1, (raw - 0.05) / 0.9));
      progressRef.current.turn = active * totalPages;
      frameId = 0;
    };
    const schedule = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(compute);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [sectionRef, totalPages]);

  return progressRef;
}
