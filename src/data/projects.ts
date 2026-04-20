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
    title: "OwnerUI",
    tagline: "Inertia.js + Laravel — server logic and client UX as one PWA.",
    domain: "Property Management · PWA",
    role: "Full-Stack Engineer",
    accentVar: "--p-owner",
    accentClass: "text-project-owner",
    glowFrom: "from-project-owner/30",
    glowTo: "to-transparent",
    techStack: ["Laravel", "Inertia.js", "TypeScript", "PWA", "Shared Domain Models"],
    featureCallout:
      "Architected full-stack ownership interfaces by combining Laravel backend services with TypeScript frontends — bridging server-side business logic and client-side UX into a cohesive PWA architecture that handles complex permission flows through shared domain models.",
    story: {
      problem:
        "Property owners needed a single, installable surface that behaved like an app but stayed in lockstep with server-authoritative business logic — without re-implementing permissions on both sides of the wire.",
      solution:
        "Adopted Inertia.js to keep Laravel as the source of truth while shipping a TypeScript SPA experience. One domain model, two consumers — the server renders permissions and the client honours them.",
      decisions: [
        "Inertia over a separate REST + SPA so the routing and auth model stays in Laravel.",
        "Shared TypeScript domain types generated from the backend contract — UI cannot drift from server truth.",
        "PWA shell so owners install it once and re-open it like a native tool.",
      ],
      learned:
        "The cleanest full-stack apps treat the frontend as a view of the backend, not a parallel system. Inertia made that literal.",
    },
    githubUrl: "https://github.com/Vincenthe3231/ownerUI/tree/finalv2",
  },
  {
    id: "renoxpert-client",
    title: "RenoXpert Client",
    tagline: "Next.js + TanStack Query — a Turborepo monorepo with a shared UI system.",
    domain: "Renovation Services · Monorepo",
    role: "Frontend Engineer",
    accentVar: "--p-reno",
    accentClass: "text-project-reno",
    glowFrom: "from-project-reno/30",
    glowTo: "to-transparent",
    techStack: ["Next.js", "Turborepo", "TanStack Query", "Radix", "Tailwind", "pnpm workspaces"],
    featureCallout:
      "Mastered monorepo scaling with Turborepo across multiple React applications (client and staff portal). Implemented a shared UI component system via Radix and Tailwind, achieving type-safe routing through TanStack Query while maintaining independent deployment pipelines through pnpm workspaces.",
    story: {
      problem:
        "Two distinct apps — a public client and a staff portal — needed a shared design language and shared data fetching primitives without becoming a single deployable blob.",
      solution:
        "Stood up a Turborepo with pnpm workspaces, extracted a Radix + Tailwind UI package, and centralised data access through TanStack Query so both apps speak the same language to the same API.",
      decisions: [
        "pnpm workspaces over npm — disk-efficient and strict about phantom deps.",
        "Radix primitives + Tailwind tokens so accessibility comes for free and theming stays declarative.",
        "Independent Next.js deploys per app — shared code, separate release cadences.",
      ],
      learned:
        "Monorepos pay off when the boundaries are honest. Shared UI yes, shared deploy pipeline no.",
    },
    githubUrl: "https://github.com/reno-xpert/RenoXpert-Client/tree/feature/staff-roles",
  },
  {
    id: "renoxpert-backend",
    title: "RenoXpert Backend",
    tagline: "Laravel + Laravel Sail — RBAC and a one-command Docker dev workflow.",
    domain: "Renovation Services · Backend / DevOps",
    role: "Backend Engineer",
    accentVar: "--p-reno",
    accentClass: "text-project-reno",
    glowFrom: "from-project-reno/30",
    glowTo: "to-transparent",
    techStack: ["Laravel", "Laravel Sail", "Docker", "RBAC", "Migrations", "Seeders"],
    featureCallout:
      "Built role-based access control systems in Laravel with feature branches for staff authorization. Dockerized the entire development workflow using Laravel Sail, automating migrations, seeding, and service orchestration to eliminate environment drift across teams.",
    story: {
      problem:
        "Staff authorization was being bolted on per-endpoint, and every new contributor spent a day fighting local PHP / MySQL versions before writing a line of code.",
      solution:
        "Modelled roles and permissions as first-class data, gated routes through Laravel middleware, and wrapped the whole stack in Laravel Sail so `sail up` produces an identical environment everywhere.",
      decisions: [
        "Feature branches per staff role so authorization changes ship in reviewable slices.",
        "Sail-managed services (PHP, MySQL, Redis) — no more 'works on my machine'.",
        "Migrations + seeders are the canonical setup, scripted into the boot sequence.",
      ],
      learned:
        "Developer experience is a security feature. When setup is one command, people stop disabling auth locally to 'just test something'.",
    },
    githubUrl: "https://github.com/reno-xpert/RenoXpert-Backend",
  },
  {
    id: "belive-client",
    title: "Belive-FO Client",
    tagline: "Next.js BFF + Lark OAuth + Vercel + Supabase — enterprise SSO done right.",
    domain: "Field Operations · Enterprise HR",
    role: "Frontend Engineer",
    accentVar: "--p-belive",
    accentClass: "text-project-belive",
    glowFrom: "from-project-belive/30",
    glowTo: "to-transparent",
    techStack: ["Next.js", "Vercel", "Supabase", "Lark OAuth", "Zustand", "TanStack Query"],
    featureCallout:
      "Integrated enterprise SSO through Lark OAuth into a Next.js BFF architecture, implementing session-based authentication with httpOnly cookies and CSRF protection. Shipped modern state management via Zustand and server-state caching with TanStack Query for attendance and leave workflows.",
    story: {
      problem:
        "Field teams already live in Lark — forcing a separate login was a non-starter — but the app still needed hardened, enterprise-grade session security on the web.",
      solution:
        "Built a Next.js BFF that owns the OAuth dance with Lark, mints httpOnly session cookies, and enforces CSRF on every mutation. Zustand handles client state; TanStack Query owns server state and caching.",
      decisions: [
        "BFF pattern — the browser never sees a Lark token, only a same-site session cookie.",
        "Strict separation: Zustand for UI state, TanStack Query for anything the server owns.",
        "CSRF protection on every state-changing request, no exceptions for 'internal' routes.",
      ],
      learned:
        "Auth is a UX feature first. If it's invisible to the user and paranoid under the hood, you've done it right.",
    },
    githubUrl: "https://github.com/Belive-FO/Belive-FO-Client/tree/feature/attendance",
  },
  {
    id: "belive-backend",
    title: "Belive-FO Backend",
    tagline: "Laravel + Supabase + Telescope — a modular monolith with real boundaries.",
    domain: "Field Operations · Backend Architecture",
    role: "Backend Engineer",
    accentVar: "--p-belive",
    accentClass: "text-project-belive",
    glowFrom: "from-project-belive/30",
    glowTo: "to-transparent",
    techStack: ["Laravel", "Supabase", "Laravel Telescope", "Spatie Permission", "DDD", "Events"],
    featureCallout:
      "Designed a modular monolith using domain-driven architecture with Spatie Permission for RBAC. Implemented event-driven communication between attendance, leave, and claims modules while maintaining clean boundaries through contracts and avoiding circular dependencies.",
    story: {
      problem:
        "Attendance, leave, and claims all touch the same employees but evolve at different speeds. A naive monolith would tangle them; premature microservices would crush the team.",
      solution:
        "Modular monolith: each domain is its own module with a public contract, communicating via events. Spatie Permission centralises RBAC, Telescope makes the event bus inspectable in dev.",
      decisions: [
        "Modules talk through events and contracts only — no direct cross-module model imports.",
        "Spatie Permission as the single RBAC source rather than per-module ACLs.",
        "Telescope-instrumented in development to make the event flow visible during code review.",
      ],
      learned:
        "Boundaries are cheap to draw and expensive to add later. A modular monolith buys you the option to split — without paying for microservices on day one.",
    },
    githubUrl: "https://github.com/Belive-FO/Belive-FO-Backend",
  },
  {
    id: "witsnote",
    title: "WitsNote",
    tagline: "Django + Jinja2 — the polyglot backend behind a Flutter teammate's app.",
    domain: "Academic · Productivity",
    role: "Backend / FYP Author",
    accentVar: "--p-wits",
    accentClass: "text-project-wits",
    glowFrom: "from-project-wits/30",
    glowTo: "to-transparent",
    techStack: ["Django", "Jinja2", "Python", "MySQL", "Virtualenv", "Static Pipeline"],
    featureCallout:
      "Built a full-stack note-taking subsystem using Django as the backend API while a Flutter teammate handled the mobile layer. Managed Python virtual environments, MySQL integrations, and static asset pipelines to create a scalable polyglot system architecture.",
    story: {
      problem:
        "An FYP team split across Python and Dart needed one source of truth for notes — without either side blocking the other, and without re-deriving the API contract twice.",
      solution:
        "Django owns the data, the auth and the API; Jinja2 templates serve a web companion; Flutter consumes the same endpoints. Virtualenv + a deterministic static pipeline keep environments reproducible.",
      decisions: [
        "Designed the API contract first — both the web templates and the Flutter app build against it.",
        "MySQL for relational truth; Django ORM for migrations and admin.",
        "Strict virtualenv discipline so the Python side never poisons the teammate's machine.",
      ],
      learned:
        "Polyglot stacks live or die on the contract between languages. Pin the API, and the rest follows.",
    },
    githubUrl: "https://github.com/Vincenthe3231/WitsNote",
  },
  {
    id: "human-api",
    title: "Human-API",
    tagline: "100% TypeScript on a Vercel Edge Function — face recognition as one call.",
    domain: "Biometric Identity Verification",
    role: "Solo Architect",
    accentVar: "--p-human",
    accentClass: "text-project-human",
    glowFrom: "from-project-human/30",
    glowTo: "to-transparent",
    techStack: ["TypeScript", "TensorFlow.js", "Vercel Edge", "Supabase", "@vladmandic/human"],
    featureCallout:
      "Engineered a specialized face recognition API using TensorFlow.js and Supabase for biometric verification. Optimized inference performance on Vercel Edge Functions (2048MB memory, 60s duration) and implemented Supabase integration for retrieving face descriptors and computing real-time embeddings.",
    story: {
      problem:
        "Biometric verification needs to be a single network call with a yes/no answer — but ML pipelines are usually multi-service, multi-language and slow to deploy.",
      solution:
        "Collapsed the entire pipeline into one TypeScript Edge Function: pull the registered descriptor from Supabase, compute the live embedding with the Human library, return a similarity score with a structured contract.",
      decisions: [
        "100% TypeScript, end-to-end — the contract is the implementation.",
        "Tuned to 2048MB / 60s on Vercel — enough for the TF.js cold start without overpaying.",
        "Structured error codes (200 / 400 / 404 / 502 / 500) instead of string messages.",
      ],
      learned:
        "Production ML isn't about the model — it's about the contract around the model. Threshold tuning and error taxonomy are the real engineering.",
    },
    githubUrl: "https://github.com/Vincenthe3231/human-api",
    liveUrl: "https://human-api-blond.vercel.app",
  },
  {
    id: "vision-forge",
    title: "Vision Forge",
    tagline: "Vite + TypeScript + Supabase + Vercel — a node-based AI pipeline canvas.",
    domain: "AI Vision · Virtual Production",
    role: "Contributor · belive-ventures",
    accentVar: "--p-vision",
    accentClass: "text-project-vision",
    glowFrom: "from-project-vision/30",
    glowTo: "to-transparent",
    techStack: ["Vite", "TypeScript", "React Flow", "Zustand", "Supabase", "RLS", "Vercel Edge", "OpenRouter"],
    featureCallout:
      "Designed a node-based virtual production pipeline canvas with React Flow and Zustand state management. Integrated Supabase PostgreSQL with RLS policies for multi-tenant workspaces, implemented Vite-powered bundle optimization, and deployed Edge Functions for OpenRouter-backed AI pipeline execution.",
    story: {
      problem:
        "Creators wanted to wire AI steps together visually — but the demo needed to be a real multi-tenant product with isolated workspaces and a credentialed pipeline runtime from day one.",
      solution:
        "React Flow drives the canvas, Zustand owns the graph state, Supabase Postgres with RLS enforces per-workspace isolation, and Vercel Edge Functions execute pipelines through OpenRouter so any model is one node away.",
      decisions: [
        "RLS first, application logic second — isolation is enforced in the database, not in code.",
        "Edge Functions for execution so latency to OpenRouter stays low globally.",
        "Vite for fast iteration on a tooling surface that changes weekly.",
      ],
      learned:
        "Frontier products live or die on their boring foundation. Multi-tenancy, isolation and a credentialed runtime are what make 'AI canvas' more than a demo.",
    },
    githubUrl: "https://github.com/belive-ventures/vision-forge",
  },
];
