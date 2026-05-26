import { useRef, useEffect, useState, useCallback } from "react";

export interface SectionVisibility {
  hero: number;
  about: number;
  projects: number;
  skills: number;
  lessons: number;
  timeline: number;
  footer: number;
}

const DEFAULT_VISIBILITY: SectionVisibility = {
  hero: 1,
  about: 0,
  projects: 0,
  skills: 0,
  lessons: 0,
  timeline: 0,
  footer: 0,
};

/** Aurora intensity per section (Skills = 0 to preserve constellation) */
export const SECTION_AURORA_INTENSITY: Record<keyof SectionVisibility, number> = {
  hero: 0.8,
  about: 0.5,
  projects: 0.6,
  skills: 0.0,
  lessons: 0.5,
  timeline: 0.6,
  footer: 0.9,
};

/**
 * Track visibility ratio of each section via IntersectionObserver.
 * Returns current visibility map + computed aurora intensity.
 */
export function useIntersectionPause() {
  const refs = useRef<Map<keyof SectionVisibility, HTMLElement>>(new Map());
  const [visibility, setVisibility] = useState<SectionVisibility>(DEFAULT_VISIBILITY);

  const registerSection = useCallback(
    (name: keyof SectionVisibility, element: HTMLElement | null) => {
      if (element) {
        refs.current.set(name, element);
      } else {
        refs.current.delete(name);
      }
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibility((prev) => {
          const next = { ...prev };
          entries.forEach((entry) => {
            const name = (entry.target as HTMLElement).dataset
              .auroraSection as keyof SectionVisibility;
            if (name) {
              next[name] = entry.intersectionRatio;
            }
          });
          return next;
        });
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );

    // Observe all registered sections
    const interval = setInterval(() => {
      refs.current.forEach((el) => observer.observe(el));
      if (refs.current.size > 0) clearInterval(interval);
    }, 100);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Compute weighted aurora intensity from visible sections
  const computeAuroraIntensity = useCallback((): number => {
    let totalWeight = 0;
    let weightedIntensity = 0;
    (Object.keys(visibility) as (keyof SectionVisibility)[]).forEach((key) => {
      const vis = visibility[key];
      if (vis > 0.05) {
        totalWeight += vis;
        weightedIntensity += vis * SECTION_AURORA_INTENSITY[key];
      }
    });
    return totalWeight > 0 ? weightedIntensity / totalWeight : 0.5;
  }, [visibility]);

  return { visibility, registerSection, computeAuroraIntensity };
}
