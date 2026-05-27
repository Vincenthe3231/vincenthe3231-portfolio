import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAurora } from "@/aurora/AuroraProvider";
import nebulaVert from "@/shaders/aurora.vert?raw";
import nebulaFrag from "@/shaders/nebula.frag?raw";

interface NebulaDef {
  pos: [number, number, number];
  size: [number, number];
  colorA: [number, number, number];
  colorB: [number, number, number];
  seed: number;
  rotSpeed: number;
  parallax: number;
}

const NEBULA_DEFS: NebulaDef[] = [
  { pos: [-6, 2, -10], size: [14, 10], colorA: [0.25, 0.12, 0.45], colorB: [0.45, 0.15, 0.55], seed: 1.3, rotSpeed: 0.0008, parallax: 0.15 },
  { pos: [7, -1, -13], size: [12, 8], colorA: [0.08, 0.18, 0.40], colorB: [0.25, 0.12, 0.45], seed: 2.7, rotSpeed: -0.0006, parallax: 0.11 },
  { pos: [3, 4, -16], size: [10, 9], colorA: [0.40, 0.18, 0.55], colorB: [0.20, 0.10, 0.50], seed: 4.1, rotSpeed: 0.0005, parallax: 0.08 },
  { pos: [-5, -3, -18], size: [11, 7], colorA: [0.10, 0.22, 0.50], colorB: [0.35, 0.18, 0.55], seed: 5.9, rotSpeed: -0.0004, parallax: 0.06 },
];

function NebulaCloud({ def }: { def: NebulaDef }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { uniforms } = useAurora();

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColorA: { value: new THREE.Vector3(...def.colorA) },
      uColorB: { value: new THREE.Vector3(...def.colorB) },
      uSeed: { value: def.seed },
    }),
    [def.colorA, def.colorB, def.seed]
  );

  const lerpedMouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const u = uniforms.current;
    shaderUniforms.uTime.value = u.time;
    shaderUniforms.uOpacity.value = u.sceneMode * 0.75;

    // Slow rotation
    mesh.rotation.z += def.rotSpeed;

    // Depth-based mouse parallax
    lerpedMouse.current.x += (u.mouseX * def.parallax - lerpedMouse.current.x) * 0.02;
    lerpedMouse.current.y += (u.mouseY * def.parallax - lerpedMouse.current.y) * 0.02;
    mesh.position.x = def.pos[0] + lerpedMouse.current.x;
    mesh.position.y = def.pos[1] + lerpedMouse.current.y - u.smoothScroll * 0.8;
  });

  return (
    <mesh ref={meshRef} position={def.pos} renderOrder={-85}>
      <planeGeometry args={def.size} />
      <shaderMaterial
        vertexShader={nebulaVert}
        fragmentShader={nebulaFrag}
        uniforms={shaderUniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Drifting nebula cloud sprites. Visible only past hero (sceneMode > 0).
 */
export function NebulaClouds() {
  const { config } = useAurora();
  const defs = NEBULA_DEFS.slice(0, config.nebulaCount);
  return (
    <>
      {defs.map((def, i) => (
        <NebulaCloud key={i} def={def} />
      ))}
    </>
  );
}
