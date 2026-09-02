import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import * as THREE from "three";
import { detectPerformanceTier, TIER_CONFIG } from "@/lib/performanceTier";
import { projects as ALL_PROJECTS } from "@/data/projects";
import { GalaxyStateProvider, useGalaxyState } from "./useGalaxyState";
import { GalaxyCore } from "./GalaxyCore";
import { GalaxySpiral } from "./GalaxySpiral";
import { GalaxyDustClouds } from "./GalaxyDustClouds";
import { StarField } from "./StarField";
import { NebulaProjectNode } from "./NebulaProjectNode";
import { GalaxyCameraRig, orbitToWorld } from "./GalaxyCameraRig";
import { GalaxyPostProcessing } from "./GalaxyPostProcessing";
import { ProjectOverlay } from "./ProjectOverlay";

function SceneContents({
  pixelRatio,
  reducedMotion,
}: {
  pixelRatio: number;
  reducedMotion: boolean;
}) {
  const tier = detectPerformanceTier();
  const cfg = TIER_CONFIG[tier].galaxy;
  const { setFocused } = useGalaxyState();

  const positions = useMemo(
    () =>
      ALL_PROJECTS.map((p) => {
        const v = orbitToWorld(p.nebula.orbit);
        return [v.x, v.y, v.z] as [number, number, number];
      }),
    [],
  );

  return (
    <>
      <color attach="background" args={["#04060c"]} />
      <fog attach="fog" args={["#04060c", 22, 90]} />

      {/* Background click target — clears focus */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setFocused(null);
        }}
      >
        <sphereGeometry args={[90, 8, 8]} />
        <meshBasicMaterial side={THREE.BackSide} transparent opacity={0} depthWrite={false} />
      </mesh>

      <Suspense fallback={null}>
        <StarField count={Math.floor(cfg.coreStars * 1.4)} pixelRatio={pixelRatio} />
        <GalaxyCore count={cfg.coreStars} pixelRatio={pixelRatio} />
        <GalaxySpiral count={cfg.armDensity} pixelRatio={pixelRatio} />
        <GalaxyDustClouds count={cfg.dustQuads} octaves={cfg.shaderOctaves} />

        {ALL_PROJECTS.map((p, i) => (
          <NebulaProjectNode
            key={p.id}
            project={p}
            worldPosition={positions[i]}
            particleCount={cfg.nebulaParticles}
            shaderOctaves={cfg.shaderOctaves}
            pixelRatio={pixelRatio}
            reducedMotion={reducedMotion}
          />
        ))}
      </Suspense>

      <GalaxyCameraRig projects={ALL_PROJECTS} reducedMotion={reducedMotion} />
      {cfg.postFx && <GalaxyPostProcessing />}
    </>
  );
}

function CanvasWithGestures({
  children,
  cfg,
}: {
  children: React.ReactNode;
  cfg: typeof TIER_CONFIG.high.galaxy;
}) {
  const { addYaw, addDolly } = useGalaxyState();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Ensure the Canvas picks up its final size once layout settles
  // (R3F's initial measurement can fall to 300x150 when section is offscreen).
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"));
    });
    ro.observe(wrapperRef.current);
    const t = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  useGesture(
    {
      onDrag: ({ delta: [dx], pinching }) => {
        if (!pinching && dx !== 0) addYaw(dx * -0.004);
      },
      onWheel: ({ delta: [, dy], event }) => {
        const wEvent = event as WheelEvent;
        if (wEvent.ctrlKey) return;
        event.preventDefault?.();
        addDolly(dy * 0.012);
      },
      onPinch: ({ offset: [s] }) => {
        addDolly((s - 1) * 4);
      },
    },
    {
      target: wrapperRef,
      eventOptions: { passive: false },
      drag: { filterTaps: true, threshold: 4 },
    },
  );

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 touch-none select-none"
    >
      <Canvas
        dpr={cfg.dpr}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 11, 28], fov: 55, near: 0.1, far: 200 }}
      >
        {children}
      </Canvas>
    </div>
  );
}

export function GalaxyScene() {
  const [tierResolved, setTierResolved] = useState<ReturnType<typeof detectPerformanceTier> | null>(
    null,
  );
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setTierResolved(detectPerformanceTier());
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handle = () => setReducedMotion(mq.matches);
      mq.addEventListener?.("change", handle);
      return () => mq.removeEventListener?.("change", handle);
    }
  }, []);

  if (!tierResolved) {
    return <div className="absolute inset-0 bg-[#04060c]" aria-hidden />;
  }

  const cfg = TIER_CONFIG[tierResolved].galaxy;
  const pixelRatio = Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio : 1,
    cfg.dpr[1],
  );

  return (
    <GalaxyStateProvider>
      <div className="relative w-full h-full">
        <CanvasWithGestures cfg={cfg}>
          <SceneContents pixelRatio={pixelRatio} reducedMotion={reducedMotion} />
        </CanvasWithGestures>
        <ProjectOverlay projects={ALL_PROJECTS} />
      </div>
    </GalaxyStateProvider>
  );
}
