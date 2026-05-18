import { useRef, useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { TechBadge } from "../shared/TechBadge";

interface Props {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}

export const SpotlightCard = ({ project, index, onOpen }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: -(py - 0.5) * 8, y: (px - 0.5) * 10 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(project);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className="group relative"
    >
      <div
        ref={ref}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 220ms ease-out",
          ["--p" as never]: `hsl(var(${project.accentVar}))`,
        }}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className="relative h-full overflow-hidden rounded-3xl border border-foreground/10 bg-surface/60 backdrop-blur-xl hover:shadow-[0_40px_100px_-20px_var(--p)] hover:border-foreground/20 transition-all duration-500"
      >
        {/* Primary glow blob */}
        <div
          aria-hidden
          className="absolute -top-28 -right-28 h-80 w-80 rounded-full opacity-35 blur-3xl transition-opacity duration-500 group-hover:opacity-65"
          style={{ background: `hsl(var(${project.accentVar}) / 0.55)` }}
        />
        {/* Secondary glow blob */}
        <div
          aria-hidden
          className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
          style={{ background: `hsl(var(${project.accentVar}) / 0.3)` }}
        />

        {/* Pulsing Live badge - top right */}
        <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-accent"
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            Live
          </span>
        </div>

        {/* Clickable main body */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`Open ${project.title} story`}
          onClick={() => onOpen(project)}
          onKeyDown={onKey}
          className="relative p-8 pb-4 cursor-pointer"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ color: `hsl(var(${project.accentVar}))` }}
            >
              {String(index + 1).padStart(2, "0")} / {project.role}
            </span>
            <span className="font-mono text-[10px] text-foreground/20">·</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
              {project.domain}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-display text-4xl md:text-5xl leading-none mb-3">
            {project.title}
          </h3>

          {/* Tagline */}
          <p className="text-lg text-foreground/80 leading-snug mb-5 text-balance">
            {project.tagline}
          </p>

          {/* Feature callout — full, no line-clamp */}
          <p className="text-sm text-foreground/60 leading-relaxed mb-6">
            {project.featureCallout}
          </p>

          {/* Tech badges — show all */}
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <TechBadge key={t} label={t} accent={project.accentVar} />
            ))}
          </div>
        </div>

        {/* Footer: story link + live demo CTA */}
        <div className="relative px-8 py-5 mt-2 flex items-center justify-between border-t border-foreground/10">
          <button
            onClick={() => onOpen(project)}
            className="font-mono text-[11px] uppercase tracking-wider text-foreground/50 group-hover:text-accent transition-colors cursor-pointer"
          >
            Read story →
          </button>

          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative font-mono text-[11px] uppercase tracking-[0.18em] px-5 py-2.5 rounded-xl border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70 hover:shadow-[0_0_24px_hsl(var(--accent)/0.2)] transition-all duration-300 cursor-pointer"
            aria-label={`${project.title} live demo`}
          >
            Live Demo ↗
          </a>
        </div>
      </div>
    </motion.div>
  );
};
