import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAurora } from "./AuroraProvider";

import auroraVert from "@/shaders/aurora.vert?raw";
import auroraFrag from "@/shaders/aurora.frag?raw";

/**
 * Fullscreen aurora shader quad. Lives inside an R3F <Canvas>.
 * Dynamically sized to cover the full camera frustum with margin.
 * Renders behind everything at z=-10 with depthWrite off.
 */
export function AuroraBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.PlaneGeometry>(null);
  const { uniforms: auroraUniforms, config } = useAurora();
  const { camera } = useThree();

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 0.8 },
      uOctaves: { value: config.auroraOctaves },
      uSceneMode: { value: 0 },
    }),
    [config.auroraOctaves]
  );

  useFrame(() => {
    const u = auroraUniforms.current;
    shaderUniforms.uTime.value = u.time;
    shaderUniforms.uScroll.value = u.scroll;
    shaderUniforms.uMouse.value.set(u.mouseX, u.mouseY);
    shaderUniforms.uIntensity.value = u.sectionIntensity;
    shaderUniforms.uSceneMode.value = u.sceneMode;

    // Dynamically resize plane to cover full frustum at z=-10
    const cam = camera as THREE.PerspectiveCamera;
    const dist = cam.position.z - (-10); // distance from camera to plane
    const vFov = (cam.fov * Math.PI) / 180;
    const planeH = 2 * Math.tan(vFov / 2) * dist * 1.2; // 20% margin
    const planeW = planeH * cam.aspect * 1.2;

    const geo = geoRef.current;
    if (geo) {
      const params = geo.parameters;
      if (
        Math.abs(params.width - planeW) > 0.5 ||
        Math.abs(params.height - planeH) > 0.5
      ) {
        geo.dispose();
        if (meshRef.current) {
          meshRef.current.geometry = new THREE.PlaneGeometry(planeW, planeH);
          geoRef.current = meshRef.current.geometry as THREE.PlaneGeometry;
        }
      }
    }
  });

  // Initial size — generous default, will be adjusted in useFrame
  const initDist = 15;
  const initVFov = (75 * Math.PI) / 180;
  const initH = 2 * Math.tan(initVFov / 2) * initDist * 1.2;
  const initW = initH * 1.78 * 1.2; // assume 16:9 initially

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} renderOrder={-100}>
      <planeGeometry ref={geoRef} args={[initW, initH]} />
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
