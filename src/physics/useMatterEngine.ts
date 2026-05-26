import { useRef, useEffect, useCallback } from "react";
import Matter from "matter-js";

interface MatterEngineOptions {
  /** Number of chain bodies for spine/constraint systems */
  chainLength?: number;
  /** Segment length between chain bodies */
  segmentLength?: number;
  /** Pin top and bottom of chain */
  pinEnds?: boolean;
  /** Center X position for chain */
  centerX?: number;
  /** Start Y position for chain */
  startY?: number;
}

export interface MatterBodyState {
  x: number;
  y: number;
  angle: number;
}

/**
 * Matter.js 2D engine for constraint chains (timeline spine)
 * and interconnected floating elements.
 */
export function useMatterEngine(options: MatterEngineOptions = {}) {
  const {
    chainLength = 20,
    segmentLength = 40,
    pinEnds = true,
    centerX = 0,
    startY = 0,
  } = options;

  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const statesRef = useRef<MatterBodyState[]>([]);

  useEffect(() => {
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0 },
    });

    const bodies: Matter.Body[] = [];
    const constraints: Matter.Constraint[] = [];

    // Create chain bodies
    for (let i = 0; i < chainLength; i++) {
      const body = Matter.Bodies.circle(
        centerX,
        startY + i * segmentLength,
        3,
        {
          mass: 0.05,
          frictionAir: 0.08,
          restitution: 0.2,
        }
      );
      bodies.push(body);
      Matter.Composite.add(engine.world, body);

      // Connect to previous body
      if (i > 0) {
        const constraint = Matter.Constraint.create({
          bodyA: bodies[i - 1],
          bodyB: body,
          stiffness: 0.9,
          damping: 0.1,
          length: segmentLength,
        });
        constraints.push(constraint);
        Matter.Composite.add(engine.world, constraint);
      }
    }

    // Pin endpoints
    if (pinEnds && bodies.length >= 2) {
      const topPin = Matter.Constraint.create({
        bodyA: bodies[0],
        pointB: { x: centerX, y: startY },
        stiffness: 1,
        length: 0,
      });
      const bottomPin = Matter.Constraint.create({
        bodyA: bodies[bodies.length - 1],
        pointB: {
          x: centerX,
          y: startY + (chainLength - 1) * segmentLength,
        },
        stiffness: 1,
        length: 0,
      });
      Matter.Composite.add(engine.world, [topPin, bottomPin]);
    }

    engineRef.current = engine;
    bodiesRef.current = bodies;
    statesRef.current = bodies.map(() => ({ x: 0, y: 0, angle: 0 }));

    return () => {
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      engineRef.current = null;
      bodiesRef.current = [];
    };
  }, [chainLength, segmentLength, pinEnds, centerX, startY]);

  /** Step engine and read positions */
  const step = useCallback((dt: number) => {
    const engine = engineRef.current;
    if (!engine) return;

    Matter.Engine.update(engine, Math.min(dt, 50));

    bodiesRef.current.forEach((body, i) => {
      statesRef.current[i] = {
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
      };
    });
  }, []);

  /** Apply lateral force to all chain bodies (scroll-driven sway) */
  const applyLateralForce = useCallback((force: number) => {
    bodiesRef.current.forEach((body, i) => {
      // Stronger force in middle of chain, weaker at pinned ends
      const normalizedPos = i / (bodiesRef.current.length - 1);
      const envelope = Math.sin(normalizedPos * Math.PI); // peak at center
      Matter.Body.applyForce(body, body.position, {
        x: force * envelope * 0.001,
        y: 0,
      });
    });
  }, []);

  /** Freeze/unfreeze */
  const setSleeping = useCallback((sleeping: boolean) => {
    bodiesRef.current.forEach((body) => {
      Matter.Sleeping.set(body, sleeping);
    });
  }, []);

  return {
    engineRef,
    bodiesRef,
    states: statesRef,
    step,
    applyLateralForce,
    setSleeping,
  };
}
