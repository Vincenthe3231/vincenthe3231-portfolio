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
        "Inertia let one Laravel brain drive a React face. The server owns the truth. The client just shows it. That one boundary kept permissions honest and killed the double logic problem for good.",
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
        "A client app and a staff portal, two Next.js apps in one Turborepo, drawing from a shared Radix and Tailwind kit. Build the shared parts with care and each app ships on its own clock. That is the whole trick.",
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
        "Roles and permissions became real data, not scattered checks. Lark SSO, queues and a full audit trail all sit behind one Laravel API. The whole stack boots in Docker, so a new teammate runs in one command, not one lost day.",
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
        "The browser never talks to Laravel. Every call goes same origin to a Next.js proxy that holds the token in an httpOnly cookie. Field teams keep their Lark login and the web app stays locked down. You pick the tradeoff on purpose, never by habit.",
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
        "Attendance, leave and claims all touch the same people but move at their own pace. So I gave each its own module with hard walls between them, all on Supabase Postgres. Clear lines are cheap to draw early and brutal to add late.",
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
        "Face matching is one call now. Send an image, pull the stored face from Supabase, compare embeddings, get a yes or no. The whole pipeline folded into one TypeScript function on the edge. Clear status codes tell you what broke instead of leaving you to guess.",
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
        "A node based canvas where you wire virtual production steps together and run them. React Flow drives the graph, Supabase RLS walls off each person's space, and an Edge Function runs the pipeline. Puppeteer runs Lighthouse on every build, so performance stays a budget you can see, not a hope. Speed was never a bonus. Caring about it from day one is what keeps people coming back.",
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
        "Coding agents burn most of their budget just rediscovering a repo. So I indexed the whole thing once into a SQLite graph of symbols and edges, then served it over MCP. One question, one answer, source attached. You judge a tool by how it fails, so safe failures got as much care as the happy path.",
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
        "Cheerio reads every page first because it is cheap. Only the pages that come back thin or fail get a full Playwright browser. A tool that adapts beats one you keep tuning by hand. It tries the fast way first and reaches for the heavy option only when a page really fights back.",
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
        "Errors land as structured events in a local SQLite database, classified, searchable, and queryable by any AI over MCP. The logger never freezes the app it watches. When it gets swamped it drops a line and keeps going. That one decision, made early, is why you can trust it.",
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
