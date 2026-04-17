import { Suspense, lazy } from "react";
import { motion } from "framer-motion";

const HeroScene = lazy(() => import("./HeroScene"));

const keywords = ["TypeScript", "React", "Node.js", "TensorFlow.js", "Django", "Supabase"];

export const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* 3D background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.85) 85%)",
        }}
      />

      {/* Top nav strip */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 lg:px-20 py-8">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
          Vincenthe · Portfolio · 2025
        </span>
        <span className="hidden md:inline font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
          MYS / Internship
        </span>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col justify-center px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-px w-10 bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Software Engineer · Final Year
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-display text-[18vw] md:text-[14vw] lg:text-[11rem] leading-[0.85] tracking-tight"
        >
          VINCENTHE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-2xl text-xl md:text-2xl text-foreground/80 text-balance"
        >
          Full-stack engineer.{" "}
          <span className="text-accent">AI integrator.</span>{" "}
          <span className="text-foreground/60">Production thinker.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {keywords.map((k, i) => (
            <motion.span
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.08 }}
              className="font-mono text-[11px] uppercase tracking-wider text-foreground/50 px-3 py-1 rounded-full border border-foreground/10 bg-surface/40 backdrop-blur"
            >
              {k}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
};
