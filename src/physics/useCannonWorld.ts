import { useRef, useEffect, useCallback } from "react";

export interface CannonBodyState {
  x: number;
  y: number;
  z: number;
  qx: number;
  qy: number;
  qz: number;
  qw: number;
}

interface WorldOptions {
  gravity?: [number, number, number];
  bodyCount?: number;
}

type RapierBody = { translation(): {x:number;y:number;z:number}; rotation(): {x:number;y:number;z:number;w:number}; addForce(f:{x:number;y:number;z:number}, wake:boolean):void; sleep():void; wakeUp():void; };
type RapierWorld = { step():void; timestep: number; };

export function useCannonWorld(options: WorldOptions = {}) {
  const { gravity = [0, 0, 0], bodyCount = 8 } = options;
  const worldRef  = useRef<RapierWorld | null>(null);
  const bodiesRef = useRef<RapierBody[]>([]);
  const statesRef = useRef<CannonBodyState[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const RAPIER = await import("@dimforge/rapier3d-compat");
      await RAPIER.init();
      if (cancelled) return;

      const world = new RAPIER.World({ x: gravity[0], y: gravity[1], z: gravity[2] });
      world.numSolverIterations = 5;

      const bodies: RapierBody[] = [];
      const states: CannonBodyState[] = [];

      for (let i = 0; i < bodyCount; i++) {
        const px = (Math.random() - 0.5) * 400;
        const py = (Math.random() - 0.5) * 200;
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(px, py, 0)
          .setLinearDamping(0.6)
          .setAngularDamping(0.9);
        const body = world.createRigidBody(bodyDesc);
        world.createCollider(RAPIER.ColliderDesc.ball(0.5).setSensor(true), body);
        bodies.push(body);
        states.push({ x: px, y: py, z: 0, qx: 0, qy: 0, qz: 0, qw: 1 });
      }

      worldRef.current  = world as unknown as RapierWorld;
      bodiesRef.current = bodies;
      statesRef.current = states;
    })();

    return () => {
      cancelled = true;
      worldRef.current  = null;
      bodiesRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyCount, gravity[0], gravity[1], gravity[2]]);

  const step = useCallback((dt: number) => {
    const world = worldRef.current;
    if (!world) return;
    world.timestep = Math.min(dt * 0.001, 1 / 30);
    world.step();
    bodiesRef.current.forEach((body, i) => {
      const t = body.translation();
      const r = body.rotation();
      statesRef.current[i] = { x: t.x, y: t.y, z: t.z, qx: r.x, qy: r.y, qz: r.z, qw: r.w };
    });
  }, []);

  const applyForce = useCallback((fx: number, fy: number, fz: number = 0) => {
    bodiesRef.current.forEach((body) => {
      body.addForce({ x: fx, y: fy, z: fz }, true);
    });
  }, []);

  const setSleeping = useCallback((sleeping: boolean) => {
    bodiesRef.current.forEach((body) => {
      if (sleeping) body.sleep();
      else body.wakeUp();
    });
  }, []);

  return {
    worldRef,
    bodiesRef,
    states: statesRef,
    step,
    applyForce,
    setSleeping,
  };
}
