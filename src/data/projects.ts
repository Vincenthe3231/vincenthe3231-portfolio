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
    techStack: ["Laravel", "Inertia.js", "React", "Tailwind", "PWA"],
    featureCallout:
      "Architected full-stack ownership interfaces with Laravel + Inertia.js + React, refactoring a 1,679-line component to 171 lines (~90% reduction) by extracting 6 custom hooks and 8 sub-components, and migrating hardcoded progress data to a DB-driven model with Malaysian locale timestamps.",
    story: {
      problem:
        "Property owners needed a single, installable surface that behaved like an app but stayed in lockstep with server-authoritative business logic — without re-implementing permissions on both sides of the wire.",
      solution:
        "Adopted Inertia.js to keep Laravel as the source of truth while shipping a React SPA experience. One domain model, two consumers — the server renders permissions and the client honours them.",
      decisions: [
        "Inertia over a separate REST + SPA so the routing and auth model stays in Laravel.",
        "Modularised monolithic components into hooks and sub-components — RenovationProgressDetail dropped from 1,679 to 171 lines.",
        "PWA shell so owners install it once and re-open it like a native tool.",
      ],
      learned:
        "The best UI is useless if it doesn't reflect the true state of the world. Server-driven UI with Inertia.js keeps the client honest without sacrificing interactivity or UX.",
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
    techStack: ["React 19", "Turborepo", "TanStack Router", "TanStack Query", "Radix", "Tailwind"],
    featureCallout:
      "Scaled a Turborepo monorepo with two apps — React 19 + TanStack Router client app and Next.js staff portal — sharing a @repo/ui component library (Radix + Tailwind). Implemented role-based access (top_management, hr_admin, HOD) with full audit trail via spatie/laravel-activitylog surfaced in an infinite-paginated AuditTable.",
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
        "Monorepo is an effective container for related but distinct products, but only if the shared layer is well-factored and the deployment strategy respects the differences.",
    },
    githubUrl: "https://github.com/Vincenthe3231/RenoXpert-Client",
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
        "Developer experience is vital, combination of Docker and Laravel Sail is way superior to XAMPP for backend services management.",
    },
    githubUrl: "https://github.com/Vincenthe3231/RenoXpert-Backend",
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
        "Authentication has many variants and each has its own trade-offs in terms of security, usability, and complexity.",
    },
    githubUrl: "https://flow-office.vercel.app",
    liveUrl: "https://flow-office.vercel.app",
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
    techStack: ["Laravel", "Supabase", "PostgreSQL", "Modular Monolith", "Laravel Telescope", "Docker"],
    featureCallout:
      "Designed a 4-module Laravel monolith (Attendance, Claims, Leave, Shared) — each module owns its ServiceProvider and api.php routes with zero cross-module model imports enforced. Supabase Postgres for storage. Safe DB seeding via custom artisan command with transaction-wrapped SQL blocking DELETE/TRUNCATE/DROP.",
    story: {
      problem:
        "Attendance, leave, and claims all touch the same employees but evolve at different speeds. A naive monolith would tangle them; premature microservices would crush the team.",
      solution:
        "Modular monolith: each domain is its own module under app/Modules/ with a public contract and dedicated ServiceProvider. Supabase Postgres handles storage; Laravel owns the auth layer.",
      decisions: [
        "Modular monolith: each domain under app/Modules/ with a public contract and dedicated ServiceProvider — no cross-module model imports.",
        "Supabase Postgres for storage — data layer separated from application auth.",
        "Custom artisan seed command with transaction-wrapped SQL that blocks DELETE/TRUNCATE/DROP — seeding is safe to run repeatedly.",
      ],
      learned:
        "Boundaries are cheap to draw and expensive to add later. A modular monolith buys you the option to split without vendor lock-in issues.",
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
    techStack: ["Django", "DRF", "Python", "MySQL", "T5-base", "Gemini API"],
    featureCallout:
      "Built Django REST Framework subsystem for a Flutter teammate's note app — 4 post types (Standard, Case Study, Listicle, Infographic) with nested serializers for images and subheadings. Integrated T5-base (beam search, num_beams=4) for AI summarization and Gemini 2.5 Flash for image OCR via inline base64, with Firebase Admin SDK for cross-platform auth.",
    story: {
      problem:
        "An FYP team split across Python and Dart needed one source of truth for notes — without either side blocking the other, and without re-deriving the API contract twice.",
      solution:
        "Django REST Framework owns the data, auth, and API; the web layer uses Django templates; Flutter consumes the same endpoints. T5-base handles AI summarization; Gemini 2.5 Flash replaces local Tesseract for OCR.",
      decisions: [
        "Designed the API contract first — both the web templates and the Flutter app build against it.",
        "Gemini 2.5 Flash for OCR over local Tesseract — no binary dependency, inline base64 image input.",
        "Firebase Admin SDK for auth so Flutter users authenticate without a separate credential flow.",
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
        "Error Taxonomy is a thing. A well-defined contract with structured error codes is invaluable for ML endpoints to determine failure modes and debugging",
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
    techStack: ["Vite", "TypeScript", "React Flow", "Pixi.js", "Zustand", "Supabase", "RLS", "OpenRouter"],
    featureCallout:
      "Built a 17-node-type virtual production canvas with React Flow + Pixi.js hybrid rendering — Pixi handles background grid culling (visible area only) and zoom quantization on CustomEdge reduces re-renders. Automated performance logging via Puppeteer scripts generating Lighthouse reports under /artifacts. Supabase Postgres with RLS enforces per-workspace isolation; scout-execute Edge Function runs the OpenRouter AI pipeline with optimistic locking.",
    story: {
      problem:
        "Creators wanted to wire AI steps together visually — but the demo needed to be a real multi-tenant product with isolated workspaces and a credentialed pipeline runtime from day one.",
      solution:
        "React Flow drives the canvas, Pixi.js handles high-performance background rendering with grid culling, Zustand owns the graph state, Supabase Postgres with RLS enforces per-workspace isolation, and scout-execute Edge Function runs pipelines through OpenRouter.",
      decisions: [
        "RLS first, application logic second — isolation is enforced in the database, not in code.",
        "Pixi.js hybrid background with visible-area culling — canvas stays fast at scale.",
        "Puppeteer + Lighthouse scripts for automated performance budgets under /artifacts.",
      ],
      learned:
        "Frontier products matter at performance which significantly affects UX. Investing in rendering optimizations and performance monitoring from day one pays off in user engagement and retention.",
    },
    githubUrl: "https://github.com/belive-ventures/vision-forge",
  },
];
