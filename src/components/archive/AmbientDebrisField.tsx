import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  count?: number; // debris particle count
}

export function AmbientDebrisField({ count = 800 }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  // Seeded initial positions, sizes, drift speeds
  const { positions, sizes, speeds, phases } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const sizes: number[] = [];
    const speeds: THREE.Vector3[] = [];
    const phases: number[] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3 + Math.random() * 14;
      positions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        (Math.random() - 0.5) * 10,
        r * Math.sin(phi) * Math.sin(theta) - 4,
      ));
      sizes.push(0.005 + Math.random() * 0.018);
      speeds.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.003,
      ));
      phases.push(Math.random() * Math.PI * 2);
    }
    return { positions, sizes, speeds, phases };
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      const p = positions[i];
      // Slow orbital drift
      p.x += speeds[i].x;
      p.y += speeds[i].y + Math.sin(t * 0.12 + phases[i]) * 0.0008;
      p.z += speeds[i].z;

      // Wrap particles back loosely
      if (Math.abs(p.x) > 18) speeds[i].x *= -1;
      if (Math.abs(p.y) > 6)  speeds[i].y *= -1;
      if (p.z > 4 || p.z < -18) speeds[i].z *= -1;

      const s = sizes[i] * (0.85 + Math.sin(t * 0.3 + phases[i]) * 0.15);
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 3, 3]} />
      <meshBasicMaterial
        color="#4adde8"
        transparent
        opacity={0.22}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
