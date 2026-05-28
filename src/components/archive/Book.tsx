import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PageMesh } from "./PageMesh";
import { BookPhysicsProvider, useBookPhysics } from "./BookPhysicsProvider";
import {
  SPRING_STIFFNESS,
  SPRING_DAMPING,
  SCROLL_TORQUE_SCALE,
  PAGE_INERTIA,
} from "./usePageBodies";
import type { ArchiveProgress } from "./useArchiveProgress";
import { values } from "@/data/values";

const Z_STEP      = 0.002;
const TOTAL_PAGES = values.length + 1; // cover + content pages

interface BookProps {
  progressRef: React.MutableRefObject<ArchiveProgress>;
}

function BookInner({ progressRef }: BookProps) {
  const { simRef, turnState, angVelState, dragState } = useBookPhysics();
  const { gl, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const prevTurn = useRef(0);

  // ── Global pointer listeners for drag ────────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;

    const onMove = (e: PointerEvent) => {
      if (!dragState.current.active || dragState.current.pageIdx < 0) return;
      const ndcX = (e.clientX / size.width) * 2 - 1;
      const dx   = ndcX - dragState.current.prevNdcX;
      dragState.current.prevNdcX = ndcX;

      const s = simRef.current[dragState.current.pageIdx];
      if (s) s.angVel += -dx * 5.0;
    };

    const onUp = () => {
      dragState.current.active  = false;
      dragState.current.pageIdx = -1;
    };

    canvas.addEventListener("pointermove",  onMove);
    canvas.addEventListener("pointerup",    onUp);
    canvas.addEventListener("pointerleave", onUp);
    return () => {
      canvas.removeEventListener("pointermove",  onMove);
      canvas.removeEventListener("pointerup",    onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  }, [gl, size, simRef, dragState]);

  // ── Spring-damper simulation loop ────────────────────────────────────────
  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const { turn } = progressRef.current;
    const scrollDelta = turn - prevTurn.current;
    prevTurn.current  = turn;

    simRef.current.forEach((s, i) => {
      if (!dragState.current.active || dragState.current.pageIdx !== i) {
        const target       = turn > i + 0.5 ? Math.PI : 0;
        const springTorque = (target - s.angle) * SPRING_STIFFNESS - s.angVel * SPRING_DAMPING;
        const scrollTorque = Math.abs(turn - i - 0.5) < 0.7 && !dragState.current.active
          ? scrollDelta * SCROLL_TORQUE_SCALE
          : 0;
        s.angVel += (springTorque + scrollTorque) * dt / PAGE_INERTIA;
      }

      // Soft angle stops — kill velocity at extremes
      if (s.angle < 0.015 && s.angVel < 0) s.angVel *= 0.05;
      if (s.angle > Math.PI - 0.015 && s.angVel > 0) s.angVel *= 0.05;

      // Integrate + clamp
      s.angle = Math.max(0, Math.min(Math.PI, s.angle + s.angVel * dt));

      // Write shared state for PageMesh shaders
      turnState.current[i]   = s.angle / Math.PI;
      angVelState.current[i] = s.angVel;
    });

    // Subtle book breathing
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.x = -0.05 + Math.sin(t * 0.5)  * 0.008;
      groupRef.current.rotation.y =         Math.sin(t * 0.35) * 0.012;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Left stack — backs of turned pages */}
      <mesh position={[-1.2, 0, -0.05]}>
        <boxGeometry args={[2.4, 3.2, 0.04]} />
        <meshStandardMaterial color="#2a2218" roughness={0.88} metalness={0.04} />
      </mesh>
      {/* Right backing — back cover */}
      <mesh position={[1.2, 0, -0.06]}>
        <boxGeometry args={[2.4, 3.2, 0.04]} />
        <meshStandardMaterial color="#2a2218" roughness={0.88} metalness={0.04} />
      </mesh>
      {/* Spine */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[0.06, 3.2, 0.09]} />
        <meshStandardMaterial color="#1a140e" roughness={0.92} />
      </mesh>

      {/* Cover (page 0) */}
      <PageMesh
        number=""
        title="Archive"
        body="Notes on shipping."
        pageIndex={0}
        side={1}
        zOffset={Z_STEP * (values.length + 1)}
      />

      {/* Content pages */}
      {values.map((v, i) => (
        <PageMesh
          key={v.number}
          number={v.number}
          title={v.title}
          body={v.description}
          pageIndex={i + 1}
          side={1}
          zOffset={Z_STEP * (values.length - i)}
        />
      ))}
    </group>
  );
}

export function Book({ progressRef }: BookProps) {
  return (
    <BookPhysicsProvider totalPages={TOTAL_PAGES}>
      <BookInner progressRef={progressRef} />
    </BookPhysicsProvider>
  );
}
