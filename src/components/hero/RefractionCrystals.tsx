import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useAurora } from "@/aurora/AuroraProvider";

interface CrystalDef {
  geometry: string;
  geoArgs: number[];
  position: [number, number, number];
  rotSpeed: number;
  rotAxis: [number, number, number];
  thickness: number;
  ior: number;
  chromaticAberration: number;
  dispersalDir: [number, number, number];
}

const CRYSTAL_SHAPES: CrystalDef[] = [
  {
    geometry: "icosahedron",
    geoArgs: [0.8, 0],
    position: [2.2, -0.3, 2],
    rotSpeed: 0.003,
    rotAxis: [0.3, 1, 0.2],
    thickness: 1.8,
    ior: 1.5,
    chromaticAberration: 0.18,
    dispersalDir: [1, 0.5, 0.3],
  },
  {
    geometry: "octahedron",
    geoArgs: [0.7, 0],
    position: [-2.5, 0.8, 1.5],
    rotSpeed: 0.004,
    rotAxis: [0.5, 0.8, 0.3],
    thickness: 2.0,
    ior: 1.4,
    chromaticAberration: 0.22,
    dispersalDir: [-1, 0.7, 0.2],
  },
  {
    geometry: "torusKnot",
    geoArgs: [0.45, 0.16, 80, 16],
    position: [3.5, 1.5, 0.5],
    rotSpeed: 0.002,
    rotAxis: [0.2, 0.6, 1],
    thickness: 1.5,
    ior: 1.6,
    chromaticAberration: 0.15,
    dispersalDir: [1, 1, -0.5],
  },
  {
    geometry: "sphere",
    geoArgs: [0.6, 48, 48],
    position: [-1.5, -1.0, 2.5],
    rotSpeed: 0.005,
    rotAxis: [1, 0.3, 0.5],
    thickness: 2.2,
    ior: 1.3,
    chromaticAberration: 0.25,
    dispersalDir: [-0.5, -1, 0.5],
  },
  {
    geometry: "dodecahedron",
    geoArgs: [0.65, 0],
    position: [0.5, 2.0, 1.0],
    rotSpeed: 0.0035,
    rotAxis: [0.7, 0.4, 0.6],
    thickness: 1.6,
    ior: 1.55,
    chromaticAberration: 0.2,
    dispersalDir: [0.3, 1.2, 0.1],
  },
  {
    geometry: "cone",
    geoArgs: [0.55, 1.1, 6],
    position: [-3.0, -0.5, 1.8],
    rotSpeed: 0.004,
    rotAxis: [0.4, 1, 0.3],
    thickness: 1.9,
    ior: 1.45,
    chromaticAberration: 0.17,
    dispersalDir: [-1.2, -0.3, 0.4],
  },
];

const AURORA_TEAL = new THREE.Color("hsl(172, 85%, 45%)");
const NEBULA_VIOLET = new THREE.Color("hsl(270, 60%, 60%)");

function CrystalShape({ def }: { def: CrystalDef }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { uniforms, config } = useAurora();
  const lerpedMouse = useRef({ x: 0, y: 0 });
  const attenColor = useMemo(() => AURORA_TEAL.clone(), []);

  // Normalize dispersal direction
  const dispersalNorm = useMemo(() => {
    const len = Math.sqrt(
      def.dispersalDir[0] ** 2 + def.dispersalDir[1] ** 2 + def.dispersalDir[2] ** 2
    );
    return def.dispersalDir.map((d) => d / len) as [number, number, number];
  }, [def.dispersalDir]);

  const geometry = useMemo(() => {
    switch (def.geometry) {
      case "icosahedron":
        return new THREE.IcosahedronGeometry(...(def.geoArgs as [number, number]));
      case "octahedron":
        return new THREE.OctahedronGeometry(...(def.geoArgs as [number, number]));
      case "torusKnot":
        return new THREE.TorusKnotGeometry(
          ...(def.geoArgs as [number, number, number, number])
        );
      case "sphere":
        return new THREE.SphereGeometry(
          ...(def.geoArgs as [number, number, number])
        );
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(...(def.geoArgs as [number, number]));
      case "cone":
        return new THREE.ConeGeometry(
          ...(def.geoArgs as [number, number, number])
        );
      default:
        return new THREE.SphereGeometry(0.5, 32, 32);
    }
  }, [def.geometry, def.geoArgs]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const u = uniforms.current;

    // Scroll dispersal — crystals drift outward
    const scrollAmt = u.smoothScroll * 8;
    mesh.position.x = def.position[0] + dispersalNorm[0] * scrollAmt;
    mesh.position.y = def.position[1] + dispersalNorm[1] * scrollAmt;
    mesh.position.z = def.position[2] + dispersalNorm[2] * scrollAmt * 0.3;

    // Depth-based mouse parallax
    const parallaxFactor = def.position[2] * 0.15;
    lerpedMouse.current.x +=
      (-u.mouseX * parallaxFactor - lerpedMouse.current.x) * 0.03;
    lerpedMouse.current.y +=
      (-u.mouseY * parallaxFactor * 0.5 - lerpedMouse.current.y) * 0.03;
    mesh.position.x += lerpedMouse.current.x;
    mesh.position.y += lerpedMouse.current.y;

    // Auto-rotation around custom axis
    mesh.rotateOnAxis(
      new THREE.Vector3(...def.rotAxis).normalize(),
      def.rotSpeed
    );

    // Fade based on section intensity (goes near-invisible during Skills)
    const mat = mesh.material as any;
    if (mat && typeof mat.opacity !== "undefined") {
      mat.opacity = Math.max(0.05, u.sectionIntensity);
    }
    // Lerp attenuationColor: aurora-teal (hero) → nebula-violet (space)
    if (mat && mat.attenuationColor) {
      attenColor.copy(AURORA_TEAL).lerp(NEBULA_VIOLET, u.sceneMode);
      mat.attenuationColor.copy(attenColor);
    }
  });

  return (
    <mesh ref={meshRef} position={def.position} geometry={geometry}>
      <MeshTransmissionMaterial
        transmission={0.97}
        thickness={def.thickness}
        roughness={0.03}
        chromaticAberration={def.chromaticAberration}
        anisotropicBlur={0.4}
        distortion={0.2}
        distortionScale={0.35}
        temporalDistortion={0.06}
        ior={def.ior}
        backside
        resolution={config.refractionResolution}
        color={new THREE.Color("hsl(187, 60%, 85%)")}
        attenuationColor={attenColor}
        attenuationDistance={3}
        transparent
      />
    </mesh>
  );
}

/**
 * Multiple crystal/glass shapes scattered in 3D space.
 * Persist throughout the page — disperse on scroll, react to mouse.
 * Count controlled by performance tier.
 */
export function RefractionCrystals() {
  const { config } = useAurora();

  if (config.refractionResolution === 0) return null;

  const crystals = CRYSTAL_SHAPES.slice(0, config.crystalCount);

  return (
    <>
      {crystals.map((def, i) => (
        <CrystalShape key={i} def={def} />
      ))}
    </>
  );
}
