import { useState } from "react";
import { projects, type Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { SectionHeader } from "../shared/SectionHeader";

export const Projects = () => {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative section-pad">
      <SectionHeader
        eyebrow="02 / Work"
        title="Six things I shipped."
        description="Each one owned across the stack. Each one running for real users in real organisations."
      />

      <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={setActive} />
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
};
