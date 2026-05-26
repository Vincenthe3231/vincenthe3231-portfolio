import { createContext, useContext, useEffect, useMemo } from "react";
import { usePhysicsParallax } from "./usePhysicsParallax";
import { useAurora } from "@/aurora/AuroraProvider";
import { CannonBodyState } from "./useCannonWorld";

interface PhysicsParallaxContextValue {
  getTransform: (index: number) => string;
  getState: (index: number) => CannonBodyState | null;
}

const PhysicsParallaxContext =
  createContext<PhysicsParallaxContextValue | null>(null);

export function PhysicsParallaxProvider({
  bodyCount = 8,
  children,
}: {
  bodyCount?: number;
  children: React.ReactNode;
}) {
  const { registerEngine, config } = useAurora();
  const isDisabled = config.physicsFloatBodies === 0;

  const { tick, getTransform, getState } = usePhysicsParallax(
    isDisabled ? 0 : bodyCount
  );

  // Register physics tick with engine coordinator
  useEffect(() => {
    if (isDisabled) return;
    const unregister = registerEngine("physics-parallax", (_time, delta) => {
      tick(delta);
    });
    return unregister;
  }, [registerEngine, tick, isDisabled]);

  const value = useMemo(
    () => ({ getTransform, getState }),
    [getTransform, getState]
  );

  return (
    <PhysicsParallaxContext.Provider value={value}>
      {children}
    </PhysicsParallaxContext.Provider>
  );
}

export function usePhysicsParallaxContext() {
  const ctx = useContext(PhysicsParallaxContext);
  if (!ctx)
    throw new Error(
      "usePhysicsParallaxContext must be used within PhysicsParallaxProvider"
    );
  return ctx;
}
