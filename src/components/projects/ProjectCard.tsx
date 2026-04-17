import { useRef, useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { TechBadge } from "../shared/TechBadge";

interface Props {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}

export const ProjectCard = ({ project, index, onOpen }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 14;
    const rotX = -(py - 0.5) * 12;
    setTilt({ x: rotX, y: rotY });
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
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className="group relative"
    >
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.title} story`}
        onClick={() => onOpen(project)}
        onKeyDown={onKey}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 200ms ease-out",
          // Project accent as inline var for glow
          ["--p" as never]: `hsl(var(${project.accentVar}))`,
        }}
        className="relative h-full overflow-hidden rounded-3xl border border-foreground/10 bg-surface/60 p-8 backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_30px_80px_-20px_var(--p)]"
      >
        {/* Accent glow blob */}
        <div
          aria-hidden
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: `hsl(var(${project.accentVar}) / 0.5)` }}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: `hsl(var(${project.accentVar}))` }}
              >
                {String(index + 1).padStart(2, "0")} / {project.role}
              </span>
            </div>
            <h3 className="text-display text-4xl md:text-5xl leading-none mb-2">
              {project.title}
            </h3>
            <p className="font-mono text-[11px] uppercase tracking-wider text-foreground/40">
              {project.domain}
            </p>
          </div>
        </div>

        <p className="relative mt-6 text-lg text-foreground/80 leading-snug text-balance">
          {project.tagline}
        </p>

        <p className="relative mt-4 text-sm text-foreground/60 leading-relaxed line-clamp-3">
          {project.featureCallout}
        </p>

        <div className="relative mt-6 flex flex-wrap gap-2">
          {project.techStack.slice(0, 5).map((t) => (
            <TechBadge key={t} label={t} accent={project.accentVar} />
          ))}
          {project.techStack.length > 5 && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 self-center">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="relative mt-8 flex items-center justify-between border-t border-foreground/10 pt-5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-foreground/50 group-hover:text-accent transition-colors">
            Read story →
          </span>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-[11px] uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors"
            aria-label={`${project.title} GitHub repository`}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </motion.div>
  );
};
