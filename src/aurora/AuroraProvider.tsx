import { createContext, useContext, useMemo } from "react";
import { useAuroraUniforms, AuroraUniforms } from "./useAuroraUniforms";
import { useEngineCoordinator } from "./useEngineCoordinator";
import { useIntersectionPause, SectionVisibility } from "./useIntersectionPause";
import {
  detectPerformanceTier,
  TIER_CONFIG,
  PerformanceTier,
  TierConfig,
} from "@/lib/performanceTier";

interface AuroraContextValue {
  uniforms: React.MutableRefObject<AuroraUniforms>;
  tickUniforms: (deltaMs: number) => void;
  registerEngine: (id: string, cb: (time: number, delta: number) => void) => () => void;
  registerSection: (
    name: keyof SectionVisibility,
    el: HTMLElement | null
  ) => void;
  visibility: SectionVisibility;
  computeAuroraIntensity: () => number;
  tier: PerformanceTier;
  config: TierConfig;
}

const AuroraContext = createContext<AuroraContextValue | null>(null);

export function AuroraProvider({ children }: { children: React.ReactNode }) {
  const { uniforms, tick: tickUniforms } = useAuroraUniforms();
  const { register: registerEngine } = useEngineCoordinator();
  const { visibility, registerSection, computeAuroraIntensity } =
    useIntersectionPause();

  const tier = useMemo(() => detectPerformanceTier(), []);
  const config = useMemo(() => TIER_CONFIG[tier], [tier]);

  const value = useMemo<AuroraContextValue>(
    () => ({
      uniforms,
      tickUniforms,
      registerEngine,
      registerSection,
      visibility,
      computeAuroraIntensity,
      tier,
      config,
    }),
    [
      uniforms,
      tickUniforms,
      registerEngine,
      registerSection,
      visibility,
      computeAuroraIntensity,
      tier,
      config,
    ]
  );

  return (
    <AuroraContext.Provider value={value}>{children}</AuroraContext.Provider>
  );
}

export function useAurora() {
  const ctx = useContext(AuroraContext);
  if (!ctx) throw new Error("useAurora must be used within AuroraProvider");
  return ctx;
}
