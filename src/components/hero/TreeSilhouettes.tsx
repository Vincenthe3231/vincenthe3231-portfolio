import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAurora } from "@/aurora/AuroraProvider";
import { terrainNoise } from "./LandscapeTerrain";

/**
 * Create a single tree geometry (cone foliage + cylinder trunk).
 */
function createTreeGeometry(): THREE.BufferGeometry {
  const foliage = new THREE.ConeGeometry(0.3, 0.9, 5);
  foliage.translate(0, 0.7, 0);

  const trunk = new THREE.CylinderGeometry(0.05, 0.07, 0.35, 4);
  trunk.translate(0, 0.175, 0);

  // Merge geometries
  const merged = new THREE.BufferGeometry();
  const foliagePositions = foliage.attributes.position.array;
  const trunkPositions = trunk.attributes.position.array;
  const allPositions = new Float32Array(foliagePositions.length + trunkPositions.length);
  allPositions.set(foliagePositions, 0);
  allPositions.set(trunkPositions, foliagePositions.length);

  const foliageIndices = foliage.index ? Array.from(foliage.index.array) : [];
  const trunkIndices = trunk.index ? Array.from(trunk.index.array) : [];
  const offset = foliagePositions.length / 3;
  const allIndices = [
    ...foliageIndices,
    ...trunkIndices.map((idx) => idx + offset),
  ];

  merged.setAttribute("position", new THREE.BufferAttribute(allPositions, 3));
  merged.setIndex(allIndices);
  merged.computeVertexNormals();

  foliage.dispose();
  trunk.dispose();

  return merged;
}

/**
 * Instanced tree silhouettes placed along the mountain ridgeline.
 * Uses the same noise function as LandscapeTerrain for correct placement.
 * Pure black — creates silhouette. Hero-only.
 */
export function TreeSilhouettes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { uniforms, config } = useAurora();

  const treeCount = config.treeCount;

  // Early return for low tier
  if (treeCount === 0) return null;

  const treeGeo = useMemo(() => createTreeGeometry(), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Set instance transforms
  useEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < treeCount; i++) {
      // Distribute trees along the terrain X range (-25 to +25)
      const x = -25 + (i / treeCount) * 50 + (Math.random() - 0.5) * 1.5;

      // Sample terrain height at this X position
      const terrainHeight = terrainNoise(x, 0);

      // Place tree base at terrain surface
      const baseY = -7 + terrainHeight * 0.5 + 1.5; // offset to match terrain mesh position

      // Random scale variation
      const scale = 0.6 + Math.random() * 0.8;

      // Random Y rotation
      const rotY = Math.random() * Math.PI * 2;

      dummy.position.set(x, baseY, -4.5 + (Math.random() - 0.5) * 1.5);
      dummy.rotation.set(0, rotY, 0);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [treeCount, dummy, treeGeo]);

  useFrame(() => {
    if (!meshRef.current) return;

    const u = uniforms.current;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 1 - u.sceneMode;
  });

  // Cleanup
  useEffect(() => {
    return () => {
      treeGeo.dispose();
    };
  }, [treeGeo]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[treeGeo, undefined, treeCount]}
      renderOrder={11}
    >
      <meshBasicMaterial color="#080B14" transparent depthWrite={false} />
    </instancedMesh>
  );
}
