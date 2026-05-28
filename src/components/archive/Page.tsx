import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

import pageVert from "@/shaders/pageBend.vert?raw";
import pageFrag from "@/shaders/pageBend.frag?raw";

const PAPER = new THREE.Color("#efe7d4");
const SHADOW = new THREE.Color("#1d1a14");
const GOLD = "#c9a45f";
const INK = "#1a1612";

const PAGE_W = 2.4;
const PAGE_H = 3.2;

export interface PageProps {
  number?: string;
  title?: string;
  body?: string;
  /** Ref to Book's turnState array. Read live in useFrame — never passed as scalar. */
  turnRef: React.MutableRefObject<number[]>;
  pageIndex: number;
  side: 1 | -1;
  zOffset: number;
  hoverRef?: React.MutableRefObject<number>;
}

export function Page({ number, title, body, turnRef, pageIndex, side, zOffset, hoverRef }: PageProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTurn: { value: 0 },
      uSide: { value: side as number },
      uHover: { value: 0 },
      uPaperColor: { value: PAPER },
      uShadowColor: { value: SHADOW },
      uOpacity: { value: 1 },
    }),
    [side],
  );

  const groupRef = useRef<THREE.Group>(null);

  // Live turn value read directly from ref each frame — no stale prop closure.
  const liveTurn = useRef(0);

  useFrame(() => {
    liveTurn.current = turnRef.current[pageIndex] ?? 0;
    uniforms.uTurn.value = liveTurn.current;
    uniforms.uHover.value = hoverRef?.current ?? 0;
  });

  // Text visibility uses a throttled state (10fps) so React text nodes
  // mount/unmount without blocking the 60fps shader path.
  const [turnDisplay, setTurnDisplay] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setTurnDisplay(turnRef.current[pageIndex] ?? 0);
    }, 100);
    return () => clearInterval(id);
  }, [turnRef, pageIndex]);

  const textOpacity = turnDisplay < 0.5 ? Math.max(0, 1 - turnDisplay * 1.8) : 0;

  // Position so the spine sits at world x = 0
  const xCenter = (side * PAGE_W) / 2;

  return (
    <group ref={groupRef} position={[0, 0, zOffset]}>
      <mesh position={[xCenter, 0, 0]}>
        <planeGeometry args={[PAGE_W, PAGE_H, 32, 16]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={pageVert}
          fragmentShader={pageFrag}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* Page content — only render when this page is the "facing" one */}
      {number && textOpacity > 0.05 && (
        <group position={[xCenter, 0, 0.001]}>
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
          {/* Gold rule */}
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
