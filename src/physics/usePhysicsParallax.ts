import { useRef, useCallback, useEffect } from "react";
import * as CANNON from "cannon-es";
import { useCannonWorld, CannonBodyState } from "./useCannonWorld";

/**
 * Maps scroll velocity + mouse position → Cannon.js forces.
 * Returns body positions as CSS-ready transforms.
 * Dramatic physics: 6.7x force increase + mouse repulsion.
 */
export function usePhysicsParallax(bodyCount: number = 8) {
  const { states, step, applyForce, setSleeping, bodiesRef } = useCannonWorld({
    gravity: [0, 0, 0],
    bodyCount,
  });

  const lastScrollY = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });

  // Track mouse position for proximity repulsion
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      // Convert to physics world coords (centered, ~±400px range)
      mousePos.current.x = (e.clientX - window.innerWidth / 2) * 0.8;
      mousePos.current.y = -(e.clientY - window.innerHeight / 2) * 0.4;
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  /** Call every frame w/ delta in ms */
  const tick = useCallback(
    (deltaMs: number) => {
      // Compute scroll velocity
      const scrollY = window.scrollY;
      const scrollVelocity = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      // Apply scroll-based force — DRAMATIC (6.7x increase from v1)
      if (Math.abs(scrollVelocity) > 0.5) {
        applyForce(scrollVelocity * 2.0, -scrollVelocity * 1.0);
      }

      // Mouse proximity repulsion — shapes flee from cursor
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const bodies = bodiesRef.current;
      states.current.forEach((s, i) => {
        const dx = s.x - mx;
        const dy = s.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 1 && bodies[i]) {
          const force = (200 - dist) * 0.02;
          const nx = dx / dist;
          const ny = dy / dist;
          bodies[i].applyForce(new CANNON.Vec3(nx * force, ny * force, 0));
          bodies[i].wakeUp();
        }
      });

      step(deltaMs);
    },
    [applyForce, step, states, bodiesRef]
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
