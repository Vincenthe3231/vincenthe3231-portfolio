import { createContext, MutableRefObject, useContext, useRef } from "react";
import { usePageSimulation, PageSimState } from "./usePageBodies";

export interface BookPhysicsCtxValue {
  simRef:      MutableRefObject<PageSimState[]>;
  /** Normalized turn 0..1 per page. Written by BookInner each frame. */
  turnState:   MutableRefObject<number[]>;
  /** Angular velocity (rad/s, signed) per page. Written by BookInner each frame. */
  angVelState: MutableRefObject<number[]>;
  /** Active drag state. Written by mesh onPointerDown; cleared by global pointerup. */
  dragState:   MutableRefObject<{ pageIdx: number; prevNdcX: number; active: boolean }>;
}

const BookPhysicsCtx = createContext<BookPhysicsCtxValue | null>(null);

export function useBookPhysics(): BookPhysicsCtxValue {
  const ctx = useContext(BookPhysicsCtx);
  if (!ctx) throw new Error("useBookPhysics must be inside BookPhysicsProvider");
  return ctx;
}

interface Props {
  totalPages: number;
  children: React.ReactNode;
}

export function BookPhysicsProvider({ totalPages, children }: Props) {
  const simRef      = usePageSimulation(totalPages);
  const turnState   = useRef<number[]>(new Array(totalPages).fill(0));
  const angVelState = useRef<number[]>(new Array(totalPages).fill(0));
  const dragState   = useRef({ pageIdx: -1, prevNdcX: 0, active: false });

  return (
    <BookPhysicsCtx.Provider value={{ simRef, turnState, angVelState, dragState }}>
      {children}
    </BookPhysicsCtx.Provider>
  );
}
