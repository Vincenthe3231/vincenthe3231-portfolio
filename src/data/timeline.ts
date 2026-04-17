export interface TimelineEntry {
  tag: string;
  title: string;
  description: string;
}

export const timeline: TimelineEntry[] = [
  {
    tag: "FYP",
    title: "WitsNote shipped",
    description: "Django web subsystem with AI summarization — paired with a Flutter mobile app sharing the same backend contract.",
  },
  {
    tag: "RenoXpert",
    title: "Staff RBAC end-to-end",
    description: "Modelled, enforced and surfaced role-based access across both client and server repos.",
  },
  {
    tag: "Belive-FO",
    title: "Attendance for field ops",
    description: "Delivered the attendance module wired tightly into Lark — clock-ins in chat, source-of-truth in Supabase.",
  },
  {
    tag: "human-api",
    title: "Face recognition live",
    description: "TensorFlow.js + @vladmandic/human packaged into a single Vercel function. 0.8 similarity threshold, structured error contract.",
  },
  {
    tag: "vision-forge",
    title: "Joined belive-ventures",
    description: "Standing up the Supabase backbone — auth, S3 storage, Postgres + RLS — under an AI vision tooling product.",
  },
  {
    tag: "ownerUI",
    title: "Polished to finalv2",
    description: "Three full design passes. Token-driven Tailwind. The system that makes feature ten cheap.",
  },
];
