import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { projects } from "@/data/projects";
import { SectionHeader } from "../shared/SectionHeader";

/** Aurora light sweep card wrapper */
const AuroraLightCard = ({
  children,
  index,
  accentVar,
}: {
  children: React.ReactNode;
  index: number;
  accentVar: string;
}) => {
  const sweepX = useMotionValue(0);
  const bg = useTransform(
    sweepX,
    [0, 100],
    [
      `linear-gradient(135deg, hsl(var(--aurora-green) / 0.04) 0%, transparent 60%)`,
      `linear-gradient(135deg, transparent 40%, hsl(var(--aurora-violet) / 0.06) 100%)`,
    ]
  );

  // Continuous slow sweep
  useEffect(() => {
    const controls = animate(sweepX, [0, 100, 0], {
      duration: 8 + index * 0.5,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return controls.stop;
  }, [sweepX, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * 0.06,
      }}
      whileHover={{ scale: 1.03 }}
      className="glass rounded-2xl p-7 hover:border-foreground/20 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Aurora sweep overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: bg }}
        aria-hidden
      />

      {/* Aurora edge glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px hsl(var(--aurora-teal) / 0.08), 0 0 20px hsl(var(${accentVar}) / 0.1)`,
        }}
        aria-hidden
      />

      <div className="relative">{children}</div>
    </motion.div>
  );
};

export const Lessons = () => {
  return (
    <section id="lessons" className="relative section-pad">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--background) / 0.0) 0%, hsl(var(--background) / 0.45) 70%, hsl(var(--background) / 0.6) 100%)",
        }}
      />
      <SectionHeader
        eyebrow="04 / Lessons"
        title="Eight ships. Eight lessons."
        description="One thing each project forced me to understand — not in theory, but under deadline."
      />

      <div className="mt-20 grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <AuroraLightCard key={p.id} index={i} accentVar={p.accentVar}>
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
          </AuroraLightCard>
        ))}
      </div>
    </section>
  );
};
