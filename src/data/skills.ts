export interface SkillNode {
  name: string;
  group: "Frontend" | "Backend" | "AI/ML" | "Cloud" | "Database" | "Language";
  size: number;          // 8–20
  projects: string[];    // project ids
}

export const skills: SkillNode[] = [
  // Languages
  { name: "TypeScript", group: "Language", size: 20, projects: ["human-api", "renoxpert-client", "belive-client", "vision-forge", "witsos", "crawler"] },
  { name: "Python",     group: "Language", size: 16, projects: ["witsnote"] },
  { name: "PHP",        group: "Language", size: 12, projects: ["renoxpert-backend", "belive-backend"] },
  { name: "JavaScript", group: "Language", size: 18, projects: ["ownerui", "witsnote"] },
  { name: "Rust",       group: "Language", size: 14, projects: ["witslog"] },
  { name: "Go",         group: "Language", size: 12, projects: ["crawler"] },

  // Frontend
  { name: "React",      group: "Frontend", size: 20, projects: ["ownerui", "renoxpert-client", "belive-client", "vision-forge"] },
  { name: "Next.js",    group: "Frontend", size: 16, projects: ["renoxpert-client", "belive-client"] },
  { name: "Tailwind",   group: "Frontend", size: 16, projects: ["ownerui", "renoxpert-client", "belive-client", "vision-forge"] },
  { name: "Vite",       group: "Frontend", size: 14, projects: ["renoxpert-client", "vision-forge"] },
  { name: "Inertia.js", group: "Frontend", size: 12, projects: ["ownerui"] },

  // Backend
  { name: "Django",     group: "Backend", size: 16, projects: ["witsnote"] },
  { name: "Laravel",    group: "Backend", size: 14, projects: ["ownerui", "renoxpert-backend", "belive-backend"] },
  { name: "Docker",     group: "Backend", size: 12, projects: ["renoxpert-backend", "belive-backend"] },
  { name: "Playwright", group: "Backend", size: 12, projects: ["crawler"] },
  { name: "MCP",        group: "Backend", size: 12, projects: ["witsos"] },

  // AI/ML
  { name: "TensorFlow.js",     group: "AI/ML", size: 16, projects: ["human-api"] },
  { name: "@vladmandic/human", group: "AI/ML", size: 14, projects: ["human-api"] },
  { name: "Hugging Face",      group: "AI/ML", size: 14, projects: ["witsnote"] },
  { name: "OpenRouter",        group: "AI/ML", size: 12, projects: ["vision-forge"] },
  { name: "Gemini API",        group: "AI/ML", size: 12, projects: ["witsnote"] },

  // Cloud
  { name: "Vercel",   group: "Cloud", size: 16, projects: ["human-api", "belive-client", "vision-forge"] },
  { name: "Supabase", group: "Cloud", size: 18, projects: ["human-api", "belive-client", "belive-backend", "vision-forge"] },
  { name: "Firebase", group: "Cloud", size: 12, projects: ["witsnote"] },
  { name: "Lark SDK", group: "Cloud", size: 12, projects: ["belive-client", "belive-backend"] },

  // Database
  { name: "PostgreSQL", group: "Database", size: 16, projects: ["vision-forge", "human-api", "belive-backend"] },
  { name: "MySQL",      group: "Database", size: 14, projects: ["witsnote", "renoxpert-backend"] },
  { name: "RLS",        group: "Database", size: 12, projects: ["vision-forge"] },
  { name: "SQLite",     group: "Database", size: 12, projects: ["witsos"] },
];
