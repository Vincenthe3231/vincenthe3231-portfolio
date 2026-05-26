import { useRef, useEffect, useCallback } from "react";

type FrameCallback = (time: number, delta: number) => void;

/**
 * Single rAF loop coordinating all rendering engines.
 * R3F has its own loop but reads shared uniforms.
 * PixiJS + Babylon get explicit render calls from here.
 */
export function useEngineCoordinator() {
  const callbacks = useRef<Map<string, FrameCallback>>(new Map());
  const lastTime = useRef(0);
  const running = useRef(true);

  const register = useCallback((id: string, cb: FrameCallback) => {
    callbacks.current.set(id, cb);
    return () => {
      callbacks.current.delete(id);
    };
  }, []);

  useEffect(() => {
    running.current = true;
    lastTime.current = performance.now();

    const tick = (now: number) => {
      if (!running.current) return;
      const delta = Math.min(now - lastTime.current, 50); // cap at 50ms (20fps min)
      lastTime.current = now;

      callbacks.current.forEach((cb) => {
        try {
          cb(now, delta);
        } catch (e) {
          console.warn("[EngineCoordinator] callback error:", e);
        }
      });

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      running.current = false;
    };
  }, []);

  return { register };
}
