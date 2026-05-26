import { useRef, useCallback, useEffect } from "react";

export type ProjectSceneId =
  | "ownerui"
  | "renoxpert-client"
  | "renoxpert-backend"
  | "belive-client"
  | "belive-backend"
  | "witsnote"
  | "human-api"
  | "vision-forge";

/** Lazy-loaded Babylon module cache */
let babylonModule: any = null;
let engineInstance: any = null;
let sharedCanvas: HTMLCanvasElement | null = null;

async function loadBabylon() {
  if (babylonModule) return babylonModule;
  const [
    { Engine },
    { Scene },
    { ArcRotateCamera },
    { HemisphericLight, PointLight },
    { Vector3, Color3, Color4 },
    { MeshBuilder },
    { StandardMaterial, PBRMaterial },
  ] = await Promise.all([
    import("@babylonjs/core/Engines/engine"),
    import("@babylonjs/core/scene"),
    import("@babylonjs/core/Cameras/arcRotateCamera"),
    import("@babylonjs/core/Lights"),
    import("@babylonjs/core/Maths/math"),
    import("@babylonjs/core/Meshes/meshBuilder"),
    import("@babylonjs/core/Materials"),
  ]);
  babylonModule = {
    Engine, Scene, ArcRotateCamera,
    HemisphericLight, PointLight,
    Vector3, Color3, Color4,
    MeshBuilder, StandardMaterial, PBRMaterial,
  };
  return babylonModule;
}

/**
 * Hook managing a shared Babylon.js engine and canvas.
 * Canvas moves between project cards on hover.
 */
export function useBabylonScene() {
  const currentScene = useRef<any>(null);
  const renderLoopId = useRef<number | null>(null);
  const isAttached = useRef(false);

  const attach = useCallback(
    async (container: HTMLElement, projectId: ProjectSceneId) => {
      const B = await loadBabylon();

      if (!sharedCanvas) {
        sharedCanvas = document.createElement("canvas");
        sharedCanvas.style.cssText =
          "width:100%;height:100%;position:absolute;inset:0;border-radius:inherit;pointer-events:none;";
      }

      if (!engineInstance) {
        engineInstance = new B.Engine(sharedCanvas, true, {
          preserveDrawingBuffer: false,
          stencil: false,
          antialias: true,
        });
      }

      // Dispose previous
      if (currentScene.current) {
        currentScene.current.dispose();
        currentScene.current = null;
      }

      container.appendChild(sharedCanvas);
      engineInstance.resize();
      isAttached.current = true;

      const scene = new B.Scene(engineInstance);
      scene.clearColor = new B.Color4(0, 0, 0, 0);
      currentScene.current = scene;

      setupProjectScene(B, scene, projectId);

      if (renderLoopId.current !== null) cancelAnimationFrame(renderLoopId.current);
      const renderLoop = () => {
        if (!isAttached.current || !currentScene.current) return;
        scene.render();
        renderLoopId.current = requestAnimationFrame(renderLoop);
      };
      renderLoopId.current = requestAnimationFrame(renderLoop);
    },
    []
  );

  const detach = useCallback(() => {
    isAttached.current = false;
    if (renderLoopId.current !== null) {
      cancelAnimationFrame(renderLoopId.current);
      renderLoopId.current = null;
    }
    if (currentScene.current) {
      currentScene.current.dispose();
      currentScene.current = null;
    }
    if (sharedCanvas?.parentElement) {
      sharedCanvas.parentElement.removeChild(sharedCanvas);
    }
  }, []);

  useEffect(() => () => detach(), [detach]);

  return { attach, detach };
}

