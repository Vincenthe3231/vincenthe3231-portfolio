# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Single-page internship portfolio for Vincenthe. Vite + React 18 + TypeScript + Tailwind CSS. Heavy WebGL/animation stack: React Three Fiber / Three.js (3D scenes), PixiJS (2D caustic overlay), Rapier + matter-js (physics), custom GLSL shaders, Framer Motion (DOM transitions). UI primitives are shadcn/ui-style Radix components.

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

Test config is `vitest.config.ts` (separate from `vite.config.ts`): jsdom environment, globals enabled, setup in `src/test/setup.ts`. Match pattern is `src/**/*.{test,spec}.{ts,tsx}`.

## Path Alias

`@/*` maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.json`). Always use `@/` imports.

## Architecture

**Routing:** Single route (`/`) renders `Index.tsx`. `NotFound` is the catch-all. New routes go in `App.tsx` above the `*` route.

**Provider tree (`src/pages/Index.tsx`):** The page is wrapped in `AuroraProvider` → `PhysicsParallaxProvider`. A single persistent `SceneBackground` 3D canvas sits fixed behind everything (`z` below the `<main>`); DOM sections render in `<main className="relative z-10">`. The PixiJS caustic overlay (`AuroraPixiOverlay`) is deferred — mounted only after `window` load + 1s. Most sections (Projects, Skills, Archive, Timeline, Footer) are `React.lazy` + `Suspense`; Hero and About load eagerly. Section order: Hero, Projects, About, Skills, Archive, Timeline, Footer, separated by `<SectionTransition />`. Note: `values` data/components exist but are **not** currently rendered in `Index`.

**Performance tiers (`src/lib/performanceTier.ts`):** `detectPerformanceTier()` returns `"high" | "medium" | "low"` from GPU renderer string, mobile UA, and `prefers-reduced-motion` (cached after first call). `TIER_CONFIG` maps each tier to every expensive knob (particle/star counts, physics body counts, shader octaves, dpr, postFx on/off, etc.). When adding any WebGL/physics effect, gate its cost through `TIER_CONFIG` rather than hardcoding counts — `low` tier must be able to disable it (count 0 / `false`).

**Engine coordination (`src/aurora/useEngineCoordinator.ts`):** Single `requestAnimationFrame` loop. R3F runs its own loop but reads shared aurora uniforms; non-R3F engines (Pixi) register frame callbacks here instead of spawning their own rAF. Delta is capped at 50ms. Register new imperative render loops through this, don't add standalone `requestAnimationFrame` calls.

**Rendering modules:**
- `src/components/scene/` — R3F scene pieces (`SceneBackground`, `GalaxySpiral`, `NebulaClouds`, `SpaceStarfield`).
- `src/aurora/` — aurora background system: providers, shared uniform hooks (`useAuroraUniforms`), Pixi overlay, intersection-based pausing (`useIntersectionPause`).
- `src/physics/` — `PhysicsParallaxProvider` + hooks wrapping Rapier (`useCannonWorld`) and matter-js (`useMatterEngine`).
- `src/shaders/` — raw GLSL (`.vert`/`.frag`/`.glsl`) imported as strings. Shared noise in `noise.glsl`.

**Data layer:** All portfolio content is in `src/data/` as static TypeScript arrays/objects — no API calls for content:
- `projects.ts` — project entries with `Project` interface (id, story, tech stack, URLs)
- `skills.ts` — `SkillNode[]` with group, size, and `projects` array referencing project `id` values
- `timeline.ts`, `values.ts` — timeline entries and values

**Skills ↔ Projects linkage:** `skills.ts` nodes reference project `id` strings from `projects.ts`. The Skills component uses these to draw edges and highlight related projects on hover. Keep these IDs in sync.

**Shared components:** `CustomCursor`, `SectionHeader`, `TechBadge`, `SectionTransition` in `src/components/shared/`. The `src/components/ui/` directory contains shadcn/ui primitives — generated/standard, rarely need manual editing.

## Build Chunking

`vite.config.ts` manually splits vendor chunks (`three-core`, `three-r3f`, `postprocessing`, `pixi`, `physics`, `motion`) and **excludes `@dimforge/rapier3d-compat` from dep optimization** (WASM). HMR overlay is disabled. Keep these splits in mind when adding large deps.

## TypeScript Config

`strictNullChecks` is off and `noImplicitAny` is off. The codebase uses relaxed TS settings.

## Animations

Framer Motion is used throughout for section transitions and interactive animations. The `@use-gesture/react` package handles gesture-based interactions.
