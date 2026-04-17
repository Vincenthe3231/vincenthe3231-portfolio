import { motion } from "framer-motion";
import { timeline } from "@/data/timeline";
import { SectionHeader } from "../shared/SectionHeader";

export const Timeline = () => {
  return (
    <section id="timeline" className="relative section-pad">
      <SectionHeader
        eyebrow="05 / Journey"
        title="The arc of an internship."
        description="Six projects, multiple organisations, one continuous habit of shipping."
      />

      <div className="relative mt-20 max-w-3xl mx-auto">
        {/* Spine */}
        <div
          aria-hidden
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/15 to-transparent md:-translate-x-1/2"
        />

        <div className="space-y-16">
          {timeline.map((entry, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col md:flex-row gap-6 md:gap-12 items-start ${
                  isLeft ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Node */}
                <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10">
                  <span className="block h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_hsl(var(--accent))]" />
                </div>

                {/* Content card */}
                <div className={`md:w-1/2 pl-12 md:pl-0 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    {entry.tag}
                  </span>
                  <h3 className="text-display text-3xl md:text-4xl mt-2 mb-3">{entry.title}</h3>
                  <p className="text-foreground/65 leading-relaxed">{entry.description}</p>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
