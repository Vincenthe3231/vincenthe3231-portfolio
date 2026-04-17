import { motion } from "framer-motion";
import { SectionHeader } from "../shared/SectionHeader";

const principles = [
  {
    title: "Owned end-to-end",
    body: "Schema, API, UI, deploy — one engineer, one feature slice. The bug count drops when nobody can pass the buck.",
  },
  {
    title: "Architecture first",
    body: "Clean client/server splits. Monorepos with discipline. RBAC modelled before a single route is wired.",
  },
  {
    title: "AI with intent",
    body: "Face recognition for verification. Summarization for productivity. If it's not solving a real workflow, it doesn't ship.",
  },
  {
    title: "Iteration as standard",
    body: "finalv2 isn't a typo — it's a promise. v1 ships features, v2 ships the system that makes the next ten cheap.",
  },
];

export const About = () => {
  return (
    <section id="about" className="relative section-pad">
      <SectionHeader
        eyebrow="01 / About"
        title="I think in systems, not screens."
        description="Six projects across real estate, renovation, HR ops, academic productivity, biometrics and AI tooling — each owned across the stack, each shipped to production."
      />

      <div className="mt-20 grid gap-6 md:grid-cols-2">
        {principles.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-2xl p-8 hover:border-accent/30 transition-colors duration-300"
          >
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="text-display text-3xl">{p.title}</h3>
            </div>
            <p className="text-foreground/70 leading-relaxed">{p.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Code snippet */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
