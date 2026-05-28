import { MutableRefObject, useRef } from "react";

export type PageSimState = { angle: number; angVel: number };

export const PAGE_W         = 2.4;
export const PAGE_HALF_W    = PAGE_W / 2; // 1.2
export const PAGE_H         = 3.2;
export const PAGE_HALF_H    = PAGE_H / 2; // 1.6
export const PAGE_THICKNESS = 0.002;

export const SPRING_STIFFNESS    = 8;    // N·m/rad
export const SPRING_DAMPING      = 1.2;  // N·m·s/rad — underdamped (~8% overshoot)
export const SCROLL_TORQUE_SCALE = 80;
// Rotational inertia around spine: m*L²/3, m=0.025kg, L=PAGE_W=2.4m
export const PAGE_INERTIA = 0.048;       // kg·m²

export function usePageSimulation(totalPages: number): MutableRefObject<PageSimState[]> {
  return useRef<PageSimState[]>(
    Array.from({ length: totalPages }, () => ({ angle: 0, angVel: 0 })),
  );
}
