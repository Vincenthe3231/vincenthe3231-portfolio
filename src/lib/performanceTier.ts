export type PerformanceTier = "high" | "medium" | "low";

let cachedTier: PerformanceTier | null = null;

export function detectPerformanceTier(): PerformanceTier {
  if (cachedTier) return cachedTier;

  // Mobile devices → low
  if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    cachedTier = "low";
    return cachedTier;
  }

  // Prefer reduced motion → low
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cachedTier = "low";
    return cachedTier;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      cachedTier = "low";
      return cachedTier;
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : "";

    // Known low-end GPUs
    if (/Intel|HD Graphics|UHD Graphics|Mali-[TG]|Adreno [1-5]/i.test(renderer)) {
      cachedTier = "low";
    }
    // Known high-end GPUs
    else if (/Apple GPU|M[1-4]|RTX|RX [5-7]|GTX 1[6-9]|GTX 20|Arc A/i.test(renderer)) {
      cachedTier = "high";
    } else {
      cachedTier = "medium";
    }

    // Cleanup
    const ext = gl.getExtension("WEBGL_lose_context");
    ext?.loseContext();
  } catch {
    cachedTier = "medium";
  }

  return cachedTier;
}

/** Performance config per tier */
export const TIER_CONFIG = {
  high: {
    auroraOctaves: 4,
    pixiCaustics: "full" as const,
    babylonMaterials: "pbr" as const,
    physicsChainBodies: 20,
    physicsFloatBodies: 14,
    refractionResolution: 512,
    particleCount: 1800,
    crystalCount: 6,
    starCount: 3000,
    ribbonCount: 4,
    terrainSegments: 128,
    treeCount: 60,
    nebulaCount: 4,
    spaceStarCount: 4500,
    galaxy: {
      coreStars: 3000,
      armDensity: 8000,
      nebulaParticles: 1200,
      dustQuads: 8,
      postFx: true,
      shaderOctaves: 4,
      dpr: [1, 2] as [number, number],
    },
  },
  medium: {
    auroraOctaves: 3,
    pixiCaustics: "sprites" as const,
    babylonMaterials: "basic" as const,
    physicsChainBodies: 12,
    physicsFloatBodies: 8,
    refractionResolution: 256,
    particleCount: 1200,
    crystalCount: 4,
    starCount: 1500,
    ribbonCount: 3,
    terrainSegments: 64,
    treeCount: 30,
    nebulaCount: 3,
    spaceStarCount: 2200,
    galaxy: {
      coreStars: 1500,
      armDensity: 4000,
      nebulaParticles: 600,
      dustQuads: 5,
      postFx: true,
      shaderOctaves: 3,
      dpr: [1, 1.5] as [number, number],
    },
  },
  low: {
    auroraOctaves: 2,
    pixiCaustics: "disabled" as const,
    babylonMaterials: "static" as const,
    physicsChainBodies: 0,
    physicsFloatBodies: 0,
    refractionResolution: 0,
    particleCount: 600,
    crystalCount: 2,
    starCount: 500,
    ribbonCount: 2,
    terrainSegments: 32,
    treeCount: 0,
    nebulaCount: 1,
    spaceStarCount: 800,
    galaxy: {
      coreStars: 800,
      armDensity: 2000,
      nebulaParticles: 250,
      dustQuads: 3,
      postFx: false,
      shaderOctaves: 2,
      dpr: [0.75, 1] as [number, number],
    },
  },
} as const;

export type TierConfig = (typeof TIER_CONFIG)[PerformanceTier];
