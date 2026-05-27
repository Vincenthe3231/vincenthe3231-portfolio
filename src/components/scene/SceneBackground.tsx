import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { AuroraBackground } from "@/aurora/AuroraBackground";
import { useAurora } from "@/aurora/AuroraProvider";
import { Starfield } from "@/components/hero/Starfield";
import { AuroraRibbons } from "@/components/hero/AuroraRibbons";
import { LandscapeTerrain } from "@/components/hero/LandscapeTerrain";
import { TreeSilhouettes } from "@/components/hero/TreeSilhouettes";
import { RefractionCrystals } from "@/components/hero/RefractionCrystals";
import { SpaceStarfield } from "@/components/scene/SpaceStarfield";
import { NebulaClouds } from "@/components/scene/NebulaClouds";
import { GalaxySpiral } from "@/components/scene/GalaxySpiral";

const PARTICLE_COUNT = 1800;

/**
 * Original ParticleField — PRESERVED exactly from HeroScene.
 * 1800 particles in spherical distribution with mouse parallax and scroll dispersion.
 */
const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const lerped = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);
  const { uniforms: auroraU } = useAurora();

  // Generate positions in a sphere
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 2 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      scrollY.current = Math.min(window.scrollY / window.innerHeight, 1.5);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.04 * delta;
    pointsRef.current.rotation.x += 0.01 * delta;

    // mouse parallax
    lerped.current.x += (mouse.current.x * 0.4 - lerped.current.x) * 0.04;
    lerped.current.y += (mouse.current.y * 0.4 - lerped.current.y) * 0.04;
    pointsRef.current.position.x = lerped.current.x;
    pointsRef.current.position.y = lerped.current.y;

    // scroll dispersion
    const s = 1 + scrollY.current * 0.6;
    pointsRef.current.scale.set(s, s, s);

    // Fade particles as we enter space mode
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.85 * (1 - auroraU.current.sceneMode);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color={new THREE.Color("hsl(187, 100%, 60%)")}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/** Atmospheric glow at horizon line */
const HorizonGlow = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { uniforms } = useAurora();

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.8 },
    }),
    []
  );

  useFrame(() => {
    const u = uniforms.current;
    shaderUniforms.uTime.value = u.time;
    const heroIntensity = 1 - u.sceneMode;
    shaderUniforms.uIntensity.value = heroIntensity;

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = heroIntensity * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -5.5, -7]} renderOrder={5}>
      <planeGeometry args={[60, 4]} />
      <meshBasicMaterial
        color={new THREE.Color("hsl(172, 85%, 45%)")}
        transparent
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

/** Camera scroll controller */
const CameraController = () => {
  const { uniforms } = useAurora();

  useFrame(({ camera }) => {
    const u = uniforms.current;
    // Gentle camera pan on scroll
    const targetY = -u.smoothScroll * 1.5;
    camera.position.y += (targetY - camera.position.y) * 0.05;
  });

  return null;
};

/**
 * Persistent fixed-position R3F Canvas rendering all 3D elements.
 * Lives behind all DOM content. Contains:
 * - Aurora shader background (always visible)
 * - Starfield, Aurora Ribbons, Landscape, Trees (hero only)
 * - Crystal refraction shapes (throughout page)
 * - Original ParticleField (hero only, preserved exactly)
 */
export function SceneBackground() {
  const { tier } = useAurora();
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ fov: 75, position: [0, 0, 5] }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          {/* Layer 1: Deep background */}
          <AuroraBackground />
          <Starfield />

          {/* Deep-space backdrop (past hero) */}
          <SpaceStarfield />
          <NebulaClouds />
          {tier === "high" && <GalaxySpiral />}

          {/* Layer 2: Aurora curtains */}
          <AuroraRibbons />
          <HorizonGlow />

          {/* Layer 3: Particles (preserved) */}
          <ParticleField />

          {/* Layer 4: Crystal shapes (throughout page) */}
          <RefractionCrystals />

          {/* Layer 5: Landscape silhouette (hero only) */}
          <LandscapeTerrain />
          <TreeSilhouettes />

          {/* Environment + camera control */}
          <Environment preset="night" />
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
