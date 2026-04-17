export interface EngineeringValue {
  number: string;
  title: string;
  description: string;
}

export const values: EngineeringValue[] = [
  { number: "01", title: "End-to-end ownership", description: "I build full feature slices — schema, API, UI, deploy. Not tickets." },
  { number: "02", title: "Architecture before code", description: "Client/server splits, monorepos, RBAC models — decided on paper before keystrokes." },
  { number: "03", title: "AI is purposeful", description: "Face recognition for identity. Summarization for productivity. Never demos." },
  { number: "04", title: "Iteration until right", description: "finalv2 exists because v1 wasn't enough. Quality is earned, not declared." },
  { number: "05", title: "Cross-platform thinking", description: "Django + Flutter. Vercel + Supabase. React + Node. Systems, not silos." },
  { number: "06", title: "TypeScript-first discipline", description: "Where applicable, types are non-negotiable. human-api is 100% TypeScript." },
  { number: "07", title: "Production mindset, as a student", description: "Real deploys. Real orgs. Real users. The bar is the bar." },
];
