export interface SkillNode {
  name: string;
  group: "Frontend" | "Backend" | "AI/ML" | "Cloud" | "Database" | "Language";
  size: number;          // 8–20
  projects: string[];    // project ids
}

export const skills: SkillNode[] = [
  // Languages
  { name: "TypeScript", group: "Language", size: 20, projects: ["human-api", "ownerui", "renoxpert"] },
  { name: "Python", group: "Language", size: 16, projects: ["witsnote"] },
  { name: "PHP", group: "Language", size: 12, projects: ["belive"] },
  { name: "JavaScript", group: "Language", size: 18, projects: ["ownerui", "renoxpert", "witsnote"] },

  // Frontend
  { name: "React", group: "Frontend", size: 20, projects: ["ownerui", "renoxpert", "vision-forge"] },
  { name: "Next.js", group: "Frontend", size: 16, projects: ["belive"] },
  { name: "Tailwind", group: "Frontend", size: 16, projects: ["ownerui"] },
  { name: "Vite", group: "Frontend", size: 14, projects: ["vision-forge"] },

  // Backend
  { name: "Node.js", group: "Backend", size: 18, projects: ["renoxpert"] },
  { name: "Express", group: "Backend", size: 14, projects: ["renoxpert"] },
  { name: "Django", group: "Backend", size: 16, projects: ["witsnote"] },
  { name: "Laravel", group: "Backend", size: 14, projects: ["belive"] },

  // AI / ML
  { name: "TensorFlow.js", group: "AI/ML", size: 16, projects: ["human-api"] },
  { name: "@vladmandic/human", group: "AI/ML", size: 14, projects: ["human-api"] },
  { name: "AI Summarization", group: "AI/ML", size: 14, projects: ["witsnote"] },

  // Cloud
  { name: "Vercel", group: "Cloud", size: 16, projects: ["human-api", "belive"] },
  { name: "Supabase", group: "Cloud", size: 18, projects: ["human-api", "belive", "vision-forge"] },
  { name: "Firebase", group: "Cloud", size: 12, projects: ["witsnote"] },
  { name: "Lark SDK", group: "Cloud", size: 12, projects: ["belive"] },

  // Database
  { name: "PostgreSQL", group: "Database", size: 16, projects: ["vision-forge", "human-api"] },
  { name: "MySQL", group: "Database", size: 14, projects: ["witsnote"] },
  { name: "RLS", group: "Database", size: 12, projects: ["vision-forge"] },
];
