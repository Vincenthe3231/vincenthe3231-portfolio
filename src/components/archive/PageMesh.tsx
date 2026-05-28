import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

import pageVert from "@/shaders/pageBend.vert?raw";
import pageFrag from "@/shaders/pageBend.frag?raw";
import { useBookPhysics } from "./BookPhysicsProvider";
import { PAGE_W, PAGE_H } from "./usePageBodies";

const PAPER  = new THREE.Color("#efe7d4");
const SHADOW = new THREE.Color("#1d1a14");
const GOLD   = "#c9a45f";
const INK    = "#1a1612";

export interface PageMeshProps {
  number?:   string;
  title?:    string;
  body?:     string;
  pageIndex: number;
  side:      1 | -1;
  zOffset:   number;
}

export function PageMesh({ number, title, body, pageIndex, side, zOffset }: PageMeshProps) {
  const { simRef, turnState, angVelState, dragState } = useBookPhysics();
  const { size } = useThree();

  const timeRef  = useRef(0);
  const liveTurn = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTurn:            { value: 0 },
      uSide:            { value: side as number },
      uHover:           { value: 0 },
      uAngularVelocity: { value: 0 },
      uSag:             { value: 0 },
      uTime:            { value: 0 },
      uPaperColor:      { value: PAPER },
      uShadowColor:     { value: SHADOW },
      uSubsurface:      { value: 0.8 },
      uOpacity:         { value: 1 },
    }),
    [side],
  );

  useFrame((_, dt) => {
    timeRef.current += dt;
    liveTurn.current = turnState.current[pageIndex] ?? 0;

    uniforms.uTurn.value            = liveTurn.current;
    uniforms.uAngularVelocity.value = angVelState.current[pageIndex] ?? 0;
    uniforms.uTime.value            = timeRef.current;

    const prevTurned = pageIndex === 0 ? true : (turnState.current[pageIndex - 1] ?? 0) > 0.88;
    const isFront    = prevTurned && liveTurn.current < 0.12;
    uniforms.uSag.value   = isFront ? 0.5 : 0;
    uniforms.uHover.value = (isFront && !dragState.current.active) ? 0.4 : 0;
  });

  // ── Pointer down — sets drag target ──────────────────────────────────────
  const handlePointerDown = (e: any) => {
    const sim = simRef.current;
    let frontIdx = -1;
    for (let i = 0; i < sim.length; i++) {
      if (sim[i].angle < Math.PI * 0.88) { frontIdx = i; break; }
    }
    if (frontIdx !== pageIndex) return;

    e.stopPropagation();
    dragState.current.active   = true;
    dragState.current.pageIdx  = pageIndex;
    dragState.current.prevNdcX = (e.clientX / size.width) * 2 - 1;
  };

  // ── Text visibility (10fps poll) ─────────────────────────────────────────
  const [turnDisplay, setTurnDisplay] = useState(0);
  const [prevTurned, setPrevTurned]   = useState(pageIndex === 0);

  useEffect(() => {
    const id = setInterval(() => {
      setTurnDisplay(turnState.current[pageIndex] ?? 0);
      if (pageIndex > 0) {
        setPrevTurned((turnState.current[pageIndex - 1] ?? 0) > 0.88);
      }
    }, 100);
    return () => clearInterval(id);
  }, [turnState, pageIndex]);

  const textOpacity = prevTurned && turnDisplay < 0.5
    ? Math.max(0, 1 - turnDisplay * 1.8)
    : 0;
  const xCenter = (side * PAGE_W) / 2;

  return (
    <group position={[0, 0, zOffset]}>
      <mesh
        position={[xCenter, 0, 0]}
        onPointerDown={handlePointerDown}
      >
        <planeGeometry args={[PAGE_W, PAGE_H, 32, 16]} />
        <shaderMaterial
          vertexShader={pageVert}
          fragmentShader={pageFrag}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* Always mount text group — use visible to avoid GPU texture churn on mount/unmount */}
      {number && (
        <group position={[xCenter, 0, 0.001]} visible={textOpacity > 0.01}>
          <Text
            position={[-PAGE_W * 0.35, PAGE_H * 0.4, 0]}
            fontSize={0.16}
            color={GOLD}
            anchorX="left"
            anchorY="middle"
            fillOpacity={textOpacity}
            letterSpacing={0.18}
          >
            {number}.
          </Text>
          <Text
            position={[0, PAGE_H * 0.18, 0]}
            fontSize={0.22}
            color={INK}
            anchorX="center"
            anchorY="middle"
            maxWidth={PAGE_W * 0.78}
            textAlign="center"
            fillOpacity={textOpacity}
          >
            {title ?? ""}
          </Text>
          <mesh position={[0, PAGE_H * 0.05, 0]}>
            <planeGeometry args={[PAGE_W * 0.18, 0.006]} />
            <meshBasicMaterial color={GOLD} transparent opacity={textOpacity * 0.85} />
          </mesh>
          <Text
            position={[0, -PAGE_H * 0.12, 0]}
            fontSize={0.11}
            color={INK}
            anchorX="center"
            anchorY="middle"
            maxWidth={PAGE_W * 0.78}
            textAlign="center"
            lineHeight={1.55}
            fillOpacity={textOpacity * 0.85}
          >
            {body ?? ""}
          </Text>
        </group>
      )}
    </group>
  );
}
