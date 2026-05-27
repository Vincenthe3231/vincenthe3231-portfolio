import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import pointVert from "@/shaders/galaxy-point.vert?raw";
import pointFrag from "@/shaders/galaxy-point.frag?raw";

interface Props {
  count: number;       // total points across all arms
  armCount?: number;
  pixelRatio: number;
}

/**
 * Four logarithmic spiral arms. Replaces the old single-plane GalaxySpiral
 * (which still exists under src/components/scene/ for the hero — separate file).
 */
export function GalaxySpiral({ count, armCount = 4, pixelRatio }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const armOffset = (Math.PI * 2) / armCount;
    const spiralTightness = 0.32; // log spiral pitch
    const armWidth = 0.9;
    const maxRadius = 22;
    const minRadius = 3;

    for (let i = 0; i < count; i++) {
      const arm = i % armCount;
      // Radius distribution: more density mid-arm
      const tNorm = Math.pow(Math.random(), 0.7);
      const r = minRadius + tNorm * (maxRadius - minRadius);

      // Log spiral: theta = log(r / a) / b
      const baseTheta = Math.log(r / minRadius) / spiralTightness + arm * armOffset;

      // Lateral scatter (perpendicular to arm direction)
      const scatter = (Math.random() - 0.5) * armWidth * (0.4 + tNorm * 0.8);
      const verticalScatter = (Math.random() - 0.5) * 0.6 * (1.0 - tNorm * 0.5);

      const theta = baseTheta + scatter / Math.max(0.5, r);

      positions[i * 3] = r * Math.cos(theta) + (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = verticalScatter;
      positions[i * 3 + 2] = r * Math.sin(theta) + (Math.random() - 0.5) * 0.3;

      sizes[i] = 0.006 + Math.random() * 0.022;
      phases[i] = Math.random();

      // Color: hydrogen red near core, ionized blue mid, dusty pale outer
      const roll = Math.random();
      const c = new THREE.Color();
      const proximity = 1.0 - (r - minRadius) / (maxRadius - minRadius);
      if (roll < 0.35) {
        // Hα red
        c.setRGB(1.0, 0.45 + proximity * 0.2, 0.4);
      } else if (roll < 0.7) {
        // ionized blue
        c.setRGB(0.55, 0.78, 1.0);
      } else if (roll < 0.92) {
        // pale dusty
        c.setRGB(1.0, 0.92, 0.82);
      } else {
        // violet outliers
        c.setRGB(0.78, 0.6, 1.0);
      }
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count, armCount]);

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
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.02;
  });

  return (
    <group ref={groupRef}>
      <points geometry={geom} renderOrder={-4}>
        <primitive ref={matRef} object={mat} attach="material" />
      </points>
    </group>
  );
}
