import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface Fragment {
  tag: string;
  accentVar: string;
  decision: string;
  metric: string;
  artifact?: string;
}

const fragments: Fragment[] = [
  {
    tag: "ownerui",
    accentVar: "--p-owner",
    decision: "I took a giant 1,679 line file that nobody wanted to touch and rebuilt it into 171 lines you can actually read top to bottom.",
    metric: "1,679 → 171",
    artifact: "useDelta · useFocusTrap · useShortcutMap · useFieldSync · useDraftQueue · useUndoStack",
  },
  {
    tag: "renoxpert",
    accentVar: "--p-reno",
    decision: "Two apps, one shared toolbox of buttons and forms. Same look, same feel, built once and reused.",
    metric: "2 apps · 1 system",
  },
  {
    tag: "renoxpert",
    accentVar: "--p-reno",
    decision: "The whole backend, database and cache run from one file. A new teammate goes from zero to running with a single command.",
    metric: "sail up",
  },
  {
    tag: "belive-client",
    accentVar: "--p-belive",
    decision: "Every request goes through a middle layer, so the browser never touches the real backend or holds a login token it could leak.",
    metric: "httpOnly only",
    artifact: "// next.config.ts\nrewrites: () => [{\n  source: '/api/:path*',\n  destination: 'https://internal.belive.local/:path*'\n}]",
  },
  {
    tag: "belive-backend",
    accentVar: "--p-belive",
    decision: "I split the app into four separate parts that are not allowed to reach into each other. If we ever break them into services, the lines are already drawn.",
    metric: "clean boundary",
  },
  {
    tag: "human-api",
    accentVar: "--p-human",
    decision: "The fast path kept crashing in the cloud, so I forced the safe one. A little slower per call, but it simply stopped failing.",
    metric: "0 ENOENT",
    artifact: "await tf.setBackend('cpu');\nawait tf.ready();",
  },
  {
    tag: "vision-forge",
    accentVar: "--p-vision",
    decision: "I let a lighter renderer handle the busy background, so the app only redraws what actually changed. It stays smooth even with a lot on screen.",
    metric: "rerenders ↓",
  },
  {
    tag: "witsos",
    accentVar: "--p-witsos",
    decision: "Everything about a codebase lives in one small file. A question that used to take a dozen searches now comes back in one, with the code attached.",
    metric: "1 query",
  },
  {
    tag: "crawler",
    accentVar: "--p-crawl",
    decision: "The crawler reads pages the cheap way first. It only spins up a full browser for the pages that really need one, so it stays fast and cheap.",
    metric: "escalate on fail",
  },
  {
    tag: "witslog",
    accentVar: "--p-log",
    decision: "The logger never freezes the app it is watching. If it gets swamped, it drops a line and keeps going instead of grinding everything to a halt.",
    metric: "0 blocking",
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
      className="group glass rounded-2xl p-6 md:p-7"
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
              Ten projects. Renovation, internal ops, biometrics, AI tooling, code intelligence, crawling, systems. What follows are the decisions, not the screenshots.
            </p>
          </div>
        </div>
      </header>

      {/* Fragments — uniform card grid */}
      <div className="max-w-[1400px] mx-auto mt-24 md:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-start">
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
                {pq.tag} · {pq.metric}
              </cite>
            </figcaption>
            <div className="border-b border-foreground/15 mt-10" />
          </div>
        </div>
      </motion.figure>

      {/* Remaining fragments */}
      <div className="max-w-[1400px] mx-auto mt-24 md:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-start">
        {fragments.slice(pullQuoteIndex + 1).map((f, i) => (
          <FragmentBlock key={i + pullQuoteIndex + 1} fragment={f} index={i} />
        ))}
      </div>

      {/* Closing marginalia */}
      <div className="max-w-[1400px] mx-auto mt-28 md:mt-36 grid grid-cols-12 gap-x-6">
        <div className="col-span-12 md:col-span-4 md:col-start-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40 leading-relaxed">
            Ten decisions. Each one argued for, each one revisited at least once.
          </p>
        </div>
      </div>
    </section>
  );
};
