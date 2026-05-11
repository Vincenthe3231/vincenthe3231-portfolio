# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Single-page internship portfolio for Vincenthe (Law Wen Sen). Vite + React 18 + TypeScript + Tailwind CSS. The hero section uses React Three Fiber / Three.js for a 3D scene. UI primitives are shadcn/ui-style Radix components.

## Commands

```bash
pnpm install        # install deps
pnpm dev            # dev server on port 8080
pnpm build          # production build to dist/
pnpm lint           # ESLint
pnpm test           # Vitest (single run)
pnpm test:watch     # Vitest watch mode
```

Run a single test file: `pnpm vitest run src/test/example.test.ts`

## Path Alias

`@/*` maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.json`). Always use `@/` imports.

## Architecture

**Routing:** Single route (`/`) renders `Index.tsx`, which composes all sections vertically. `NotFound` is the catch-all. New routes go in `App.tsx` above the `*` route.

**Section components:** Each major section lives in its own folder under `src/components/` (hero, about, projects, skills, values, timeline, footer). Sections are assembled in `src/pages/Index.tsx` separated by `<div className="hairline" />` dividers.

**Data layer:** All portfolio content is in `src/data/` as static TypeScript arrays/objects — no API calls for content. Edit these files to change portfolio content:
- `projects.ts` — project entries with `Project` interface (id, story, tech stack, URLs)
- `skills.ts` — `SkillNode[]` with group, size, and `projects` array referencing project `id` values
- `timeline.ts`, `values.ts` — timeline entries and values

**Skills ↔ Projects linkage:** `skills.ts` nodes reference project `id` strings from `projects.ts`. The Skills component uses these to draw edges and highlight related projects on hover. Keep these IDs in sync.

**Hero 3D scene:** `HeroScene.tsx` uses `@react-three/fiber` and `@react-three/drei`. It runs inside the Hero component.

**Shared components:** `CustomCursor`, `SectionHeader`, `TechBadge` in `src/components/shared/`. The `src/components/ui/` directory contains shadcn/ui primitives — these are generated/standard and rarely need manual editing.

## TypeScript Config

`strictNullChecks` is off and `noImplicitAny` is off. The codebase uses relaxed TS settings.

## Animations

Framer Motion is used throughout for section transitions and interactive animations. The `@use-gesture/react` package handles gesture-based interactions.
