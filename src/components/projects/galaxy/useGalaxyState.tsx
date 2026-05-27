import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface GalaxyState {
  hoveredId: string | null;
  focusedId: string | null;
  yawIntent: number;     // accumulated drag yaw (radians)
  dollyIntent: number;   // radial offset added by wheel
  setHovered: (id: string | null) => void;
  setFocused: (id: string | null) => void;
  addYaw: (delta: number) => void;
  setYaw: (v: number) => void;
  addDolly: (delta: number) => void;
}

const Ctx = createContext<GalaxyState | null>(null);

export function GalaxyStateProvider({ children }: { children: ReactNode }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [yawIntent, setYawIntent] = useState(0);
  const [dollyIntent, setDollyIntent] = useState(0);

  const setHovered = useCallback((id: string | null) => setHoveredId(id), []);
  const setFocused = useCallback((id: string | null) => setFocusedId(id), []);
  const addYaw = useCallback((delta: number) => setYawIntent((y) => y + delta), []);
  const setYaw = useCallback((v: number) => setYawIntent(v), []);
  const addDolly = useCallback(
    (delta: number) => setDollyIntent((d) => Math.max(-8, Math.min(18, d + delta))),
    [],
  );

  const value = useMemo<GalaxyState>(
    () => ({ hoveredId, focusedId, yawIntent, dollyIntent, setHovered, setFocused, addYaw, setYaw, addDolly }),
    [hoveredId, focusedId, yawIntent, dollyIntent, setHovered, setFocused, addYaw, setYaw, addDolly],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGalaxyState(): GalaxyState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGalaxyState must be used within GalaxyStateProvider");
  return v;
}
