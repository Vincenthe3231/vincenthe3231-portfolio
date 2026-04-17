import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { SectionHeader } from "../shared/SectionHeader";

const groupAngles: Record<string, number> = {
  Language: 0,
  Frontend: 60,
  Backend: 120,
  "AI/ML": 180,
  Cloud: 240,
  Database: 300,
};

interface Positioned {
  name: string;
  group: string;
  size: number;
  projects: string[];
  x: number;
  y: number;
}

export const Skills = () => {
  const [hover, setHover] = useState<Positioned | null>(null);

  const nodes = useMemo<Positioned[]>(() => {
    // Group skills by domain and arrange around radial sectors
    const groups = Object.keys(groupAngles);
    return skills.map((s) => {
      const groupIdx = groups.indexOf(s.group);
      const inGroup = skills.filter((x) => x.group === s.group);
      const indexInGroup = inGroup.indexOf(s);
      const baseAngle = (groupAngles[s.group] * Math.PI) / 180;
      const spread = 0.55; // radians within each sector
      const angle = baseAngle - spread / 2 + (indexInGroup / Math.max(inGroup.length - 1, 1)) * spread;
      const radius = 180 + (groupIdx % 2) * 60 + (indexInGroup % 3) * 35;
      return {
        ...s,
        x: 400 + Math.cos(angle) * radius,
        y: 400 + Math.sin(angle) * radius,
      };
    });
  }, []);

  const hoverProjects = hover
    ? projects.filter((p) => hover.projects.includes(p.id))
    : [];

  return (
    <section id="skills" className="relative section-pad">
      <SectionHeader
        eyebrow="03 / Stack"
        title="The toolbox, as a constellation."
        description="Hover any node to see which projects it powered."
      />

      <div className="mt-16 grid lg:grid-cols-[1fr_320px] gap-10 items-center">
        <div className="relative aspect-square w-full max-w-[800px] mx-auto">
          <svg viewBox="0 0 800 800" className="w-full h-full">
            {/* Connecting edges between same-project skills */}
            {nodes.map((a, i) =>
              nodes.slice(i + 1).map((b) => {
                const shared = a.projects.find((p) => b.projects.includes(p));
                if (!shared) return null;
                const isHot =
                  hover && (hover.name === a.name || hover.name === b.name);
                return (
                  <line
                    key={`${a.name}-${b.name}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={isHot ? "hsl(var(--accent))" : "hsl(var(--foreground) / 0.06)"}
                    strokeWidth={isHot ? 1 : 0.5}
                  />
                );
              })
            )}

            {nodes.map((n, i) => {
              const active = hover?.name === n.name;
              return (
                <motion.g
                  key={n.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.025, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "none" }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.size + (active ? 6 : 0)}
                    fill={active ? "hsl(var(--accent))" : "hsl(var(--surface-elevated))"}
                    stroke={active ? "hsl(var(--accent))" : "hsl(var(--foreground) / 0.2)"}
                    strokeWidth={1.2}
                    style={{ transition: "all 220ms cubic-bezier(0.16,1,0.3,1)" }}
                  />
                  <text
                    x={n.x}
                    y={n.y + n.size + 14}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="10"
                    fill={active ? "hsl(var(--accent))" : "hsl(var(--foreground) / 0.55)"}
                    style={{ transition: "fill 220ms" }}
                  >
                    {n.name}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        <div className="glass rounded-2xl p-6 min-h-[200px]">
          {hover ? (
            <>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                {hover.group}
              </span>
              <h4 className="text-display text-3xl mt-2 mb-4">{hover.name}</h4>
              <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 mb-2">
                Used in
              </p>
              <ul className="space-y-1.5">
                {hoverProjects.map((p) => (
                  <li key={p.id} className="text-foreground/80 text-sm">
                    · {p.title}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-foreground/50 text-sm">
              Hover a node to see its project lineage. The constellation lights up across every skill that ever touched the same project.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
