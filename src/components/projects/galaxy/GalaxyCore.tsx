import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import pointVert from "@/shaders/galaxy-point.vert?raw";
import pointFrag from "@/shaders/galaxy-point.frag?raw";

interface Props {
  count: number;
  pixelRatio: number;
}

export function GalaxyCore({ count, pixelRatio }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Dense radial falloff toward center, ~2.5 unit core
      const r = Math.pow(Math.random(), 2.2) * 2.5;
      const u = Math.random() * 2 - 1;
      const phi = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      positions[i * 3] = r * s * Math.cos(phi);
      positions[i * 3 + 1] = r * u * 0.35; // flattened
      positions[i * 3 + 2] = r * s * Math.sin(phi);

      sizes[i] = 0.012 + Math.random() * 0.03 + (1.0 - r / 2.5) * 0.02;
      phases[i] = Math.random();

      // Warm bulge: amber → white at the very core
      const proximity = 1.0 - r / 2.5;
      const warm = new THREE.Color("#ffd28a");
      const hot = new THREE.Color("#fff4d8");
      const c = warm.clone().lerp(hot, proximity * 0.9);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointVert,
        fragmentShader: pointFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: pixelRatio * 1.6 },
        },
      }),
    [pixelRatio],
  );

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.015;
  });

  return (
    <group ref={groupRef}>
      <points geometry={geom} renderOrder={-5}>
        <primitive ref={matRef} object={mat} attach="material" />
      </points>
      {/* Soft inner glow */}
      <mesh renderOrder={-6}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#ffb86b"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
