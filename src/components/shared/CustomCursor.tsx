import { useEffect, useState } from "react";
import useCanvasCursor from "@/hooks/use-canvasCursor";

/**
 * Canvas-rendered cursor: a single visible dot with a dynamically
 * hue-shifting rainbow trail. Hidden on touch / non-hover devices.
 */
export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useCanvasCursor(enabled);

  if (!enabled) return null;

  return (
    <canvas
      id="canvas"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
};
