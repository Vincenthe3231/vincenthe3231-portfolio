export interface TimelineEntry {
  tag: string;
  title: string;
  description: string;
}

export const timeline: TimelineEntry[] = [
  {
    tag: "RenoXpert",
    title: "Staff RBAC, end to end",
    description: "Modelled, enforced and surfaced role based access across both the client and server repos.",
  },
  {
    tag: "Belive-FO",
    title: "Attendance for field ops",
    description: "Delivered the attendance module wired tightly into Lark. Clock ins happen in chat, the source of truth lives in Supabase.",
  },
  {
    tag: "human-api",
    title: "Face recognition live",
    description: "TensorFlow.js and @vladmandic/human packaged into a single Vercel function. A 0.8 similarity threshold and a structured error contract.",
  },
  {
    tag: "vision-forge",
    title: "Joined belive-ventures",
    description: "Standing up the Supabase backbone under an AI vision tooling product: auth, S3 storage, and Postgres with RLS.",
  },
  {
    tag: "ownerUI",
    title: "Polished to finalv2",
    description: "Three full design passes. Token driven Tailwind. The system that makes feature ten cheap.",
  },
  {
    tag: "WitsOS",
    title: "Code intelligence, indexed",
    description: "A SQLite knowledge graph and an MCP server that answer codebase questions in one round trip.",
  },
  {
    tag: "crawler",
    title: "Adaptive crawling online",
    description: "Cheerio first, Playwright on escalation, and a Go sidecar pulling assets 50 at a time.",
  },
  {
    tag: "WitsLog",
    title: "Logging without blocking",
    description: "A Rust buffer that batches, drops deliberately under pressure, and drains cleanly at shutdown.",
  },
];
