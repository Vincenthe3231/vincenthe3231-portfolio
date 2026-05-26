import { useRef, useCallback } from "react";
import { useBabylonScene, ProjectSceneId } from "./useBabylonScene";
import { useAurora } from "@/aurora/AuroraProvider";

interface BabylonShowcaseProps {
  projectId: string;
  isHovered: boolean;
}

/**
 * Babylon.js 3D showcase overlay for project cards.
 * Lazy-loads Babylon on first hover. Canvas moves between cards.
 */
export function BabylonShowcase({ projectId, isHovered }: BabylonShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { attach, detach } = useBabylonScene();
  const { config } = useAurora();
  const wasAttached = useRef(false);

  const isDisabled = config.babylonMaterials === "static";

  const handleHoverChange = useCallback(() => {
    if (isDisabled) return;

    if (isHovered && containerRef.current && !wasAttached.current) {
      wasAttached.current = true;
      attach(containerRef.current, projectId as ProjectSceneId);
    } else if (!isHovered && wasAttached.current) {
      wasAttached.current = false;
      detach();
    }
  }, [isHovered, projectId, attach, detach, isDisabled]);

  // React to hover changes
  if (isHovered !== wasAttached.current) {
    handleHoverChange();
  }

  if (isDisabled) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-60 transition-opacity duration-300"
      style={{ opacity: isHovered ? 0.5 : 0 }}
      aria-hidden="true"
    />
  );
}
