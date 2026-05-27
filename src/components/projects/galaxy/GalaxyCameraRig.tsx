import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGalaxyState } from "./useGalaxyState";
import type { Project } from "@/data/projects";

interface Props {
  projects: Project[];
  reducedMotion: boolean;
}

const OVERVIEW_RADIUS = 28;
const OVERVIEW_HEIGHT = 11;

function orbitToWorld(orbit: Project["nebula"]["orbit"]): THREE.Vector3 {
  return new THREE.Vector3(
    orbit.radius * Math.cos(orbit.theta),
    orbit.elevation,
    orbit.radius * Math.sin(orbit.theta),
  );
}

export function GalaxyCameraRig({ projects, reducedMotion }: Props) {
  const { camera, gl } = useThree();
  const { yawIntent, dollyIntent, focusedId, setFocused } = useGalaxyState();

  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const mouseParallax = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const dom = gl.domElement;
    const handleMouse = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseParallax.current.set(x, y);
    };
    dom.addEventListener("pointermove", handleMouse);
    return () => dom.removeEventListener("pointermove", handleMouse);
  }, [gl]);

  // Escape returns to overview
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusedId) setFocused(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusedId, setFocused]);

  useFrame((_, dt) => {
    const idleRot = reducedMotion ? 0 : 0.02;
    const yawAuto = idleRot * performance.now() * 0.001;
    const yaw = yawIntent + yawAuto;
    const dolly = dollyIntent;

    if (focusedId) {
      const proj = projects.find((p) => p.id === focusedId);
      if (proj) {
        const w = orbitToWorld(proj.nebula.orbit);
        // Camera offset: pull back along the radial outward direction
        const outward = w.clone().setY(0).normalize();
        const offset = outward.multiplyScalar(proj.nebula.scale * 4.5);
        offset.y = proj.nebula.scale * 2.2;
        targetPos.current.copy(w).add(offset);
        targetLook.current.copy(w);
      }
    } else {
      // Overview orbit
      const r = Math.max(14, OVERVIEW_RADIUS - dolly);
      targetPos.current.set(
        Math.cos(yaw) * r + mouseParallax.current.x * 1.2,
        OVERVIEW_HEIGHT + mouseParallax.current.y * -1.5,
        Math.sin(yaw) * r,
      );
      targetLook.current.set(0, 0, 0);
    }

    const lerpFactor = reducedMotion ? 1 : Math.min(1, dt * 1.4);
    camera.position.lerp(targetPos.current, lerpFactor);

    // Smooth lookAt
    const cur = new THREE.Vector3();
    camera.getWorldDirection(cur);
    const desired = targetLook.current.clone().sub(camera.position).normalize();
    const blended = cur.lerp(desired, lerpFactor).normalize();
    camera.lookAt(camera.position.clone().add(blended));
  });

  return null;
}

export { orbitToWorld };
