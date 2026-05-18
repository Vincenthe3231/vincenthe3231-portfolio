import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { SectionHeader } from "../shared/SectionHeader";

export const Lessons = () => {
  return (
    <section id="lessons" className="relative section-pad">
      <SectionHeader
        eyebrow="04 / Lessons"
        title="Eight ships. Eight lessons."
        description="One thing each project forced me to understand — not in theory, but under deadline."
      />

      <div className="mt-20 grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-2xl p-7 hover:border-foreground/20 transition-colors duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: `hsl(var(${p.accentVar}))` }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] text-foreground/20">·</span>
              <span
                className="font-mono text-[10px] uppercase tracking-wider"
                style={{ color: `hsl(var(${p.accentVar}) / 0.7)` }}
              >
                {p.title}
              </span>
            </div>

            <p className="text-foreground/85 leading-relaxed text-balance">
              {p.story.learned}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
