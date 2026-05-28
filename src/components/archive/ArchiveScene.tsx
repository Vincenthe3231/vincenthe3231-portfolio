import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, useRapier } from "@react-three/rapier";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { projects } from "@/data/projects";
import { HologramTablet, LessonEntry } from "./HologramTablet";
import { AmbientDebrisField } from "./AmbientDebrisField";
import { CameraRig } from "./CameraRig";

// ─── Accent palette ──────────────────────────────────────────────────────────
const ACCENT_PALETTE = [
  "#6FF9FF", "#8BE9FD", "#7AA2FF", "#B48CFF",
  "#6FF9FF", "#8BE9FD", "#7AA2FF", "#B48CFF",
];

const CLASSIFICATION_LABELS = [
  "LEVEL-01 ARCHITECTURE", "LEVEL-02 SYSTEM",
  "LEVEL-03 PATTERN",      "LEVEL-04 INSIGHT",
  "LEVEL-05 DECISION",     "LEVEL-06 BOUNDARY",
  "LEVEL-07 DISCIPLINE",   "LEVEL-08 PRODUCTION",
];

// ─── GPU tier detection ────────────────────────────────────────────────────
function detectTier(): "high" | "mid" | "low" {
  if (typeof navigator === "undefined") return "mid";
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return "low";
  const ext = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
  if (!ext) return "mid";
  const gpu = (gl as WebGLRenderingContext)
    .getParameter(ext.UNMASKED_RENDERER_WEBGL)
    .toLowerCase();
  if (/intel hd|intel uhd|mali-[gt][0-9]+|adreno [1-5]/.test(gpu)) return "low";
  if (/apple m[1-9]|rtx|rx [5-9]|radeon pro|quadro/.test(gpu)) return "high";
  return "mid";
}

// ─── ScrollForceEmitter ───────────────────────────────────────────────────
function ScrollForceEmitter({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { world } = useRapier();
  const prevScroll = useRef(0);
  const smooth     = useRef(0);

  useFrame(() => {
    const raw = scrollRef.current - prevScroll.current;
    prevScroll.current = scrollRef.current;

    smooth.current += (raw - smooth.current) * 0.1;
    const p = smooth.current * 0.2;
    if (Math.abs(p) < 0.000015) return;

    let idx = 0;
    world.bodies.forEach((body) => {
      if (!body.isDynamic()) return;
      const stagger = Math.max(0.25, 1.0 - idx * 0.1);
      body.applyImpulse(
        { x: 0, y: p * stagger * 0.12, z: p * stagger * 0.08 },
        true,
      );
      body.applyTorqueImpulse(
        { x: p * 0.0018, y: p * 0.001, z: p * 0.0012 },
        true,
      );
      idx++;
    });
  });

  return null;
}

// ─── Scene contents ────────────────────────────────────────────────────────
interface SceneProps {
  lessons:     LessonEntry[];
  scrollRef:   React.MutableRefObject<number>;
  mouseRef:    React.MutableRefObject<{ x: number; y: number }>;
  tier:        "high" | "mid";
  selectedId:  string | null;
  onSelect:    (id: string | null) => void;
}

function SceneInner({ lessons, scrollRef, mouseRef, tier, selectedId, onSelect }: SceneProps) {
  const particleCount = tier === "high" ? 1200 : 500;

  return (
    <>
      <fog attach="fog" args={["#050a10", 12, 36]} />
      <color attach="background" args={["#05070A"]} />

      <ambientLight intensity={0.035} color="#0a1520" />
      <directionalLight position={[-4, 6, 3]} intensity={0.07} color="#1e3050" />

      <CameraRig scrollRef={scrollRef} mouseRef={mouseRef} focusMode={!!selectedId} />

      {/* Transparent backdrop — click dismisses focused card */}
      {selectedId && (
        <mesh
          position={[0, 0, 1.0]}
          onClick={(e) => { e.stopPropagation(); onSelect(null); }}
          renderOrder={-1}
        >
          <planeGeometry args={[60, 60]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      <Suspense fallback={null}>
        <Physics gravity={[0, -0.02, 0]} timeStep="vary">
          <ScrollForceEmitter scrollRef={scrollRef} />
          {lessons.map((lesson) => (
            <HologramTablet
              key={lesson.id}
              lesson={lesson}
              selected={selectedId === lesson.id}
              anySelected={!!selectedId}
              onSelect={() => onSelect(selectedId === lesson.id ? null : lesson.id)}
            />
          ))}
        </Physics>
      </Suspense>

      <AmbientDebrisField count={particleCount} />

      {/* Bloom threshold raised to 0.90 — text luminance is <0.82, so never blooms */}
      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          intensity={0.45}
          luminanceThreshold={0.92}
          luminanceSmoothing={0.06}
          mipmapBlur
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0011, 0.0011)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.14} darkness={0.52} />
      </EffectComposer>
    </>
  );
}

// ─── Public canvas wrapper ─────────────────────────────────────────────────
interface ArchiveSceneProps {
  scrollRef: React.MutableRefObject<number>;
  mouseRef:  React.MutableRefObject<{ x: number; y: number }>;
}

export function ArchiveScene({ scrollRef, mouseRef }: ArchiveSceneProps) {
  const tier = useMemo(() => detectTier(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const lessons: LessonEntry[] = useMemo(
    () =>
      projects.map((p, i) => ({
        id: p.id,
        projectTitle: p.title,
        lesson: p.story.learned,
        accentColor: ACCENT_PALETTE[i % ACCENT_PALETTE.length],
        classification: CLASSIFICATION_LABELS[i % CLASSIFICATION_LABELS.length],
        index: i,
      })),
    [],
  );

  // ESC to deselect
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (tier === "low") return null;

  return (
    <Canvas
      camera={{ fov: 48, near: 0.1, far: 60, position: [0, 0.5, 9] }}
      dpr={tier === "high" ? [1, 2] : [1, 1.5]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
    >
      <SceneInner
        lessons={lessons}
        scrollRef={scrollRef}
        mouseRef={mouseRef}
        tier={tier}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </Canvas>
  );
}
