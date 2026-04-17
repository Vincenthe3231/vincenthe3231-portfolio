import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { values } from "@/data/values";
import { SectionHeader } from "../shared/SectionHeader";

export const Values = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Translate the horizontal track based on scroll progress.
  // Total horizontal travel = (panels * width) - viewport.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);

  return (
    <section id="values" ref={wrapRef} className="relative" style={{ height: `${values.length * 80}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="px-6 md:px-12 lg:px-20 pt-20 pb-10">
          <SectionHeader
            eyebrow="04 / Philosophy"
            title="Why I build the way I do."
          />
        </div>

        <motion.div style={{ x }} className="flex flex-1 items-center pl-6 md:pl-12 lg:pl-20 will-change-transform">
          {values.map((v, i) => (
            <div
              key={v.number}
              className="relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[42vw] mr-8 md:mr-12 h-[60vh] glass rounded-3xl p-10 md:p-14 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                  Value · {v.number}
                </span>
                <span className="text-display text-7xl md:text-9xl text-foreground/10 leading-none">
                  {v.number}
                </span>
              </div>

              <div>
                <h3 className="text-display text-4xl md:text-6xl leading-[0.95] mb-6 text-balance">
                  {v.title}
                </h3>
                <p className="text-lg md:text-xl text-foreground/70 max-w-md text-balance">
                  {v.description}
                </p>
              </div>

              {/* Decorative geometric metaphor */}
              <div
                aria-hidden
                className="absolute bottom-8 right-8 h-24 w-24 rounded-full border border-accent/30 animate-pulse-glow"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
              <div
                aria-hidden
                className="absolute bottom-12 right-12 h-16 w-16 rounded-full border border-accent/20"
              />
            </div>
          ))}
        </motion.div>

        <div className="px-6 md:px-12 lg:px-20 pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
            ← Scroll to advance →
          </p>
        </div>
      </div>
    </section>
  );
};
