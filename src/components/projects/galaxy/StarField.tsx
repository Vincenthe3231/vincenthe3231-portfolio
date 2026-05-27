import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import pointVert from "@/shaders/galaxy-point.vert?raw";
import pointFrag from "@/shaders/galaxy-point.frag?raw";

interface Props {
  count: number;
  radius?: number;
  pixelRatio: number;
}

export function StarField({ count, radius = 80, pixelRatio }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute on a hemispherical shell (upper hemisphere weighted)
      const u = Math.random() * 2 - 1;
      const phi = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = radius * (0.85 + Math.random() * 0.3);
      positions[i * 3] = r * s * Math.cos(phi);
      positions[i * 3 + 1] = r * u * 0.6;
      positions[i * 3 + 2] = r * s * Math.sin(phi);

      sizes[i] = 0.004 + Math.random() * 0.014;
      phases[i] = Math.random();

      // Stellar palette: bluish-white, warm-white, hot-blue, dim red
      const roll = Math.random();
      if (roll < 0.55) {
        colors[i * 3] = 0.85 + Math.random() * 0.15;
        colors[i * 3 + 1] = 0.88 + Math.random() * 0.12;
        colors[i * 3 + 2] = 1.0;
      } else if (roll < 0.85) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.7;
      } else if (roll < 0.95) {
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.75;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 0.5;
      }
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count, radius]);

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
          uPixelRatio: { value: pixelRatio },
        },
      }),
    [pixelRatio],
  );

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <points geometry={geom} renderOrder={-10}>
      <primitive ref={matRef} object={mat} attach="material" />
    </points>
  );
}
