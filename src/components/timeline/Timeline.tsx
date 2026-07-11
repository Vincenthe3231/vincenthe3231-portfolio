import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { timeline } from "@/data/timeline";
import { SectionHeader } from "../shared/SectionHeader";
import { TimelinePhysicsSpine } from "./TimelinePhysicsSpine";

export const Timeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(800);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section id="timeline" className="relative section-pad">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--background) / 0.0) 0%, hsl(var(--background) / 0.45) 70%, hsl(var(--background) / 0.6) 100%)",
        }}
      />
      <SectionHeader
        eyebrow="05 / Journey"
        title="The arc of an internship."
        description="Eleven projects, multiple organisations, one continuous habit of shipping."
      />

      <div ref={containerRef} className="relative mt-20 max-w-3xl mx-auto">
        {/* Physics-driven aurora spine (replaces static gradient line) */}
        <TimelinePhysicsSpine
          height={containerHeight}
          nodeCount={timeline.length}
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
                transition={{ type: "spring", stiffness: 120, damping: 18, mass: 1 }}
                className={`relative flex flex-col md:flex-row gap-6 md:gap-12 items-start ${
                  isLeft ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Node — aurora glow pulse on scroll */}
                <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10">
                  <motion.span
                    className="block h-3 w-3 rounded-full bg-accent"
                    initial={{ boxShadow: "0 0 10px hsl(var(--accent) / 0.3)" }}
                    whileInView={{
                      boxShadow: [
                        "0 0 10px hsl(var(--accent) / 0.3)",
                        "0 0 30px hsl(var(--aurora-teal) / 0.8)",
                        "0 0 20px hsl(var(--aurora-violet) / 0.5)",
                        "0 0 10px hsl(var(--accent) / 0.3)",
                      ],
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>

                {/* Content card */}
                <div
                  className={`md:w-1/2 pl-12 md:pl-0 ${
                    isLeft ? "md:pr-16 md:text-right" : "md:pl-16"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    {entry.tag}
                  </span>
                  <h3 className="text-display text-3xl md:text-4xl mt-2 mb-3">
                    {entry.title}
                  </h3>
                  <p className="text-foreground/65 leading-relaxed">
                    {entry.description}
                  </p>
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
