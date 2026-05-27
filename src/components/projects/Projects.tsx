import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "../shared/SectionHeader";
import { GalaxyScene } from "./galaxy/GalaxyScene";

export const Projects = () => {
  const reduced = useReducedMotion();

  return (
    <section id="projects" className="relative section-pad">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--background) / 0.0) 0%, hsl(var(--background) / 0.55) 70%, hsl(var(--background) / 0.7) 100%)",
        }}
      />
      <SectionHeader
        eyebrow="02 / Work"
        title="Eight things I shipped."
        description="Each project is a nebula in the galaxy below — drag to orbit, scroll to zoom, click a formation to read the story."
      />

      <div className="mt-12 relative w-full">
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-foreground/8 bg-[#04060c]"
          style={{ aspectRatio: "16 / 10", maxHeight: "82vh" }}
        >
          <GalaxyScene />

          {/* Interaction hint */}
          <motion.div
            aria-hidden
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70 whitespace-nowrap px-3 py-1.5 rounded-full bg-background/40 backdrop-blur-md border border-foreground/10">
              drag · scroll · click a nebula
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
