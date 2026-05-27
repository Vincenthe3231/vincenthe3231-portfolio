import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAurora } from "@/aurora/AuroraProvider";

/**
 * JS-side noise matching the GLSL noise for terrain height sampling.
 * Used by TreeSilhouettes to place trees at correct heights.
 */
export function terrainNoise(x: number, seed: number = 0): number {
  // Simple JS implementation of layered noise for terrain ridgeline
  const hash = (n: number) => {
    const s = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const smoothNoise = (x: number) => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    return (1 - u) * (hash(i) * 2 - 1) + u * (hash(i + 1) * 2 - 1);
  };

  // Layered FBM
  let value = 0;
  value += smoothNoise(x * 0.15) * 3.0;
  value += smoothNoise(x * 0.4 + 100) * 1.0;
  value += smoothNoise(x * 0.8 + 200) * 0.4;

  return value;
}

/**
 * Procedural mountain terrain silhouette.
 * Uses vertex displacement with noise for mountain ridgeline.
 * Pure black material — creates silhouette against aurora sky.
 * Hero-only: fades out when scrolling past hero.
 */
export function LandscapeTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { uniforms, config } = useAurora();

  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      60, // width
      10, // height
      config.terrainSegments,
      16
    );

    // Displace vertices to create mountain ridgeline
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Only displace upper portion (mountain peaks)
      const normalizedY = (y + 5) / 10; // 0 at bottom, 1 at top

      if (normalizedY > 0.3) {
        const height = terrainNoise(x, 0);
        const peakFactor = Math.pow(normalizedY - 0.3, 0.7) * 1.5;
        pos.setY(i, y + height * peakFactor);
      }
    }

    geo.computeVertexNormals();
    return geo;
  }, [config.terrainSegments]);

  useFrame(() => {
    if (!meshRef.current) return;

    const u = uniforms.current;
    // Fade out as we enter space mode
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 1 - u.sceneMode;
  });

  // Cleanup geometry on unmount
  useEffect(() => {
    return () => {
      terrainGeo.dispose();
    };
  }, [terrainGeo]);

  return (
    <mesh
      ref={meshRef}
      geometry={terrainGeo}
      position={[0, -7, -5]}
      renderOrder={10}
    >
      <meshBasicMaterial
        color="#080B14"
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
