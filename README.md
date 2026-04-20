# Vincenthe — Internship portfolio

Single-page portfolio site for **Vincenthe** (Law Wen Sen): full-stack engineering work, internship narrative, and eight showcased projects with case-study depth.

**Stack:** [Vite](https://vitejs.dev/) · [React 18](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) · [Tailwind CSS](https://tailwindcss.com/) · [Framer Motion](https://www.framer.com/motion/) · [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) / [Three.js](https://threejs.org/) (hero scene) · [shadcn/ui](https://ui.shadcn.com/)-style Radix primitives · [Vitest](https://vitest.dev/) for tests.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- [pnpm](https://pnpm.io/) 9+

## Getting started

```bash
pnpm install
pnpm dev
```

Dev server defaults to **port 8080** (see `vite.config.ts`). Open the URL Vite prints in the terminal (often `http://localhost:8080`).

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start Vite dev server with HMR       |
| `pnpm build`   | Production build to `dist/`          |
| `pnpm preview` | Serve the production build locally   |
| `pnpm lint`    | Run ESLint on the repo               |
| `pnpm test`    | Run Vitest once                      |
| `pnpm test:watch` | Vitest in watch mode              |

## Project layout

| Path | Role |
| ---- | ---- |
| `src/pages/` | Route-level pages (`Index`, `NotFound`) |
| `src/components/` | Feature sections (hero, about, projects, skills, timeline, footer, etc.) and shared UI |
| `src/components/ui/` | Reusable primitives (Radix + Tailwind) |
| `src/data/` | Static content: `projects.ts`, `skills.ts`, `timeline.ts`, `values.ts` |
| `src/lib/` | Shared utilities (e.g. `cn` for class names) |

Path alias: `@/*` → `src/*` (configured in Vite and TypeScript).

## Content updates

- **Projects and stories:** edit `src/data/projects.ts`.
- **Skills constellation:** edit `src/data/skills.ts` (node `projects` arrays must use `id` values from `projects.ts` so hover and graph edges stay in sync).
- **Timeline / values:** `src/data/timeline.ts`, `src/data/values.ts`.
- **Theme tokens and fonts:** `src/index.css`, `tailwind.config.ts`.

## Deployment

`pnpm build` emits a static site under `dist/`. Host it on any static host (e.g. Vercel, Netlify, GitHub Pages, or object storage behind a CDN). No server runtime is required.

## License

Private portfolio repository unless you choose to add an explicit license.
