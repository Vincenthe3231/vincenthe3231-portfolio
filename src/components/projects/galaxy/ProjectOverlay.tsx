import { AnimatePresence, motion } from "framer-motion";
import { Github, ExternalLink, X } from "lucide-react";
import type { Project } from "@/data/projects";
import { useGalaxyState } from "./useGalaxyState";

interface Props {
  projects: Project[];
}

export function ProjectOverlay({ projects }: Props) {
  const { focusedId, setFocused } = useGalaxyState();
  const proj = focusedId ? projects.find((p) => p.id === focusedId) ?? null : null;

  return (
    <AnimatePresence mode="wait">
      {proj && (
        <motion.div
          key={proj.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex justify-center px-3 pb-3 md:px-4 md:pb-6"
        >
          <div className="pointer-events-auto w-full max-w-3xl rounded-xl md:rounded-2xl border border-foreground/12 bg-background/70 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] p-3 md:p-7 relative max-h-[40vh] md:max-h-[60vh] overflow-y-auto overscroll-contain">
            <button
              type="button"
              onClick={() => setFocused(null)}
              aria-label="Close project details"
              className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-md text-foreground/55 hover:text-foreground hover:bg-foreground/8 transition-colors"
            >
              <X size={14} />
            </button>

            {/* Header row: domain + live badge */}
            <div className="flex items-center gap-2 pr-7">
              <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-foreground/45 truncate">
                {proj.domain.split("·")[0].trim()}
              </span>
              {proj.liveUrl && (
                <span className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300/90 shrink-0">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              )}
            </div>

            <h3 className="mt-0.5 text-base md:text-3xl font-medium tracking-tight text-foreground leading-tight">
              {proj.title}
            </h3>
            <p className="mt-1 text-[11px] md:text-[15px] text-foreground/65 leading-snug line-clamp-2 md:line-clamp-none">
              {proj.tagline}
            </p>

            {/* story.problem: hidden on mobile to keep card compact */}
            <p className="hidden md:block mt-4 text-[13.5px] text-foreground/70 leading-relaxed">
              {proj.story.problem}
            </p>

            {/* Tech badges: 4 max on mobile, 7 on desktop */}
            <div className="mt-2 md:mt-4 flex flex-wrap gap-1">
              {proj.techStack.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="md:hidden text-[9px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded border border-foreground/10 text-foreground/55"
                >
                  {t}
                </span>
              ))}
              {proj.techStack.slice(0, 7).map((t) => (
                <span
                  key={`d-${t}`}
                  className="hidden md:inline text-[10.5px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded border border-foreground/10 text-foreground/65"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-2 md:mt-5 flex items-center gap-2 md:gap-3">
              <a
                href={proj.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 md:gap-1.5 text-[11px] md:text-[12.5px] text-foreground/75 hover:text-foreground transition-colors"
              >
                <Github size={12} />
                Source
              </a>
              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 md:gap-1.5 text-[11px] md:text-[12.5px] px-2.5 py-1 md:px-3 md:py-1.5 rounded-md border border-emerald-400/35 text-emerald-200 hover:bg-emerald-400/8 transition-colors"
                >
                  Live Demo
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
