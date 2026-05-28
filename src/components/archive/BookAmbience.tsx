import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Warm archival book atmosphere — desk lamp, cool fill, suspended dust. */
export function BookAmbience() {
  return (
    <>
      {/* Warm desk lamp — key light from upper right, tight falloff */}
      <pointLight
        position={[2.8, 4.8, 3.0]}
        intensity={1.5}
        color="#ffe8b0"
        decay={2}
        distance={12}
      />
      {/* Cool indigo fill from below — emulates dark room bounce */}
      <pointLight
        position={[-1.5, -3.5, 2.0]}
        intensity={0.22}
        color="#1a2540"
        decay={2}
        distance={10}
      />
      <DustField count={220} />
    </>
  );
}

interface DustFieldProps {
  count: number;
}

function DustField({ count }: DustFieldProps) {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds    = new Float32Array(count); // per-particle drift speed
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 7;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      speeds[i] = 0.5 + Math.random() * 0.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("speed",    new THREE.BufferAttribute(speeds, 1));
    return g;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#ffd580",
        size: 0.011,
        transparent: true,
        opacity: 0.055,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((_, dt) => {
    if (!ref.current) return;
    // Slow, contemplative drift — rotate entire field
    ref.current.rotation.y += dt * 0.006;
    ref.current.rotation.x += dt * 0.002;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}
