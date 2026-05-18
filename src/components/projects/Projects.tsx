import { useState } from "react";
import { projects, type Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { SpotlightCard } from "./SpotlightCard";
import { ProjectModal } from "./ProjectModal";
import { SectionHeader } from "../shared/SectionHeader";

export const Projects = () => {
  const [active, setActive] = useState<Project | null>(null);

  const liveProjects = projects.filter((p) => p.liveUrl);
  const otherProjects = projects.filter((p) => !p.liveUrl);

  return (
    <section id="projects" className="relative section-pad">
      <SectionHeader
        eyebrow="02 / Work"
        title="Eight things I shipped."
        description="Each one owned across the stack. Each one running for real users in real organisations."
      />

      <div className="mt-20 space-y-6">
        {/* Spotlighted live projects */}
        {liveProjects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {liveProjects.map((p) => (
              <SpotlightCard
                key={p.id}
                project={p}
                index={projects.indexOf(p)}
                onOpen={setActive}
              />
            ))}
          </div>
        )}

        {/* Divider */}
        {liveProjects.length > 0 && otherProjects.length > 0 && (
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-foreground/8" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/25">
              Other Projects
            </span>
            <div className="flex-1 h-px bg-foreground/8" />
          </div>
        )}

        {/* Regular grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={projects.indexOf(p)}
              onOpen={setActive}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
};
