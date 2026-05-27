import type { NebulaArchetype } from "@/data/projects";

export const ARCHETYPE_ID: Record<NebulaArchetype, number> = {
  pillar: 0,
  ring: 1,
  supernova: 2,
  ionStorm: 3,
  molecular: 4,
  binary: 5,
  protoplanetary: 6,
  darkNebula: 7,
};

export type HaloShape = "spherical" | "disk" | "shell" | "column" | "fragmented";

export interface ArchetypeProfile {
  haloShape: HaloShape;
  haloRadius: number;          // outer particle halo radius (multiplier on nebula.scale)
  haloSizeMin: number;
  haloSizeMax: number;
  motion: "drift" | "turbulent" | "orbital" | "explosive";
  baseAlpha: number;           // shader quad alpha multiplier
  particleMultiplier: number;  // relative to tier baseline
}

export const ARCHETYPES: Record<NebulaArchetype, ArchetypeProfile> = {
  pillar: {
    haloShape: "column",
    haloRadius: 1.6,
    haloSizeMin: 0.015,
    haloSizeMax: 0.045,
    motion: "drift",
    baseAlpha: 0.9,
    particleMultiplier: 1.0,
  },
  ring: {
    haloShape: "shell",
    haloRadius: 1.9,
    haloSizeMin: 0.012,
    haloSizeMax: 0.04,
    motion: "orbital",
    baseAlpha: 1.0,
    particleMultiplier: 1.2,
  },
  supernova: {
    haloShape: "fragmented",
    haloRadius: 2.2,
    haloSizeMin: 0.01,
    haloSizeMax: 0.05,
    motion: "explosive",
    baseAlpha: 1.0,
    particleMultiplier: 1.3,
  },
  ionStorm: {
    haloShape: "spherical",
    haloRadius: 1.7,
    haloSizeMin: 0.01,
    haloSizeMax: 0.035,
    motion: "turbulent",
    baseAlpha: 0.85,
    particleMultiplier: 1.1,
  },
  molecular: {
    haloShape: "spherical",
    haloRadius: 1.8,
    haloSizeMin: 0.02,
    haloSizeMax: 0.06,
    motion: "drift",
    baseAlpha: 0.75,
    particleMultiplier: 0.9,
  },
  binary: {
    haloShape: "disk",
    haloRadius: 1.6,
    haloSizeMin: 0.012,
    haloSizeMax: 0.04,
    motion: "orbital",
    baseAlpha: 0.95,
    particleMultiplier: 1.0,
  },
  protoplanetary: {
    haloShape: "disk",
    haloRadius: 1.7,
    haloSizeMin: 0.01,
    haloSizeMax: 0.038,
    motion: "orbital",
    baseAlpha: 0.9,
    particleMultiplier: 1.0,
  },
  darkNebula: {
    haloShape: "spherical",
    haloRadius: 1.9,
    haloSizeMin: 0.015,
    haloSizeMax: 0.05,
    motion: "drift",
    baseAlpha: 0.7,
    particleMultiplier: 0.85,
  },
};

/**
 * Sample a position inside the halo of a given archetype, normalized to unit scale
 * (halo radius applied by caller via nebula.scale). Returns local-space [x,y,z].
 */
export function sampleHaloPoint(
  shape: HaloShape,
  rng: () => number,
): [number, number, number] {
  switch (shape) {
    case "spherical": {
      const u = rng() * 2 - 1;
      const phi = rng() * Math.PI * 2;
      const r = Math.pow(rng(), 0.55); // density toward center
      const s = Math.sqrt(1 - u * u);
      return [r * s * Math.cos(phi), r * u, r * s * Math.sin(phi)];
    }
    case "disk": {
      const phi = rng() * Math.PI * 2;
      const r = Math.pow(rng(), 0.6);
      const y = (rng() - 0.5) * 0.18;
      return [r * Math.cos(phi), y, r * Math.sin(phi)];
    }
    case "shell": {
      const u = rng() * 2 - 1;
      const phi = rng() * Math.PI * 2;
      const r = 0.85 + (rng() - 0.5) * 0.2;
      const s = Math.sqrt(1 - u * u);
      return [r * s * Math.cos(phi), r * u * 0.3, r * s * Math.sin(phi)];
    }
    case "column": {
      const phi = rng() * Math.PI * 2;
      const r = Math.pow(rng(), 0.7) * 0.5;
      const y = (rng() - 0.3) * 1.6;
      return [r * Math.cos(phi), y, r * Math.sin(phi)];
    }
    case "fragmented": {
      const u = rng() * 2 - 1;
      const phi = rng() * Math.PI * 2;
      // Spiky distribution — many close, some far
      const r = Math.pow(rng(), 0.35);
      const s = Math.sqrt(1 - u * u);
      const jitter = (rng() - 0.5) * 0.3;
      return [
        r * s * Math.cos(phi) + jitter,
        r * u + jitter * 0.5,
        r * s * Math.sin(phi) + jitter,
      ];
    }
  }
}

// Cheap seeded PRNG (Mulberry32) for deterministic sampling per project id.
export function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
