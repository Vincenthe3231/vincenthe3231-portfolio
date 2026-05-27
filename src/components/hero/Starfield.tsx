import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAurora } from "@/aurora/AuroraProvider";

/**
 * Background star points in a hemispherical shell.
 * Deep background layer (z=-40 to z=-80), barely moves on mouse.
 * Fades out when hero is not visible.
 */
export function Starfield() {
  const pointsRef = useRef<THREE.Points>(null);
  const { uniforms, config } = useAurora();

  const count = config.starCount;

  const { positions, sizes, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Hemispherical shell distribution (upper hemisphere — stars in sky)
      const r = 40 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random()); // upper hemisphere only

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.6 + 5; // bias upward
      pos[i * 3 + 2] = -r * Math.sin(phi) * Math.sin(theta) - 10; // push back

      // Randomized star sizes
      sz[i] = 0.008 + Math.random() * 0.025;

      // Mostly warm white, few tinted blue/yellow
      const tint = Math.random();
      if (tint < 0.1) {
        // Blue-white
        col[i * 3] = 0.7;
        col[i * 3 + 1] = 0.8;
        col[i * 3 + 2] = 1.0;
      } else if (tint < 0.15) {
        // Warm yellow
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.9;
        col[i * 3 + 2] = 0.7;
      } else {
        // White
        col[i * 3] = 0.95;
        col[i * 3 + 1] = 0.95;
        col[i * 3 + 2] = 0.95;
      }
    }
    return { positions: pos, sizes: sz, colors: col };
  }, [count]);

  const lerpedMouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!pointsRef.current) return;

    const u = uniforms.current;

    // Barely moves on mouse (deep background)
    lerpedMouse.current.x += (u.mouseX * 0.05 - lerpedMouse.current.x) * 0.02;
    lerpedMouse.current.y += (u.mouseY * 0.05 - lerpedMouse.current.y) * 0.02;

    pointsRef.current.position.x = lerpedMouse.current.x;
    pointsRef.current.position.y = lerpedMouse.current.y - u.smoothScroll * 3;

    // Fade out as we enter space mode
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = (1 - u.sceneMode) * 0.85;
  });

  return (
    <points ref={pointsRef} renderOrder={-90}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
