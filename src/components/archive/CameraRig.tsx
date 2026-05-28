import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  scrollRef:  React.MutableRefObject<number>;
  mouseRef:   React.MutableRefObject<{ x: number; y: number }>;
  focusMode:  boolean;
}

const BASE_POS    = new THREE.Vector3(0, 0.5, 9);
const BASE_TARGET = new THREE.Vector3(0, 0, 0);
const FOCUS_CAM   = new THREE.Vector3(0, 0.1, 5.8);
const FOCUS_LOOK  = new THREE.Vector3(0, 0.1, 2.5);

export function CameraRig({ scrollRef, mouseRef, focusMode }: Props) {
  const { camera } = useThree();
  const posRef     = useRef(BASE_POS.clone());
  const lookAtRef  = useRef(BASE_TARGET.clone());
  const idleRef    = useRef({ theta: 0, phi: 0 });

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    if (focusMode) {
      // Smoothly glide camera to focus position
      posRef.current.lerp(FOCUS_CAM, delta * 2.5);
      lookAtRef.current.lerp(FOCUS_LOOK, delta * 2.5);
      camera.position.copy(posRef.current);
      camera.lookAt(lookAtRef.current);
      // keep idle clock advancing so resume is smooth
      idleRef.current.theta += delta * 0.006;
      idleRef.current.phi   += delta * 0.004;
      return;
    }

    // Idle drift — extremely low frequency, underwater feel
    idleRef.current.theta += delta * 0.006;
    idleRef.current.phi   += delta * 0.004;
    const idleX = Math.sin(idleRef.current.theta) * 0.18;
    const idleY = Math.sin(idleRef.current.phi)   * 0.08;

    // Mouse parallax — delayed, never snappy
    const mouseX = mouseRef.current.x * 0.35;
    const mouseY = mouseRef.current.y * 0.18;

    // Scroll pushes camera slightly forward/backward + upward
    const s = scrollRef.current;
    const scrollZ = -s * 1.8;
    const scrollY =  s * 0.4;

    const targetPos = new THREE.Vector3(
      BASE_POS.x + idleX + mouseX,
      BASE_POS.y + idleY + mouseY + scrollY,
      BASE_POS.z + scrollZ,
    );

    // Inertial interpolation — heavy, floaty
    posRef.current.lerp(targetPos, delta * 0.8);
    camera.position.copy(posRef.current);

    const targetLook = new THREE.Vector3(
      mouseX * 0.3 + idleX * 0.2,
      mouseY * 0.25,
      0,
    );
    lookAtRef.current.lerp(targetLook, delta * 0.5);
    camera.lookAt(lookAtRef.current);
  });

  return null;
}
