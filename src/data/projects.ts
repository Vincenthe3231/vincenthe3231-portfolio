export interface Project {
  id: string;
  title: string;
  tagline: string;
  domain: string;
  role: string;
  accentVar: string; // CSS var name for project accent
  accentClass: string; // Tailwind class for accent text
  glowFrom: string; // tailwind gradient class
  glowTo: string;
  techStack: string[];
  featureCallout: string;
  story: {
    problem: string;
    solution: string;
    decisions: string[];
    learned: string;
  };
  githubUrl: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: "ownerui",
    title: "ownerUI",
    tagline: "A property-owner dashboard polished until it earned the name finalv2.",
    domain: "Real Estate · Property Management",
    role: "Frontend Engineer",
    accentVar: "--p-owner",
    accentClass: "text-project-owner",
    glowFrom: "from-project-owner/30",
    glowTo: "to-transparent",
    techStack: ["React", "TypeScript", "Tailwind", "Component-Driven UI"],
    featureCallout:
      "Owned the entire owner-facing surface — listing views, status tracking, responsive data displays — and iterated through three full design passes before merging into finalv2.",
    story: {
      problem:
        "Property owners needed a single calm surface to monitor listings, status changes and tenant signals — but the early UI was noisy and inconsistent across breakpoints.",
      solution:
        "Rebuilt the dashboard around a strict component vocabulary: one card primitive, one status atom, one data-row pattern. Every screen composes from the same six pieces.",
      decisions: [
        "Chose a token-driven Tailwind setup over inline styles so the visual language could evolve in one place.",
        "Componentised state pills (active / pending / archived) so future status types are a single data change.",
        "Locked layout to a 12-column grid with deliberate breakpoint snaps — no fluid-everywhere mush.",
      ],
      learned:
        "v1 ships features. v2 ships the system that makes the next ten features cheap. The branch name finalv2 is a quiet promise of that.",
    },
    githubUrl: "https://github.com/Vincenthe3231/ownerUI/tree/finalv2",
  },
  {
    id: "renoxpert",
    title: "RenoXpert",
    tagline: "Staff RBAC, end-to-end, across a decoupled React + Node stack.",
    domain: "Renovation Services · Marketplace",
    role: "Full-Stack Engineer",
    accentVar: "--p-reno",
    accentClass: "text-project-reno",
    glowFrom: "from-project-reno/30",
    glowTo: "to-transparent",
    techStack: ["React", "Node.js", "Express", "JWT", "RBAC", "REST"],
    featureCallout:
      "Designed and shipped the staff-roles slice across both repos — auth middleware, permission gates on the API, conditional UI on the client — so a foreman and an admin literally see different apps from the same codebase.",
    story: {
      problem:
        "RenoXpert had one monolithic 'staff' role. Real teams have crews, supervisors, sales, and admins — each needing different views and different write-permissions over the same data.",
      solution:
        "Modelled roles in the backend with permission tuples, gated routes via Express middleware, and surfaced the same matrix to the client through a typed permissions hook so UI and API can never disagree.",
      decisions: [
        "Permissions as data, not code — adding a role is a migration, not a deploy.",
        "Server is the only source of truth; the client hook only mirrors what the server already enforces.",
        "Failure mode is hide-and-deny: missing permission means the UI element doesn't exist, and the API still 403s if forged.",
      ],
      learned:
        "RBAC is half a security feature and half an information-architecture decision. Get the model right and the UI writes itself.",
    },
    githubUrl: "https://github.com/reno-xpert/RenoXpert-Client/tree/feature/staff-roles",
  },
  {
    id: "belive",
    title: "Belive-FO",
    tagline: "Internal HR ops glued to Lark — Approval, Leave, Attendance, Claims.",
    domain: "Field Operations · Enterprise HR",
    role: "Full-Stack Engineer",
    accentVar: "--p-belive",
    accentClass: "text-project-belive",
    glowFrom: "from-project-belive/30",
    glowTo: "to-transparent",
    techStack: ["Next.js", "Vercel", "Laravel", "Supabase", "Lark SDK", "REST"],
    featureCallout:
      "Contributed across every module — Approval, Leave, Attendance, Claims — wiring each tightly into Lark via the SDK so a clock-in on a phone is the same event a manager approves in chat seconds later.",
    story: {
      problem:
        "Field teams live inside Lark. A separate HR portal would mean two truths — one in chat, one in the app — and operations cannot tolerate that drift.",
      solution:
        "Treated Lark as a first-class client surface, not an after-thought. Backend events fan out into Lark Approval cards; submissions in Lark land back into Supabase as the same canonical record.",
      decisions: [
        "Single canonical record per attendance/leave/claim event — Lark and the web app are both views, never owners.",
        "Laravel for the transactional core where workflows are strict; Supabase for read-optimised surfaces and auth.",
        "Idempotent webhook handlers — Lark will retry, and that's fine.",
      ],
      learned:
        "Enterprise software is judged on the worst day, not the demo. Reliability and predictability are the features.",
    },
    githubUrl: "https://github.com/Belive-FO/Belive-FO-Client/tree/feature/attendance",
  },
  {
    id: "witsnote",
    title: "WitsNote",
    tagline: "FYP — Django web subsystem with AI summarization, paired with a Flutter app.",
    domain: "Academic · Productivity",
    role: "FYP Author · Solo Subsystem",
    accentVar: "--p-wits",
    accentClass: "text-project-wits",
    glowFrom: "from-project-wits/30",
    glowTo: "to-transparent",
    techStack: ["Python", "Django", "MySQL", "Firebase", "AI Summarization"],
    featureCallout:
      "Architected the Django subsystem from schema to template — auth, blog, AI summarization endpoint, Firebase integration — and designed the contract that a teammate's Flutter app consumed without a single re-spec.",
    story: {
      problem:
        "Notes pile up faster than students can re-read them. The team needed a system where mobile capture and web review felt like one product, with summarization that actually saved time.",
      solution:
        "Split the system cleanly: Django owns the data, the auth, and the summarization pipeline; Flutter is a polished consumer. One API contract, two surfaces.",
      decisions: [
        "Designed the Flutter-facing API first — the web templates were built against the same endpoints to keep the contract honest.",
        "Summarization runs as a discrete module so the model can swap without touching auth or storage.",
        "Firebase for cross-platform identity, MySQL for the relational truth.",
      ],
      learned:
        "An FYP is the first project where you cannot blame a framework for your decisions. Owning the architecture means owning the trade-offs.",
    },
    githubUrl: "https://github.com/Vincenthe3231/WitsNote",
  },
  {
    id: "human-api",
    title: "human-api",
    tagline: "Face recognition in production — TensorFlow.js on Vercel functions.",
    domain: "Biometric Identity Verification",
    role: "Solo Architect",
    accentVar: "--p-human",
    accentClass: "text-project-human",
    glowFrom: "from-project-human/30",
    glowTo: "to-transparent",
    techStack: ["TypeScript", "TensorFlow.js", "@vladmandic/human", "Supabase", "Vercel", "pnpm"],
    featureCallout:
      "Designed the entire pipeline: detect a face, embed it, compare against a registered descriptor pulled from Supabase, return a similarity score with a 0.8 threshold — all inside a 60s, 2048MB Vercel function.",
    story: {
      problem:
        "A biometric check needs to be a single network call with a yes/no answer — but ML pipelines are usually multi-service, multi-language, and slow to deploy.",
      solution:
        "Collapsed the whole pipeline into one TypeScript serverless function. Human library handles detection and embedding, Supabase stores the reference URL, the function returns a structured 200 / 400 / 404 / 502 / 500 contract.",
      decisions: [
        "TypeScript end-to-end so the API contract is the same artifact as the implementation.",
        "Configured 2048MB / 60s on Vercel — enough headroom for the TF.js cold-start without over-paying.",
        "Structured error codes, not strings — 400 means the input is wrong, 502 means downstream broke, 500 means I broke.",
      ],
      learned:
        "ML in production isn't about the model — it's about the contract around the model. Threshold tuning and error taxonomy are the real engineering.",
    },
    githubUrl: "https://github.com/Vincenthe3231/human-api",
    liveUrl: "https://human-api-blond.vercel.app",
  },
  {
    id: "vision-forge",
    title: "vision-forge",
    tagline: "An AI vision pipeline at belive-ventures — where I'm pointing next.",
    domain: "AI Vision · Generative Tooling",
    role: "Contributor · belive-ventures",
    accentVar: "--p-vision",
    accentClass: "text-project-vision",
    glowFrom: "from-project-vision/30",
    glowTo: "to-transparent",
    techStack: ["Vite + React", "Supabase", "PostgreSQL", "RLS", "S3 Storage", "Auth"],
    featureCallout:
      "Wired the Supabase backbone — auth, S3-backed storage, Postgres with row-level security — so the AI vision tooling has a credentialed, multi-tenant foundation from day one.",
    story: {
      problem:
        "AI tooling demos are easy. Turning one into a product means you need real auth, real storage, and real isolation between users — before the first feature ships.",
      solution:
        "Stood up the Supabase layer: auth flows, S3 storage policies, and RLS on every Postgres table so a user can only ever see their own forged outputs.",
      decisions: [
        "RLS first, application logic second — never trust the client even when you wrote it.",
        "Storage policies mirror table policies so a leaked URL still hits an authz check.",
        "Vite + React on the client to keep the tooling fast to iterate while the AI surface evolves.",
      ],
      learned:
        "Frontier products live or die on their boring foundation. Auth, storage, isolation — get those right and the AI part has somewhere safe to stand.",
    },
    githubUrl: "https://github.com/belive-ventures/vision-forge",
  },
];
