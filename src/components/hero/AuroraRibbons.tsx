import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAurora } from "@/aurora/AuroraProvider";

import ribbonVert from "@/shaders/aurora-ribbon.vert?raw";
import ribbonFrag from "@/shaders/aurora-ribbon.frag?raw";

interface RibbonConfig {
  xOffset: number;
  zDepth: number;
  index: number;
  width: number;
  height: number;
  mouseParallax: number;
}

const RIBBON_CONFIGS: RibbonConfig[] = [
  { xOffset: -4, zDepth: -6, index: 0, width: 1.2, height: 22, mouseParallax: 0.25 },
  { xOffset: 1.5, zDepth: -9, index: 1, width: 0.8, height: 24, mouseParallax: 0.18 },
  { xOffset: 6, zDepth: -12, index: 2, width: 1.0, height: 20, mouseParallax: 0.12 },
  { xOffset: -7, zDepth: -14, index: 3, width: 0.6, height: 26, mouseParallax: 0.08 },
];

function Ribbon({ ribbon }: { ribbon: RibbonConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { uniforms } = useAurora();

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntensity: { value: 0.8 },
      uRibbonIndex: { value: ribbon.index },
    }),
    [ribbon.index]
  );

  const lerpedMouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const u = uniforms.current;
    shaderUniforms.uTime.value = u.time;
    shaderUniforms.uScroll.value = u.smoothScroll;

    // Fade with scene mode (aurora curtains only in hero)
    shaderUniforms.uIntensity.value = (1 - u.sceneMode) * u.sectionIntensity;

    // Depth-based mouse parallax
    if (meshRef.current) {
      lerpedMouse.current.x +=
        (u.mouseX * ribbon.mouseParallax - lerpedMouse.current.x) * 0.03;
      lerpedMouse.current.y +=
        (u.mouseY * ribbon.mouseParallax * 0.5 - lerpedMouse.current.y) * 0.03;

      meshRef.current.position.x = ribbon.xOffset + lerpedMouse.current.x;
      meshRef.current.position.y = 2 + lerpedMouse.current.y;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[ribbon.xOffset, 2, ribbon.zDepth]}
      renderOrder={-80 + ribbon.index}
    >
      <planeGeometry args={[ribbon.width, ribbon.height, 1, 128]} />
      <shaderMaterial
        vertexShader={ribbonVert}
        fragmentShader={ribbonFrag}
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

/**
 * 3D aurora curtain ribbon meshes.
 * Each ribbon is a tall, thin plane with vertex displacement creating curtain waves.
 * Hero-only: fades out when scrolling past hero.
 */
export function AuroraRibbons() {
  const { config } = useAurora();
  const ribbons = RIBBON_CONFIGS.slice(0, config.ribbonCount);

  return (
    <>
      {ribbons.map((ribbon) => (
        <Ribbon key={ribbon.index} ribbon={ribbon} />
      ))}
    </>
  );
}
