import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAurora } from "@/aurora/AuroraProvider";
import galaxyVert from "@/shaders/aurora.vert?raw";
import galaxyFrag from "@/shaders/galaxy.frag?raw";

/**
 * Single faint galaxy spiral hint deep in the cosmos.
 * Visible only when sceneMode > 0.7. High tier only.
 */
export function GalaxySpiral() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { uniforms } = useAurora();

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    }),
    []
  );

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const u = uniforms.current;
    shaderUniforms.uTime.value = u.time;

    // Fade in only when deeply in space mode
    const visibility = Math.max(0, (u.sceneMode - 0.7) / 0.3);
    shaderUniforms.uOpacity.value = visibility;

    mesh.rotation.z += 0.0006;
    mesh.position.y = 1 - u.smoothScroll * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[2, 1, -20]} renderOrder={-92}>
      <planeGeometry args={[18, 18]} />
      <shaderMaterial
        vertexShader={galaxyVert}
        fragmentShader={galaxyFrag}
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
