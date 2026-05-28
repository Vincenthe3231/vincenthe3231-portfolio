import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface Fragment {
  tag: string;
  accentVar: string;
  decision: string;
  metric: string;
  artifact?: string;
  span: string; // tailwind column classes
}

const fragments: Fragment[] = [
  {
    tag: "ownerui",
    accentVar: "--p-owner",
    decision: "Extracted six hooks and eight sub-components from a monolithic 1,679-line file. The replacement is 171 lines that read top-to-bottom.",
    metric: "1,679 → 171",
    artifact: "useDelta · useFocusTrap · useShortcutMap · useFieldSync · useDraftQueue · useUndoStack",
    span: "col-span-12 md:col-span-7",
  },
  {
    tag: "renoxpert",
    accentVar: "--p-reno",
    decision: "Two apps inside one Turborepo, sharing @repo/ui — same buttons, same forms, two product surfaces.",
    metric: "2 apps · 1 system",
    span: "col-span-12 md:col-span-4 md:col-start-9",
  },
  {
    tag: "renoxpert",
    accentVar: "--p-reno",
    decision: "Laravel Sail containerises PHP, MySQL and Redis under one compose file. Onboarding becomes a single command.",
    metric: "sail up",
    span: "col-span-12 md:col-span-6 md:col-start-4",
  },
  {
    tag: "belive-client",
    accentVar: "--p-belive",
    decision: "A Next.js BFF proxies every API call. The browser never sees a backend URL, never learns the shape of internal endpoints, never holds a non-httpOnly token.",
    metric: "httpOnly only",
    artifact: "// next.config.ts\nrewrites: () => [{\n  source: '/api/:path*',\n  destination: 'https://internal.belive.local/:path*'\n}]",
    span: "col-span-12 md:col-span-8",
  },
  {
    tag: "belive-backend",
    accentVar: "--p-belive",
    decision: "Four Laravel modules with zero cross-module model imports — enforced, not aspirational. If we split into services later, the seams are already cut.",
    metric: "clean boundary",
    span: "col-span-12 md:col-span-5 md:col-start-5",
  },
  {
    tag: "witsnote",
    accentVar: "--p-wits",
    decision: "Gemini 2.5 Flash replaces Tesseract for OCR. No binary dependency, no Linux-only path, no version pinning. The build manifest got shorter.",
    metric: "cloud OCR",
    span: "col-span-12 md:col-span-7 md:col-start-3",
  },
  {
    tag: "human-api",
    accentVar: "--p-human",
    decision: "TensorFlow.js forced onto the CPU backend after WASM cold-start kept throwing ENOENT in serverless containers. Slower per inference, zero pages.",
    metric: "0 ENOENT",
    artifact: "await tf.setBackend('cpu');\nawait tf.ready();",
    span: "col-span-12 md:col-span-6",
  },
  {
    tag: "vision-forge",
    accentVar: "--p-vision",
    decision: "Pixi.js handles visible-area grid culling. React Flow owns the logical layer. The render loop stops asking React anything.",
    metric: "re-renders ↓",
    span: "col-span-12 md:col-span-5 md:col-start-7",
  },
];

const pullQuoteIndex = 3; // belive BFF — strongest sentence

const FragmentBlock = ({ fragment, index }: { fragment: Fragment; index: number }) => {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={
        reduced
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 80, damping: 22, mass: 1, delay: index * 0.06 }
      }
      className={`group ${fragment.span}`}
    >
      <div className="flex items-baseline gap-3 mb-3">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 text-foreground/60 group-hover:text-foreground/90 group-hover:translate-x-1"
          style={{ color: `hsl(var(${fragment.accentVar}) / 0.9)` }}
        >
          {fragment.tag}
        </span>
        <span className="h-px flex-1 bg-foreground/10" aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/35">
          {fragment.metric}
        </span>
      </div>
      <p className="text-foreground/85 text-base md:text-lg leading-[1.7]">
        {fragment.decision}
      </p>
      {fragment.artifact && (
        <div className="mt-4">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40 hover:text-foreground/80 transition-colors flex items-center gap-2"
          >
            <span aria-hidden className="inline-block w-3 text-center">
              {open ? "−" : "+"}
            </span>
            <span>process artifact</span>
          </button>
          <motion.div
            initial={false}
            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <pre className="mt-3 font-mono text-[11px] leading-relaxed text-foreground/65 whitespace-pre-wrap border-l border-foreground/15 pl-4">
              {fragment.artifact}
            </pre>
          </motion.div>
        </div>
      )}
    </motion.article>
  );
};

export const About = () => {
  const reduced = useReducedMotion();
  const pq = fragments[pullQuoteIndex];

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

      {/* Header — sparse, serif title */}
      <header className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
              02 / About
            </span>
          </div>
          <div className="col-span-12 md:col-span-9 mt-6 md:mt-0">
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-foreground/95"
            >
              I think in <em className="italic font-light text-foreground/75">systems</em>,
              <br />
              not screens.
            </motion.h2>
            <p className="mt-8 max-w-xl text-foreground/55 text-sm md:text-base leading-relaxed">
              Eight projects. Renovation, internal ops, productivity, biometrics, pipeline, AI tooling. What follows are the decisions, not the screenshots.
            </p>
          </div>
        </div>
      </header>

      {/* Fragments — asymmetric editorial grid */}
      <div className="max-w-[1400px] mx-auto mt-24 md:mt-32 grid grid-cols-12 gap-x-6 gap-y-20 md:gap-y-28">
        {fragments.slice(0, pullQuoteIndex).map((f, i) => (
          <FragmentBlock key={i} fragment={f} index={i} />
        ))}
      </div>

      {/* Pull-quote */}
      <motion.figure
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1400px] mx-auto mt-28 md:mt-40"
      >
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="border-t border-foreground/15 pt-10" />
            <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.15] italic text-foreground/90">
              &ldquo;{pq.decision}&rdquo;
            </blockquote>
            <figcaption className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
              <cite className="not-italic">
                — {pq.tag} · {pq.metric}
              </cite>
            </figcaption>
            <div className="border-b border-foreground/15 mt-10" />
          </div>
        </div>
      </motion.figure>

      {/* Remaining fragments */}
      <div className="max-w-[1400px] mx-auto mt-24 md:mt-32 grid grid-cols-12 gap-x-6 gap-y-20 md:gap-y-28">
        {fragments.slice(pullQuoteIndex + 1).map((f, i) => (
          <FragmentBlock key={i + pullQuoteIndex + 1} fragment={f} index={i} />
        ))}
      </div>

      {/* Closing marginalia */}
      <div className="max-w-[1400px] mx-auto mt-28 md:mt-36 grid grid-cols-12 gap-x-6">
        <div className="col-span-12 md:col-span-4 md:col-start-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40 leading-relaxed">
            Eight decisions. Each one made under deadline, each one revisited at least once.
          </p>
        </div>
      </div>
    </section>
  );
};
