import { useRef, useEffect, useCallback } from "react";
import * as CANNON from "cannon-es";

interface CannonWorldOptions {
  gravity?: [number, number, number];
  bodyCount?: number;
}

export interface CannonBodyState {
  x: number;
  y: number;
  z: number;
  qx: number;
  qy: number;
  qz: number;
  qw: number;
}

/**
 * Cannon-es 3D physics world for parallax elements.
 * Zero gravity by default — scroll/mouse apply forces.
 */
export function useCannonWorld(options: CannonWorldOptions = {}) {
  const { gravity = [0, 0, 0], bodyCount = 8 } = options;
  const worldRef = useRef<CANNON.World | null>(null);
  const bodiesRef = useRef<CANNON.Body[]>([]);
  const statesRef = useRef<CannonBodyState[]>([]);

  useEffect(() => {
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(...gravity),
    });
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 5;

    const bodies: CANNON.Body[] = [];
    const states: CannonBodyState[] = [];

    for (let i = 0; i < bodyCount; i++) {
      const body = new CANNON.Body({
        mass: 0.1,
        shape: new CANNON.Sphere(0.5),
        position: new CANNON.Vec3(
          (Math.random() - 0.5) * 400,
          (Math.random() - 0.5) * 200,
          0
        ),
        linearDamping: 0.85,
        angularDamping: 0.9,
      });
      world.addBody(body);
      bodies.push(body);
      states.push({ x: 0, y: 0, z: 0, qx: 0, qy: 0, qz: 0, qw: 1 });
    }

    worldRef.current = world;
    bodiesRef.current = bodies;
    statesRef.current = states;

    return () => {
      world.bodies.forEach((b) => world.removeBody(b));
      worldRef.current = null;
      bodiesRef.current = [];
    };
  }, [bodyCount, gravity[0], gravity[1], gravity[2]]);

  /** Step the world and read body positions into statesRef */
  const step = useCallback((dt: number) => {
    const world = worldRef.current;
    if (!world) return;

    // Fixed timestep w/ accumulator capped at 3 substeps
    world.step(1 / 60, dt * 0.001, 3);

    bodiesRef.current.forEach((body, i) => {
      statesRef.current[i] = {
        x: body.position.x,
        y: body.position.y,
        z: body.position.z,
        qx: body.quaternion.x,
        qy: body.quaternion.y,
        qz: body.quaternion.z,
        qw: body.quaternion.w,
      };
    });
  }, []);

  /** Apply force to all bodies (e.g., from scroll velocity) */
  const applyForce = useCallback((fx: number, fy: number, fz: number = 0) => {
    const force = new CANNON.Vec3(fx, fy, fz);
    bodiesRef.current.forEach((body) => {
      body.applyForce(force);
      body.wakeUp();
    });
  }, []);

  /** Freeze/unfreeze all bodies */
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
