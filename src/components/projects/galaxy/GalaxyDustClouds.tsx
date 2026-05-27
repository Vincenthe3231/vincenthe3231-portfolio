import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import nebulaVert from "@/shaders/nebula-volumetric.vert?raw";
import nebulaFrag from "@/shaders/nebula-volumetric.frag?raw";

interface Props {
  count: number;
  octaves: number;
}

interface Cloud {
  position: [number, number, number];
  scale: number;
  rotation: number;
  archetype: number;
  color: [number, number, number];
  colorBg: [number, number, number];
  alphaMul: number;
}

const PALETTE_PRIMARY: Array<[number, number, number]> = [
  [0.36, 0.45, 0.78], // soft blue
  [0.6, 0.4, 0.8],    // violet
  [0.9, 0.55, 0.45],  // hydrogen warm
  [0.45, 0.7, 0.85],  // teal
];
const PALETTE_BG: Array<[number, number, number]> = [
  [0.05, 0.07, 0.15],
  [0.1, 0.05, 0.18],
  [0.15, 0.08, 0.12],
  [0.06, 0.1, 0.16],
];

/**
 * Wispy dust silhouettes along the spiral arms. Uses the volumetric nebula
 * shader (archetype 4 = molecular) with low alpha to avoid overdraw spikes.
 */
export function GalaxyDustClouds({ count, octaves }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo<Cloud[]>(() => {
    const out: Cloud[] = [];
    for (let i = 0; i < count; i++) {
      // Sample along spiral arm
      const arm = i % 4;
      const r = 6 + Math.random() * 16;
      const baseTheta = Math.log(r / 3) / 0.32 + arm * (Math.PI / 2);
      const scatter = (Math.random() - 0.5) * 1.2;
      const theta = baseTheta + scatter / Math.max(0.5, r);

      const palIdx = Math.floor(Math.random() * PALETTE_PRIMARY.length);

      out.push({
        position: [
          r * Math.cos(theta),
          (Math.random() - 0.5) * 1.2,
          r * Math.sin(theta),
        ],
        scale: 3 + Math.random() * 4,
        rotation: Math.random() * Math.PI * 2,
        archetype: 4, // molecular — soft fog
        color: PALETTE_PRIMARY[palIdx],
        colorBg: PALETTE_BG[palIdx],
        alphaMul: 0.22 + Math.random() * 0.12,
      });
    }
    return out;
  }, [count]);

  // Per-cloud materials (cheap — count is small, dustQuads ≤ 8)
  const materials = useMemo(
    () =>
      clouds.map(
        (c) =>
          new THREE.ShaderMaterial({
            vertexShader: nebulaVert,
            fragmentShader: nebulaFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
              uTime: { value: Math.random() * 100 },
              uArchetype: { value: c.archetype },
              uColorPrimary: { value: new THREE.Color(c.color[0], c.color[1], c.color[2]) },
              uColorSecondary: { value: new THREE.Color(c.colorBg[0], c.colorBg[1], c.colorBg[2]) },
              uTurbulence: { value: 0.5 + Math.random() * 0.3 },
              uHoverIntensity: { value: 0 },
              uOctaves: { value: octaves },
            },
          }),
      ),
    [clouds, octaves],
  );

  useFrame((_, dt) => {
    for (const m of materials) m.uniforms.uTime.value += dt;
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.018;
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh
          key={i}
          position={c.position}
          rotation={[-Math.PI / 2, 0, c.rotation]}
          scale={[c.scale, c.scale, 1]}
          renderOrder={-3}
        >
          <planeGeometry args={[1, 1]} />
          <primitive object={materials[i]} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
