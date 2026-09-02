import { useMemo, useRef, useCallback } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import nebulaVert from "@/shaders/nebula-volumetric.vert?raw";
import nebulaFrag from "@/shaders/nebula-volumetric.frag?raw";
import pointVert from "@/shaders/galaxy-point.vert?raw";
import pointFrag from "@/shaders/galaxy-point.frag?raw";
import {
  ARCHETYPES,
  ARCHETYPE_ID,
  sampleHaloPoint,
  makeRng,
  hashString,
} from "./nebulaArchetypes";
import { useGalaxyState } from "./useGalaxyState";

interface Props {
  project: Project;
  worldPosition: [number, number, number];
  particleCount: number;
  shaderOctaves: number;
  pixelRatio: number;
  reducedMotion: boolean;
}

export function NebulaProjectNode({
  project,
  worldPosition,
  particleCount,
  shaderOctaves,
  pixelRatio,
  reducedMotion,
}: Props) {
  const { hoveredId, focusedId, setHovered, setFocused } = useGalaxyState();
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const pointMatRef = useRef<THREE.ShaderMaterial>(null);

  const isHovered = hoveredId === project.id;
  const isFocused = focusedId === project.id;
  const profile = ARCHETYPES[project.nebula.archetype];

  const targetHover = isHovered || isFocused ? 1 : 0;

  const colorPrimary = useMemo(() => new THREE.Color(project.nebula.colorPrimary), [project.nebula.colorPrimary]);
  const colorSecondary = useMemo(() => new THREE.Color(project.nebula.colorSecondary), [project.nebula.colorSecondary]);

  // Halo particle geometry
  const haloGeom = useMemo(() => {
    const n = Math.max(40, Math.floor(particleCount * profile.particleMultiplier));
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    const phases = new Float32Array(n);
    const colors = new Float32Array(n * 3);

    const rng = makeRng(hashString(project.id));
    const haloR = profile.haloRadius;
    const sizeMin = profile.haloSizeMin;
    const sizeMax = profile.haloSizeMax;

    for (let i = 0; i < n; i++) {
      const [lx, ly, lz] = sampleHaloPoint(profile.haloShape, rng);
      positions[i * 3] = lx * haloR;
      positions[i * 3 + 1] = ly * haloR;
      positions[i * 3 + 2] = lz * haloR;

      sizes[i] = sizeMin + rng() * (sizeMax - sizeMin);
      phases[i] = rng();

      // Mix primary/secondary per particle
      const mix = Math.pow(rng(), 1.8);
      const cr = colorSecondary.r + (colorPrimary.r - colorSecondary.r) * mix;
      const cg = colorSecondary.g + (colorPrimary.g - colorSecondary.g) * mix;
      const cb = colorSecondary.b + (colorPrimary.b - colorSecondary.b) * mix;
      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [project.id, profile, particleCount, colorPrimary, colorSecondary]);

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nebulaVert,
        fragmentShader: nebulaFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: Math.random() * 100 },
          uArchetype: { value: ARCHETYPE_ID[project.nebula.archetype] },
          uColorPrimary: { value: colorPrimary.clone() },
          uColorSecondary: { value: colorSecondary.clone() },
          uTurbulence: { value: project.nebula.turbulence },
          uHoverIntensity: { value: 0 },
          uOctaves: { value: shaderOctaves },
        },
      }),
    [project.nebula.archetype, project.nebula.turbulence, colorPrimary, colorSecondary, shaderOctaves],
  );

  const pointMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointVert,
        fragmentShader: pointFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: pixelRatio },
        },
      }),
    [pixelRatio],
  );

  const baseScale = project.nebula.scale;
  const focusBoostRef = useRef(0);

  useFrame((_, dt) => {
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value += dt;
      // Lerp hover intensity
      const cur = shaderMatRef.current.uniforms.uHoverIntensity.value as number;
      shaderMatRef.current.uniforms.uHoverIntensity.value =
        cur + (targetHover - cur) * (reducedMotion ? 1 : Math.min(1, dt * 6));
    }
    if (pointMatRef.current) pointMatRef.current.uniforms.uTime.value += dt;

    // Self-rotation
    if (innerRef.current && !reducedMotion) {
      innerRef.current.rotation.y += dt * project.nebula.rotationSpeed;
      innerRef.current.rotation.z += dt * project.nebula.rotationSpeed * 0.3;
    }

    // Focus scale boost
    const boostTarget = isFocused ? 1.25 : isHovered ? 1.08 : 1.0;
    focusBoostRef.current += (boostTarget - focusBoostRef.current) * (reducedMotion ? 1 : Math.min(1, dt * 4));
    if (groupRef.current) {
      const s = baseScale * focusBoostRef.current;
      groupRef.current.scale.setScalar(s);
    }
  });

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(project.id);
    },
    [project.id, setHovered],
  );
  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(null);
    },
    [setHovered],
  );
  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      setFocused(project.id);
    },
    [project.id, setFocused],
  );

  const labelVisible = isHovered || isFocused;

  return (
    <group ref={groupRef} position={worldPosition}>
      {/* Hover/click target — transparent so raycaster still hits it */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        renderOrder={-1}
      >
        <sphereGeometry args={[profile.haloRadius * 1.1, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={innerRef}>
        {/* Volumetric gas quads — billboard so they always face camera */}
        <Billboard>
          <mesh renderOrder={1}>
            <planeGeometry args={[profile.haloRadius * 2.6, profile.haloRadius * 2.6]} />
            <primitive ref={shaderMatRef} object={shaderMat} attach="material" />
          </mesh>
        </Billboard>

        {/* Outer particle halo */}
        <points geometry={haloGeom} renderOrder={2}>
          <primitive ref={pointMatRef} object={pointMat} attach="material" />
        </points>

        {/* Bright core marker */}
        <mesh renderOrder={3}>
          <sphereGeometry args={[0.12 * baseScale, 16, 16]} />
          <meshBasicMaterial
            color={colorPrimary}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Floating label, fades in on hover/focus */}
      {labelVisible && (
        <Html
          center
          distanceFactor={10}
          position={[0, profile.haloRadius * 1.3, 0]}
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="whitespace-nowrap select-none"
          >
            <div className="px-3 py-1.5 rounded-md backdrop-blur-md bg-background/30 border border-foreground/10">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                {project.domain.split("·")[0].trim()}
              </div>
              <div className="text-sm font-medium text-foreground/95 tracking-tight">
                {project.title}
              </div>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
}
