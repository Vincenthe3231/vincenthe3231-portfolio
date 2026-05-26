import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useAurora } from "@/aurora/AuroraProvider";

/**
 * Crystal lensball with refraction. Refracts particles + aurora behind it.
 * Scrolls up + shrinks as user scrolls past hero.
 * Mouse parallax opposite to particle field for depth.
 */
export function RefractionSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { uniforms, config } = useAurora();

  const isDisabled = config.refractionResolution === 0;
  if (isDisabled) return null;

  return (
    <mesh ref={meshRef} position={[2.2, -0.3, 2]}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <MeshTransmissionMaterial
        transmission={0.97}
        thickness={1.8}
        roughness={0.03}
        chromaticAberration={0.18}
        anisotropicBlur={0.4}
        distortion={0.25}
        distortionScale={0.4}
        temporalDistortion={0.08}
        backside
        resolution={config.refractionResolution}
        color={new THREE.Color("hsl(187, 60%, 85%)")}
        attenuationColor={new THREE.Color("hsl(172, 85%, 45%)")}
        attenuationDistance={3}
      />
      <RefractionAnimation meshRef={meshRef} uniforms={uniforms} />
    </mesh>
  );
}

/** Separate component for useFrame to avoid conditional hook issues */
function RefractionAnimation({
  meshRef,
  uniforms,
}: {
  meshRef: React.RefObject<THREE.Mesh>;
  uniforms: React.MutableRefObject<{ scroll: number; mouseX: number; mouseY: number; time: number }>;
}) {
  const lerpedMouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const u = uniforms.current;

    // Scroll: float up + shrink
    const scrollNorm = Math.min(u.scroll * 6, 1); // normalize to hero scroll range
    mesh.position.y = -0.3 + scrollNorm * 5;
    const s = 1 - scrollNorm * 0.85;
    mesh.scale.setScalar(Math.max(s, 0.1));

    // Mouse parallax (opposite direction to particles for depth)
    lerpedMouse.current.x += (-u.mouseX * 0.6 - lerpedMouse.current.x) * 0.03;
    lerpedMouse.current.y += (-u.mouseY * 0.6 - lerpedMouse.current.y) * 0.03;
    mesh.position.x = 2.2 + lerpedMouse.current.x;

    // Gentle rotation
    mesh.rotation.y += 0.003;
    mesh.rotation.x = lerpedMouse.current.y * 0.3;
  });

  return null;
}
