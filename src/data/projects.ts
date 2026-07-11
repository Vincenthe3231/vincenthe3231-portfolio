export type NebulaArchetype =
  | "pillar"
  | "ring"
  | "supernova"
  | "ionStorm"
  | "molecular"
  | "binary"
  | "protoplanetary"
  | "darkNebula";

export interface NebulaSpec {
  archetype: NebulaArchetype;
  colorPrimary: string;   // ionization core color
  colorSecondary: string; // outer gas color
  orbit: {
    radius: number;
    theta: number;     // radians around galactic center
    armIndex: 0 | 1 | 2 | 3;
    elevation: number; // y offset
  };
  scale: number;
  rotationSpeed: number;
  turbulence: number; // 0..1
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  domain: string;
  role: string;
  accentVar: string;
  accentClass: string;
  glowFrom: string;
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
  nebula: NebulaSpec;
}

export const projects: Project[] = [
  {
    id: "ownerui",
    title: "OwnerUI",
    tagline: "Inertia.js and Laravel, server logic and client UX shipped as one PWA.",
    domain: "Property Management · PWA",
    role: "Full Stack Engineer",
    accentVar: "--p-owner",
    accentClass: "text-project-owner",
    glowFrom: "from-project-owner/30",
    glowTo: "to-transparent",
    techStack: ["Laravel", "Inertia.js", "React", "Tailwind", "PWA"],
    featureCallout:
      "Full stack ownership interfaces built on Laravel, Inertia.js and React. One monster component went from 1,679 lines to 171, a cut of roughly 90 percent, by extracting 6 custom hooks and 8 subcomponents. Progress data moved off hardcoded values onto a database driven model with Malaysian locale timestamps.",
    story: {
      problem:
        "Property owners needed one installable surface that felt like an app. The catch: business logic lives on the server, and nobody wants to implement permissions twice.",
      solution:
        "Inertia.js keeps Laravel as the source of truth while the client ships a React SPA experience. One domain model, two consumers. The server decides permissions and the client honours them.",
      decisions: [
        "Inertia over a separate REST and SPA split, so routing and auth stay in Laravel.",
        "Broke monolithic components into hooks and subcomponents. RenovationProgressDetail dropped from 1,679 lines to 171.",
        "A PWA shell, so owners install once and reopen it like a native tool.",
      ],
      learned:
        "The best UI is useless if it lies about the state of the world. Server driven UI through Inertia.js keeps the client honest without giving up interactivity.",
    },
    githubUrl: "https://github.com/Vincenthe3231/ownerUI/tree/finalv2",
    nebula: {
      archetype: "pillar",
      colorPrimary: "#ffb86b",
      colorSecondary: "#3b2240",
      orbit: { radius: 12, theta: 0.4, armIndex: 0, elevation: 0.6 },
      scale: 1.05,
      rotationSpeed: 0.04,
      turbulence: 0.55,
    },
  },
  {
    id: "renoxpert-client",
    title: "RenoXpert Client",
    tagline: "One Turborepo, two apps, one shared UI system.",
    domain: "Renovation Services · Monorepo",
    role: "Frontend Engineer",
    accentVar: "--p-reno",
    accentClass: "text-project-reno",
    glowFrom: "from-project-reno/30",
    glowTo: "to-transparent",
    techStack: ["React 19", "Turborepo", "TanStack Router", "TanStack Query", "Radix", "Tailwind"],
    featureCallout:
      "Two apps live in one Turborepo. A React 19 client on TanStack Router and a Next.js staff portal, both drawing from a shared @repo/ui library built on Radix and Tailwind. Role based access covers top_management, hr_admin and HOD, with a full audit trail from spatie/laravel-activitylog surfaced in an infinitely paginated AuditTable.",
    story: {
      problem:
        "A public client and a staff portal needed the same design language and the same data fetching primitives. Merging them into one deployable blob was never an option.",
      solution:
        "Stood up a Turborepo on pnpm workspaces, extracted a Radix and Tailwind UI package, and centralised data access through TanStack Query so both apps speak the same language to the same API.",
      decisions: [
        "pnpm workspaces over npm. Light on disk and strict about phantom dependencies.",
        "Radix primitives with Tailwind tokens, so accessibility comes for free and theming stays declarative.",
        "Independent deploys per app. Shared code, separate release cadences.",
      ],
      learned:
        "A monorepo holds related but distinct products well, but only when the shared layer is properly factored and the deployment strategy respects their differences.",
    },
    githubUrl: "https://github.com/Vincenthe3231/RenoXpert-Client",
    nebula: {
      archetype: "protoplanetary",
      colorPrimary: "#8ad3ff",
      colorSecondary: "#1b3050",
      orbit: { radius: 14, theta: 1.3, armIndex: 1, elevation: -0.4 },
      scale: 1.0,
      rotationSpeed: 0.06,
      turbulence: 0.35,
    },
  },
  {
    id: "renoxpert-backend",
    title: "RenoXpert Backend",
    tagline: "RBAC done properly, and a whole dev stack in one command.",
    domain: "Renovation Services · Backend / DevOps",
    role: "Backend Engineer",
    accentVar: "--p-reno",
    accentClass: "text-project-reno",
    glowFrom: "from-project-reno/30",
    glowTo: "to-transparent",
    techStack: ["Laravel", "Laravel Sail", "Docker", "RBAC", "Migrations", "Seeders"],
    featureCallout:
      "Role based access control in Laravel, shipped as reviewable feature branches per staff role. The entire dev workflow runs in Docker through Laravel Sail. Migrations, seeding and service orchestration are automated, and environment drift across the team simply stopped.",
    story: {
      problem:
        "Staff authorization was bolted on endpoint by endpoint. Meanwhile every new contributor lost a day fighting local PHP and MySQL versions before writing any code.",
      solution:
        "Roles and permissions became first class data, routes go through Laravel middleware, and the whole stack lives in Laravel Sail. Running sail up produces an identical environment on every machine.",
      decisions: [
        "Feature branches per staff role, so authorization changes ship in reviewable slices.",
        "Sail manages PHP, MySQL and Redis. No more works on my machine.",
        "Migrations and seeders are the canonical setup, scripted straight into the boot sequence.",
      ],
      learned:
        "Developer experience is vital. Docker with Laravel Sail beats XAMPP by a wide margin for managing backend services.",
    },
    githubUrl: "https://github.com/Vincenthe3231/RenoXpert-Backend",
    nebula: {
      archetype: "darkNebula",
      colorPrimary: "#5e7fbd",
      colorSecondary: "#0a1428",
      orbit: { radius: 16, theta: 2.2, armIndex: 2, elevation: 0.3 },
      scale: 0.9,
      rotationSpeed: 0.03,
      turbulence: 0.7,
    },
  },
  {
    id: "belive-client",
    title: "Belive-FO Client",
    tagline: "Enterprise SSO done right. A Next.js BFF owns the Lark OAuth dance.",
    domain: "Field Operations · Enterprise HR",
    role: "Frontend Engineer",
    accentVar: "--p-belive",
    accentClass: "text-project-belive",
    glowFrom: "from-project-belive/30",
    glowTo: "to-transparent",
    techStack: ["Next.js", "Vercel", "Supabase", "Lark OAuth", "Zustand", "TanStack Query"],
    featureCallout:
      "Enterprise SSO through Lark OAuth, wired into a Next.js BFF. Sessions ride httpOnly cookies with CSRF protection on every mutation. Zustand handles client state, and TanStack Query caches server state for the attendance and leave workflows.",
    story: {
      problem:
        "Field teams already live in Lark, so forcing a separate login was never going to fly. The app still needed hardened, enterprise grade session security on the web.",
      solution:
        "A Next.js BFF owns the OAuth dance with Lark, mints httpOnly session cookies, and enforces CSRF on every mutation. Zustand handles client state. TanStack Query owns server state and caching.",
      decisions: [
        "The BFF pattern. The browser never sees a Lark token, only a same site session cookie.",
        "Strict separation: Zustand for UI state, TanStack Query for anything the server owns.",
        "CSRF protection on every request that changes state. No exceptions for internal routes.",
      ],
      learned:
        "Authentication comes in many flavours. Each one trades security, usability and complexity differently, and you have to pick your poison deliberately.",
    },
    githubUrl: "https://flow-office.vercel.app",
    liveUrl: "https://flow-office.vercel.app",
    nebula: {
      archetype: "ring",
      colorPrimary: "#a8e8ff",
      colorSecondary: "#2a4d7a",
      orbit: { radius: 6.5, theta: 0.0, armIndex: 0, elevation: 0.2 },
      scale: 1.6,
      rotationSpeed: 0.08,
      turbulence: 0.4,
    },
  },
  {
    id: "belive-backend",
    title: "Belive-FO Backend",
    tagline: "A modular monolith with real boundaries. Four modules, zero tangles.",
    domain: "Field Operations · Backend Architecture",
    role: "Backend Engineer",
    accentVar: "--p-belive",
    accentClass: "text-project-belive",
    glowFrom: "from-project-belive/30",
    glowTo: "to-transparent",
    techStack: ["Laravel", "Supabase", "PostgreSQL", "Modular Monolith", "Laravel Telescope", "Docker"],
    featureCallout:
      "A Laravel monolith split into 4 modules: Attendance, Claims, Leave and Shared. Each module owns its ServiceProvider and its api.php routes, and cross module model imports are banned outright. Supabase Postgres holds the data. Seeding runs through a custom artisan command whose transaction wrapped SQL blocks DELETE, TRUNCATE and DROP.",
    story: {
      problem:
        "Attendance, leave and claims all touch the same employees but evolve at different speeds. A naive monolith would tangle them. Premature microservices would crush the team.",
      solution:
        "A modular monolith. Each domain is its own module under app/Modules/ with a public contract and a dedicated ServiceProvider. Supabase Postgres handles storage while Laravel owns the auth layer.",
      decisions: [
        "Each domain lives under app/Modules/ with a public contract and its own ServiceProvider. No cross module model imports, ever.",
        "Supabase Postgres for storage, keeping the data layer separate from application auth.",
        "A custom artisan seed command wraps SQL in transactions and blocks DELETE, TRUNCATE and DROP. Seeding is safe to run again and again.",
      ],
      learned:
        "Boundaries are cheap to draw and expensive to add later. A modular monolith buys the option to split services someday without paying for it now.",
    },
    githubUrl: "https://github.com/Belive-FO/Belive-FO-Backend",
    nebula: {
      archetype: "molecular",
      colorPrimary: "#b89cff",
      colorSecondary: "#241a3d",
      orbit: { radius: 13.5, theta: 3.6, armIndex: 3, elevation: -0.7 },
      scale: 1.0,
      rotationSpeed: 0.025,
      turbulence: 0.6,
    },
  },
  {
    id: "witsnote",
    title: "WitsNote",
    tagline: "The Django backend behind a Flutter teammate's app. One contract, two languages.",
    domain: "Academic · Productivity",
    role: "Backend / FYP Author",
    accentVar: "--p-wits",
    accentClass: "text-project-wits",
    glowFrom: "from-project-wits/30",
    glowTo: "to-transparent",
    techStack: ["Django", "DRF", "Python", "MySQL", "T5-base", "Gemini API"],
    featureCallout:
      "A Django REST Framework subsystem powering a teammate's Flutter note app. Four post types, Standard, Case Study, Listicle and Infographic, with nested serializers for images and subheadings. The T5 base model handles AI summarization with beam search at num_beams=4, Gemini 2.5 Flash reads images through inline base64 OCR, and the Firebase Admin SDK carries auth across platforms.",
    story: {
      problem:
        "An FYP team split across Python and Dart needed one source of truth for notes. Neither side could afford to block the other, and nobody wanted to derive the API contract twice.",
      solution:
        "Django REST Framework owns the data, the auth and the API. The web layer renders Django templates and Flutter consumes the same endpoints. The T5 base model summarizes notes, and Gemini 2.5 Flash replaced local Tesseract for OCR.",
      decisions: [
        "API contract first. Both the web templates and the Flutter app build against it.",
        "Gemini 2.5 Flash for OCR instead of local Tesseract. No binary dependency, just inline base64 image input.",
        "Firebase Admin SDK for auth so Flutter users authenticate without a separate credential flow.",
      ],
      learned:
        "Polyglot stacks live or die on the contract between languages. Pin the API, and the rest follows.",
    },
    githubUrl: "https://github.com/Vincenthe3231/WitsNote",
    nebula: {
      archetype: "binary",
      colorPrimary: "#ffd28a",
      colorSecondary: "#3a2418",
      orbit: { radius: 15, theta: 4.5, armIndex: 0, elevation: 0.8 },
      scale: 0.95,
      rotationSpeed: 0.07,
      turbulence: 0.45,
    },
  },
  {
    id: "human-api",
    title: "Human-API",
    tagline: "Face recognition as one network call. All of it TypeScript, all of it on the edge.",
    domain: "Biometric Identity Verification",
    role: "Solo Architect",
    accentVar: "--p-human",
    accentClass: "text-project-human",
    glowFrom: "from-project-human/30",
    glowTo: "to-transparent",
    techStack: ["TypeScript", "TensorFlow.js", "Vercel Edge", "Supabase", "@vladmandic/human"],
    featureCallout:
      "A face recognition API built on TensorFlow.js and Supabase for biometric verification. Inference is tuned for Vercel Edge Functions at 2048MB memory and a 60s window, pulling registered face descriptors from Supabase and computing live embeddings in real time.",
    story: {
      problem:
        "Biometric verification should be a single network call with a yes or no answer. ML pipelines are usually the opposite: several services, several languages, and slow to deploy.",
      solution:
        "Collapsed the entire pipeline into one TypeScript Edge Function. Pull the registered descriptor from Supabase, compute the live embedding with the Human library, return a similarity score with a structured contract.",
      decisions: [
        "TypeScript from end to end. The contract is the implementation.",
        "Tuned to 2048MB and 60s on Vercel. Enough headroom for the TF.js cold start without overpaying.",
        "Structured error codes (200 / 400 / 404 / 502 / 500) instead of string messages.",
      ],
      learned:
        "Error taxonomy is a real thing. A contract with structured error codes is indispensable for ML endpoints, because failure modes need names before they can be debugged.",
    },
    githubUrl: "https://github.com/Vincenthe3231/human-api",
    liveUrl: "https://human-api-blond.vercel.app",
    nebula: {
      archetype: "supernova",
      colorPrimary: "#ff7d5a",
      colorSecondary: "#5a1830",
      orbit: { radius: 7.5, theta: 3.4, armIndex: 2, elevation: -0.3 },
      scale: 1.6,
      rotationSpeed: 0.05,
      turbulence: 0.85,
    },
  },
  {
    id: "vision-forge",
    title: "Vision Forge",
    tagline: "A visual canvas where AI pipelines are wired together node by node.",
    domain: "AI Vision · Virtual Production",
    role: "Contributor · belive-ventures",
    accentVar: "--p-vision",
    accentClass: "text-project-vision",
    glowFrom: "from-project-vision/30",
    glowTo: "to-transparent",
    techStack: ["Vite", "TypeScript", "React Flow", "Pixi.js", "Zustand", "Supabase", "RLS", "OpenRouter"],
    featureCallout:
      "A virtual production canvas with 17 node types, rendered by React Flow and Pixi.js together. Pixi culls the background grid to the visible area, and zoom quantization on CustomEdge keeps rerenders down. Puppeteer scripts generate Lighthouse reports under /artifacts automatically. Supabase Postgres with RLS isolates every workspace, and the scout-execute Edge Function runs the OpenRouter pipeline with optimistic locking.",
    story: {
      problem:
        "Creators wanted to wire AI steps together visually. The demo still had to be a real product from day one, with isolated workspaces per tenant and a credentialed pipeline runtime.",
      solution:
        "React Flow drives the canvas. Pixi.js renders the background fast with grid culling, Zustand owns the graph state, Supabase Postgres with RLS walls off each workspace, and the scout-execute Edge Function runs pipelines through OpenRouter.",
      decisions: [
        "RLS first, application logic second. Isolation is enforced in the database, not in code.",
        "A Pixi.js hybrid background that culls to the visible area, so the canvas stays fast at scale.",
        "Puppeteer and Lighthouse scripts keep automated performance budgets under /artifacts.",
      ],
      learned:
        "Performance is product. Rendering optimizations and monitoring from day one pay for themselves in engagement and retention.",
    },
    githubUrl: "https://github.com/belive-ventures/vision-forge",
    nebula: {
      archetype: "ionStorm",
      colorPrimary: "#7afff0",
      colorSecondary: "#10324a",
      orbit: { radius: 17, theta: 5.3, armIndex: 1, elevation: 0.5 },
      scale: 1.05,
      rotationSpeed: 0.09,
      turbulence: 0.95,
    },
  },
  {
    id: "witsos",
    title: "WitsOS",
    tagline: "A knowledge graph for any codebase. Ask once, get the answer with source.",
    domain: "Developer Tools · Code Intelligence",
    role: "Solo Architect",
    accentVar: "--p-witsos",
    accentClass: "text-project-witsos",
    glowFrom: "from-project-witsos/30",
    glowTo: "to-transparent",
    techStack: ["TypeScript", "Node.js", "SQLite", "tree-sitter", "MCP", "commander"],
    featureCallout:
      "A code intelligence engine that indexes any repository into a SQLite knowledge graph of symbols, edges and files. Parsing runs on tree-sitter WASM grammars across more than 20 languages, and document extraction reaches into pdf, docx, xlsx, images through OCR and audio through speech to text. A file watcher keeps the index live, and an MCP server lets coding agents query the graph in one round trip instead of a grep and read loop.",
    story: {
      problem:
        "Coding agents burn most of their budget rediscovering a codebase. Every question turns into another grep, another file read, another guess at where a symbol lives.",
      solution:
        "Index the whole repository once into a SQLite graph of symbols, edges and files. After that, one query returns verbatim source plus the call paths between symbols. A watcher keeps the index about a second behind every save.",
      decisions: [
        "SQLite over a server database. The index lives inside the repo, needs zero setup, and reads in under a millisecond.",
        "tree-sitter WASM grammars, so one parser pipeline covers more than 20 languages without native builds.",
        "A guard refuses to index a home directory or a filesystem root. One bad init should never eat a machine.",
      ],
      learned:
        "Tooling earns trust through its failure modes. Telemetry that never breaks the CLI, locks that explain themselves, and guards against catastrophic misuse matter as much as the happy path.",
    },
    githubUrl: "https://github.com/Vincenthe3231/WitsOS",
    nebula: {
      archetype: "molecular",
      colorPrimary: "#5ee8a4",
      colorSecondary: "#0c3524",
      orbit: { radius: 14.5, theta: 2.8, armIndex: 3, elevation: -0.5 },
      scale: 1.05,
      rotationSpeed: 0.045,
      turbulence: 0.5,
    },
  },
  {
    id: "crawler",
    title: "Crawler",
    tagline: "Starts cheap, escalates only when a page fights back.",
    domain: "Data Engineering · Web Crawling",
    role: "Solo Architect",
    accentVar: "--p-crawl",
    accentClass: "text-project-crawl",
    glowFrom: "from-project-crawl/30",
    glowTo: "to-transparent",
    techStack: ["TypeScript", "Crawlee", "Playwright", "Cheerio", "Go", "Node.js"],
    featureCallout:
      "An adaptive crawling system on Crawlee. Cheerio parses plain HTML first because it is cheap, and any page that comes back thin or fails gets queued for a Playwright pass with a real browser. Rate limits trigger exponential backoff that doubles the delay up to 10 seconds. Every job carries its own AbortController, storage directory and status record, driven from both a CLI and a server API. A Go microservice downloads page assets through a 50 worker goroutine pool and files them by MIME type.",
    story: {
      problem:
        "Headless browsers make crawling easy and slow. Plain HTTP parsing is fast but blind to JavaScript rendered pages, and committing to either strategy up front wastes money on one side or misses content on the other.",
      solution:
        "Crawl adaptively. Cheerio goes first on every page. Whatever renders under 100 characters of body text or fails outright lands in a queue that Playwright works through with a real browser, so the heavy path only runs where it earns its cost.",
      decisions: [
        "Cheerio first, Playwright second. The browser is a fallback, never the default.",
        "Exponential backoff on 429 responses, doubling the delay up to a 10 second ceiling instead of hammering hosts.",
        "Asset downloads went to a Go sidecar. A goroutine pool behind a channel semaphore fetches 50 files at a time with one pooled HTTP client.",
      ],
      learned:
        "Escalation beats configuration. A system that notices when the cheap path fails and upgrades itself handles far more of the web than any setting a user would tune by hand.",
    },
    githubUrl: "https://github.com/Vincenthe3231/crawler",
    nebula: {
      archetype: "ionStorm",
      colorPrimary: "#ff7ad1",
      colorSecondary: "#3d1035",
      orbit: { radius: 11, theta: 1.8, armIndex: 1, elevation: 0.4 },
      scale: 0.95,
      rotationSpeed: 0.07,
      turbulence: 0.75,
    },
  },
  {
    id: "witslog",
    title: "WitsLog",
    tagline: "Rust logging that never blocks the caller. Ever.",
    domain: "Systems · Observability",
    role: "Solo Architect",
    accentVar: "--p-log",
    accentClass: "text-project-log",
    glowFrom: "from-project-log/30",
    glowTo: "to-transparent",
    techStack: ["Rust", "Cargo Workspace", "Threads", "Atomics", "Batching"],
    featureCallout:
      "A structured logging workspace in Rust built around one promise: the caller never waits. AsyncBuffer accepts events through a bounded channel and hands them to a dedicated flush thread that writes in batches, on size or on a timer. When the queue fills, the event is dropped and an atomic counter records it, because losing a log line beats blocking the application. Shutdown drains everything still queued before the thread exits.",
    story: {
      problem:
        "Logging sits on the hottest paths of an application, and a logger that blocks under load turns observability into the outage. Most simple loggers do exactly that the moment a sink slows down.",
      solution:
        "Push every event through a bounded channel to a background thread that owns the sink. Batches flush when they reach size or when the interval fires. The hot path only ever pays for an enqueue.",
      decisions: [
        "A bounded queue with deliberate drops. A full buffer sheds events and counts them atomically rather than stalling the caller.",
        "One background thread owns the sink, so batching and slow writes never leak into application code.",
        "Graceful shutdown drains the queue completely. The final events of a dying process are exactly when logs matter most.",
      ],
      learned:
        "Backpressure is a design decision, not an accident. Deciding up front what happens when the buffer fills is what separates a logger you trust from one you rip out.",
    },
    githubUrl: "https://github.com/Vincenthe3231/witslog",
    nebula: {
      archetype: "pillar",
      colorPrimary: "#b6e85e",
      colorSecondary: "#26380e",
      orbit: { radius: 16.5, theta: 5.9, armIndex: 2, elevation: 0.7 },
      scale: 0.9,
      rotationSpeed: 0.035,
      turbulence: 0.45,
    },
  },
];
