export interface SkillNode {
  name: string;
  group: "Frontend" | "Backend" | "AI/ML" | "Cloud" | "Database" | "Language";
  size: number;          // 8–20
  projects: string[];    // project ids
}

export const skills: SkillNode[] = [
  // Languages
  { name: "TypeScript", group: "Language", size: 20, projects: ["human-api", "ownerui", "renoxpert-client", "renoxpert-backend"] },
  { name: "Python", group: "Language", size: 16, projects: ["witsnote"] },
  { name: "PHP", group: "Language", size: 12, projects: ["belive-backend"] },
  { name: "JavaScript", group: "Language", size: 18, projects: ["ownerui", "renoxpert-client", "renoxpert-backend", "witsnote"] },

  // Frontend
  { name: "React", group: "Frontend", size: 20, projects: ["ownerui", "renoxpert-client", "vision-forge"] },
  { name: "Next.js", group: "Frontend", size: 16, projects: ["belive-client"] },
  { name: "Tailwind", group: "Frontend", size: 16, projects: ["ownerui"] },
  { name: "Vite", group: "Frontend", size: 14, projects: ["vision-forge"] },

  // Backend
  { name: "Django", group: "Backend", size: 16, projects: ["witsnote"] },
  { name: "Laravel", group: "Backend", size: 14, projects: ["belive-backend"] },

  // AI / ML
  { name: "TensorFlow.js", group: "AI/ML", size: 16, projects: ["human-api"] },
  { name: "@vladmandic/human", group: "AI/ML", size: 14, projects: ["human-api"] },
  { name: "AI Summarization", group: "AI/ML", size: 14, projects: ["witsnote"] },

  // Cloud
  { name: "Vercel", group: "Cloud", size: 16, projects: ["human-api", "belive-client"] },
  { name: "Supabase", group: "Cloud", size: 18, projects: ["human-api", "belive-client", "belive-backend", "vision-forge"] },
  { name: "Firebase", group: "Cloud", size: 12, projects: ["witsnote"] },
  {
    name: "Lark SDK",
    group: "Cloud",
    size: 12,
    projects: ["renoxpert-client", "renoxpert-backend", "belive-client", "belive-backend"],
  },

  // Database
  { name: "PostgreSQL", group: "Database", size: 16, projects: ["vision-forge", "human-api"] },
  { name: "MySQL", group: "Database", size: 14, projects: ["witsnote"] },
  { name: "RLS", group: "Database", size: 12, projects: ["vision-forge"] },
];