function setupProjectScene(B: any, scene: any, projectId: ProjectSceneId) {
  const camera = new B.ArcRotateCamera("cam", Math.PI / 4, Math.PI / 3, 5, B.Vector3.Zero(), scene);
  camera.lowerRadiusLimit = 4;
  camera.upperRadiusLimit = 6;

  const ambient = new B.HemisphericLight("ambient", new B.Vector3(0, 1, 0), scene);
  ambient.intensity = 0.4;
  const point = new B.PointLight("point", new B.Vector3(2, 3, 2), scene);
  point.intensity = 0.8;
  point.diffuse = new B.Color3(0, 0.9, 1);

  scene.registerBeforeRender(() => { camera.alpha += 0.005; });

  const builders: Record<string, () => void> = {
    ownerui: () => {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          const box = B.MeshBuilder.CreateBox(`b${x}${y}`, { size: 0.6 }, scene);
          box.position = new B.Vector3(x * 0.8, y * 0.8, 0);
          const m = new B.StandardMaterial(`m${x}${y}`, scene);
          m.wireframe = true;
          m.emissiveColor = new B.Color3(0.9, 0.7, 0.2);
          m.alpha = 0.7;
          box.material = m;
        }
      }
    },
    "renoxpert-client": () => createIco(B, scene),
    "renoxpert-backend": () => createIco(B, scene),
    "belive-client": () => {
      const tk = B.MeshBuilder.CreateTorusKnot("tk", { radius: 0.8, tube: 0.25, radialSegments: 64, tubularSegments: 32 }, scene);
      const m = new B.PBRMaterial("tkM", scene);
      m.metallic = 0.1; m.roughness = 0.05;
      m.albedoColor = new B.Color3(0.3, 0.7, 0.6);
      m.alpha = 0.75;
      m.emissiveColor = new B.Color3(0.1, 0.3, 0.25);
      tk.material = m;
    },
    "belive-backend": () => {
      const tk = B.MeshBuilder.CreateTorusKnot("tk", { radius: 0.8, tube: 0.25, radialSegments: 64, tubularSegments: 32 }, scene);
      const m = new B.PBRMaterial("tkM", scene);
      m.metallic = 0.1; m.roughness = 0.05;
      m.albedoColor = new B.Color3(0.3, 0.7, 0.6);
      m.alpha = 0.75;
      m.emissiveColor = new B.Color3(0.1, 0.3, 0.25);
      tk.material = m;
    },
    witsnote: () => {
      for (let i = 0; i < 5; i++) {
        const p = B.MeshBuilder.CreatePlane(`p${i}`, { width: 1.5, height: 1 }, scene);
        p.position = new B.Vector3((Math.random() - 0.5) * 0.5, -1 + i * 0.5, (Math.random() - 0.5) * 0.5);
        p.rotation.x = Math.random() * 0.2;
        const m = new B.StandardMaterial(`pm${i}`, scene);
        m.diffuseColor = new B.Color3(0.66, 0.7, 1);
        m.alpha = 0.5 + i * 0.1;
        m.emissiveColor = new B.Color3(0.2, 0.2, 0.4);
        p.material = m;
      }
    },
    "human-api": () => {
      const s = B.MeshBuilder.CreateSphere("s", { segments: 32, diameter: 2 }, scene);
      const m = new B.StandardMaterial("sm", scene);
      m.wireframe = true;
      m.emissiveColor = new B.Color3(0, 0.9, 1);
      s.material = m;
      const beam = B.MeshBuilder.CreatePlane("beam", { width: 3, height: 0.05 }, scene);
      const bm = new B.StandardMaterial("bm", scene);
      bm.emissiveColor = new B.Color3(0, 1, 0.8);
      bm.alpha = 0.6;
      beam.material = bm;
      let t = 0;
      scene.registerBeforeRender(() => { t += 0.02; beam.position.y = Math.sin(t) * 1.2; });
    },
    "vision-forge": () => {
      const nodes: any[] = [];
      for (let i = 0; i < 8; i++) {
        const s = B.MeshBuilder.CreateSphere(`n${i}`, { diameter: 0.2 }, scene);
        s.position = new B.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
        const m = new B.StandardMaterial(`nm${i}`, scene);
        m.emissiveColor = new B.Color3(0.83, 0.5, 1);
        s.material = m;
        nodes.push(s);
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (B.Vector3.Distance(nodes[i].position, nodes[j].position) < 2.5) {
            B.MeshBuilder.CreateLines(`e${i}${j}`, { points: [nodes[i].position, nodes[j].position] }, scene);
          }
        }
      }
    },
  };

  (builders[projectId] || builders["renoxpert-client"])();
}

function createIco(B: any, scene: any) {
  const ico = B.MeshBuilder.CreateIcoSphere("ico", { radius: 1.2, subdivisions: 2 }, scene);
  const m = new B.PBRMaterial("icoM", scene);
  m.metallic = 0.9; m.roughness = 0.1;
  m.albedoColor = new B.Color3(1, 0.48, 0.23);
  m.emissiveColor = new B.Color3(0.3, 0.1, 0);
  ico.material = m;
}
