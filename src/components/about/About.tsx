import { motion } from "framer-motion";
import { SectionHeader } from "../shared/SectionHeader";
import { AboutPhysicsElements } from "./AboutPhysicsElements";

const decisions = [
  {
    tag: "ownerui",
    accentVar: "--p-owner",
    decision: "Extracted 6 hooks and 8 sub-components from a monolithic component",
    metric: "1,679 → 171 lines",
  },
  {
    tag: "renoxpert",
    accentVar: "--p-reno",
    decision: "Shared @repo/ui across two apps inside a single Turborepo",
    metric: "2 apps, 1 system",
  },
  {
    tag: "renoxpert",
    accentVar: "--p-reno",
    decision: "Laravel Sail containerises PHP, MySQL and Redis in one compose file",
    metric: "sail up",
  },
  {
    tag: "belive-client",
    accentVar: "--p-belive",
    decision: "Next.js BFF proxies every API call so the browser never sees a backend URL and its internal endpoints",
    metric: "httpOnly only",
  },
  {
    tag: "belive-backend",
    accentVar: "--p-belive",
    decision: "4 Laravel modules with zero cross-module model imports enforced",
    metric: "clean boundary + avoid vendor lock-in if we split later",
  },
  {
    tag: "witsnote",
    accentVar: "--p-wits",
    decision: "Gemini 2.5 Flash replaces Tesseract for OCR with no binary dependency",
    metric: "cloud OCR",
  },
  {
    tag: "human-api",
    accentVar: "--p-human",
    decision: "CPU backend forced on TensorFlow.js to eliminate WASM cold-start errors",
    metric: "0 ENOENT",
  },
  {
    tag: "vision-forge",
    accentVar: "--p-vision",
    decision: "Pixi.js handles visible-area grid culling while React Flow owns the logical layer",
    metric: "re-renders cut",
  },
];

export const About = () => {
  return (
    <section id="about" className="relative section-pad overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--background) / 0.0) 0%, hsl(var(--background) / 0.45) 70%, hsl(var(--background) / 0.6) 100%)",
        }}
      />
      <AboutPhysicsElements />
      <SectionHeader
        eyebrow="01 / About"
        title="I think in systems, not screens."
        description="Eight projects across renovation, internal operations, productivity, biometrics, pipeline, and AI tooling."
      />

      <div className="mt-20">
        {decisions.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 1, delay: i * 0.08 }}
            className="group relative flex flex-col md:flex-row md:items-center gap-2 md:gap-8 py-5 border-t border-foreground/[0.08] pl-4 hover:bg-[hsl(var(--aurora-teal)/0.03)] hover:pl-6 transition-all duration-300 rounded-r-lg"
          >
            {/* Hover accent bar — aurora pulse */}
            <div
              aria-hidden
              className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: `linear-gradient(to bottom, hsl(var(--aurora-green)), hsl(var(${d.accentVar})), hsl(var(--aurora-violet)))`,
              }}
            />

            {/* Project tag */}
            <span
              className="font-mono text-[10px] uppercase tracking-[0.2em] shrink-0 md:min-w-[120px]"
              style={{ color: `hsl(var(${d.accentVar}))` }}
            >
              {d.tag}
            </span>

            {/* Decision text */}
            <p className="text-foreground/70 text-sm leading-relaxed flex-1">
              {d.decision}
            </p>

            {/* Metric */}
            <span className="font-mono text-[11px] text-foreground/30 shrink-0 md:text-right">
              {d.metric}
            </span>
          </motion.div>
        ))}

        {/* Bottom border to close the last row */}
        <div className="border-t border-foreground/[0.08]" />
      </div>

      {/* Code snippet */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
        className="mt-12 glass rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2 border-b border-foreground/10 px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="ml-3 font-mono text-[11px] uppercase tracking-wider text-foreground/40">
            human-api · POST /api/v1/recognize
          </span>
        </div>
        <pre className="p-6 text-sm md:text-base font-mono text-foreground/80 overflow-x-auto leading-relaxed">
{`{
  "userId":      "uuid-of-registered-user",
  "captureUrl":  "https://.../snapshot.jpg",
  "threshold":   0.8
}

→ 200 { match: true,  score: 0.91, faces: 1 }
→ 400 { error: "INVALID_INPUT" }
→ 404 { error: "USER_NOT_REGISTERED" }
→ 502 { error: "INFERENCE_FAILED" }`}
        </pre>
      </motion.div>
    </section>
  );
};
