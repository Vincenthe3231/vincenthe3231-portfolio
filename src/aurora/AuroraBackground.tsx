import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAurora } from "./AuroraProvider";

import auroraVert from "@/shaders/aurora.vert?raw";
import auroraFrag from "@/shaders/aurora.frag?raw";

/**
 * Fullscreen aurora shader quad. Lives inside an R3F <Canvas>.
 * Renders behind everything at z=-10 with depthWrite off.
 */
export function AuroraBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { uniforms: auroraUniforms, config } = useAurora();

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 0.8 },
      uOctaves: { value: config.auroraOctaves },
    }),
    [config.auroraOctaves]
  );

  useFrame(() => {
    const u = auroraUniforms.current;
    shaderUniforms.uTime.value = u.time;
    shaderUniforms.uScroll.value = u.scroll;
    shaderUniforms.uMouse.value.set(u.mouseX, u.mouseY);
    shaderUniforms.uIntensity.value = u.sectionIntensity;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} renderOrder={-100}>
      <planeGeometry args={[30, 20]} />
      <shaderMaterial
        vertexShader={auroraVert}
        fragmentShader={auroraFrag}
        uniforms={shaderUniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
