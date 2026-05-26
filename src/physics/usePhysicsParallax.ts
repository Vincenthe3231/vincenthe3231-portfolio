import { useRef, useCallback } from "react";
import { useCannonWorld, CannonBodyState } from "./useCannonWorld";

/**
 * Maps scroll velocity + mouse position → Cannon.js forces.
 * Returns body positions as CSS-ready transforms.
 */
export function usePhysicsParallax(bodyCount: number = 8) {
  const { states, step, applyForce, setSleeping } = useCannonWorld({
    gravity: [0, 0, 0],
    bodyCount,
  });

  const lastScrollY = useRef(0);

  /** Call every frame w/ delta in ms */
  const tick = useCallback(
    (deltaMs: number) => {
      // Compute scroll velocity
      const scrollY = window.scrollY;
      const scrollVelocity = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      // Apply scroll-based force (lateral drift)
      if (Math.abs(scrollVelocity) > 0.5) {
        applyForce(scrollVelocity * 0.3, -scrollVelocity * 0.15);
      }

      step(deltaMs);
    },
    [applyForce, step]
  );

  /** Get CSS transform string for body at index */
  const getTransform = useCallback(
    (index: number): string => {
      const s = states.current[index];
      if (!s) return "translate3d(0px, 0px, 0px)";
      return `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, ${s.z.toFixed(1)}px)`;
    },
    [states]
  );

  /** Get raw state for body at index */
  const getState = useCallback(
    (index: number): CannonBodyState | null => {
      return states.current[index] || null;
    },
    [states]
  );

  return { tick, getTransform, getState, setSleeping, states };
}
