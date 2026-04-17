import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";
import { TechBadge } from "../shared/TechBadge";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <button
            aria-label="Close project"
            onClick={onClose}
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} project details`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-t-3xl md:rounded-3xl border border-foreground/10 bg-surface-elevated/95 backdrop-blur-2xl shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.7)]"
            style={{
              borderTopColor: `hsl(var(${project.accentVar}) / 0.4)`,
            }}
          >
            {/* Accent strip */}
            <div
              className="h-1 w-full"
              style={{ background: `hsl(var(${project.accentVar}))` }}
            />

            <div className="p-8 md:p-12">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: `hsl(var(${project.accentVar}))` }}
                  >
                    {project.role} · {project.domain}
                  </span>
                  <h3 className="text-display text-5xl md:text-6xl mt-3">{project.title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full border border-foreground/15 h-10 w-10 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-foreground/40 transition"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <p className="text-xl text-foreground/85 text-balance">{project.tagline}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <TechBadge key={t} label={t} accent={project.accentVar} />
                ))}
              </div>

              <div className="hairline my-10" />

              <Block label="Problem" body={project.story.problem} />
              <Block label="Solution" body={project.story.solution} />

              <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mt-10 mb-4">
                Key decisions
              </h4>
              <ul className="space-y-3">
                {project.story.decisions.map((d, i) => (
                  <li key={i} className="flex gap-3 text-foreground/80 leading-relaxed">
                    <span
                      className="mt-2 h-1 w-3 flex-shrink-0"
                      style={{ background: `hsl(var(${project.accentVar}))` }}
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <Block label="What I learned" body={project.story.learned} className="mt-10" />

              <div className="hairline my-10" />

              <div className="flex flex-wrap gap-3">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-foreground text-background px-5 py-2.5 font-mono text-xs uppercase tracking-wider hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  View repository ↗
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-foreground/20 px-5 py-2.5 font-mono text-xs uppercase tracking-wider hover:border-accent hover:text-accent transition-colors"
                  >
                    Live deploy ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Block = ({ label, body, className = "" }: { label: string; body: string; className?: string }) => (
  <div className={className}>
    <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-3">{label}</h4>
    <p className="text-foreground/80 leading-relaxed text-lg">{body}</p>
  </div>
);
