import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import holoVert from "@/shaders/hologram.vert?raw";
import holoFrag from "@/shaders/hologram.frag?raw";

export interface LessonEntry {
  id: string;
  projectTitle: string;
  lesson: string;
  accentColor: string;
  classification?: string;
  index: number;
}

interface Props {
  lesson: LessonEntry;
  selected: boolean;
  anySelected: boolean;
  onSelect: () => void;
}

// Asymmetric volumetric spread
const INITIAL_POSITIONS: [number, number, number][] = [
  [-1.8,  0.6, -1.0],
  [ 2.2,  0.2, -2.5],
  [-2.6, -0.8, -1.8],
  [ 0.4,  1.4, -3.2],
  [-0.6, -1.2, -0.8],
  [ 2.8,  1.0, -0.4],
  [-1.2,  0.0, -4.0],
  [ 0.8, -0.4, -2.0],
];

const INITIAL_ROTATIONS: [number, number, number][] = [
  [ 0.05, -0.15,  0.03],
  [-0.08,  0.22, -0.04],
  [ 0.12, -0.08,  0.06],
  [-0.04,  0.18,  0.02],
  [ 0.07, -0.25,  0.08],
  [-0.10,  0.10, -0.05],
  [ 0.03,  0.20,  0.04],
  [-0.06, -0.12,  0.02],
];

// Module-level constants (never mutated — shared across all instances)
const FOCUS_POS  = new THREE.Vector3(0, 0.1, 2.5);
const FOCUS_ROT  = new THREE.Quaternion(); // identity = flat-on
const ONE_SCALE  = new THREE.Vector3(1, 1, 1);
const SEL_SCALE  = new THREE.Vector3(1.42, 1.42, 1.42);
const _tmpQ      = new THREE.Quaternion();
const _tmpEuler  = new THREE.Euler();

export const HologramTablet = ({ lesson, selected, anySelected, onSelect }: Props) => {
  const matRef   = useRef<THREE.ShaderMaterial>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const bodyRef  = useRef<RapierRigidBody>(null!);
  const idx      = lesson.index;

  const isKinRef  = useRef(false);
  // Lerp-tracked position while kinematic
  const kinPosRef = useRef(new THREE.Vector3(...INITIAL_POSITIONS[idx % 8]));

  const accentColor = useMemo(
    () => new THREE.Color(lesson.accentColor),
    [lesson.accentColor],
  );

  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uColor:   { value: accentColor },
    uOpacity: { value: 0 },
  }), [accentColor]);

  useFrame(({ clock }, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;

    if (selected) {
      // Switch to kinematic once
      if (!isKinRef.current && bodyRef.current) {
        bodyRef.current.setBodyType(2, true); // KinematicPositionBased
        isKinRef.current = true;
      }

      if (bodyRef.current && isKinRef.current) {
        // Lerp toward focus center
        kinPosRef.current.lerp(FOCUS_POS, delta * 2.8);
        bodyRef.current.setNextKinematicTranslation(kinPosRef.current);

        // Slerp rotation toward flat-on
        const rot = bodyRef.current.rotation();
        _tmpQ.set(rot.x, rot.y, rot.z, rot.w);
        _tmpQ.slerp(FOCUS_ROT, delta * 2.8);
        bodyRef.current.setNextKinematicRotation(_tmpQ);
      }

      groupRef.current?.scale.lerp(SEL_SCALE, delta * 2.8);
      matRef.current.uniforms.uOpacity.value = Math.min(
        1,
        matRef.current.uniforms.uOpacity.value + delta * 2,
      );
    } else {
      if (isKinRef.current && bodyRef.current) {
        // Switch back to dynamic AND teleport back to original spawn zone
        // so cards never accumulate at center on re-selection
        const [ox, oy, oz] = INITIAL_POSITIONS[idx % 8];
        const [rx, ry, rz] = INITIAL_ROTATIONS[idx % 8];

        bodyRef.current.setBodyType(0, true); // Dynamic

        // Reset position + zero all velocity
        bodyRef.current.setTranslation({ x: ox, y: oy, z: oz }, true);
        bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

        // Reset rotation back to original tilt
        _tmpEuler.set(rx, ry, rz);
        _tmpQ.setFromEuler(_tmpEuler);
        bodyRef.current.setRotation(_tmpQ, true);

        // Sync kinPosRef so next selection lerps from origin, not [0,0,2.5]
        kinPosRef.current.set(ox, oy, oz);
        isKinRef.current = false;
      }

      groupRef.current?.scale.lerp(ONE_SCALE, delta * 2.2);

      const op = matRef.current.uniforms.uOpacity.value;
      if (anySelected) {
        matRef.current.uniforms.uOpacity.value = Math.max(0.08, op - delta * 1.8);
      } else {
        if (op < 1) matRef.current.uniforms.uOpacity.value = Math.min(1, op + delta * 0.35);
      }
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      position={INITIAL_POSITIONS[idx % 8]}
      rotation={INITIAL_ROTATIONS[idx % 8]}
      linearDamping={0.96}
      angularDamping={0.97}
      gravityScale={0.015}
      restitution={0.25}
      friction={0.05}
      colliders="cuboid"
    >
      <group ref={groupRef}>
        {/* Hologram slab — edge-glow rim with translucent body */}
        <RoundedBox
          args={[1.9, 1.1, 0.045]}
          radius={0.03}
          smoothness={3}
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
        >
          <shaderMaterial
            ref={matRef}
            vertexShader={holoVert}
            fragmentShader={holoFrag}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </RoundedBox>

        {/* Dark reading panel — sits just in front of slab, behind text.
            Gives text contrast against the translucent glowing surface. */}
        <mesh position={[0, 0, 0.028]}>
          <planeGeometry args={[1.74, 0.96]} />
          <meshBasicMaterial color="#010810" transparent opacity={0.62} depthWrite={false} />
        </mesh>

        {/* Classification — top-left metadata */}
        {lesson.classification && (
          <Text
            position={[-0.72, 0.44, 0.05]}
            fontSize={0.038}
            letterSpacing={0.22}
            color="#4adde8"
            anchorX="left"
            anchorY="middle"
            fillOpacity={0.55}
          >
            {lesson.classification}
          </Text>
        )}

        {/* Index — top-right */}
        <Text
          position={[0.78, 0.44, 0.05]}
          fontSize={0.048}
          letterSpacing={0.1}
          color={lesson.accentColor}
          anchorX="right"
          anchorY="middle"
          fillOpacity={0.60}
        >
          {String(idx + 1).padStart(2, "0")}
        </Text>

        {/* Project title — cool white, well below bloom threshold */}
        <Text
          position={[0, 0.28, 0.05]}
          fontSize={0.064}
          letterSpacing={0.18}
          color="#cce6ec"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.97}
        >
          {lesson.projectTitle.toUpperCase()}
        </Text>

        {/* Divider */}
        <mesh position={[0, 0.15, 0.05]}>
          <planeGeometry args={[1.3, 0.0025]} />
          <meshBasicMaterial color={lesson.accentColor} transparent opacity={0.32} depthWrite={false} />
        </mesh>

        {/* Lesson body — soft neutral, high enough contrast on dark panel */}
        <Text
          position={[0, -0.1, 0.05]}
          fontSize={0.055}
          maxWidth={1.54}
          lineHeight={1.5}
          color="#a8c8d0"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.92}
        >
          {lesson.lesson}
        </Text>
      </group>
    </RigidBody>
  );
};
