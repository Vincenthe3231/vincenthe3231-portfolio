import { useEffect, useRef } from "react";
import { Application, Graphics, BlurFilter, Container } from "pixi.js";
import { useAurora } from "./AuroraProvider";

const AURORA_COLORS = [
  0x2da663, // green
  0x33b895, // teal
  0x00e5ff, // cyan (accent)
  0x4d61d9, // blue
  0x8060d9, // violet
  0xcc4d8c, // magenta
];

const SPRITE_COUNT = 12;

interface CausticSprite {
  gfx: Graphics;
  baseX: number;
  baseY: number;
  radius: number;
  color: number;
  speedX: number;
  speedY: number;
  phase: number;
}

/**
 * PixiJS 2D overlay: floating caustic light blobs across the page.
 * Fixed fullscreen, pointer-events: none, z-index: 1.
 * Fades to zero over Skills section.
 */
export function AuroraPixiOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const spritesRef = useRef<CausticSprite[]>([]);
  const { uniforms, registerEngine, config } = useAurora();

  const isDisabled = config.pixiCaustics === "disabled";

  useEffect(() => {
    if (isDisabled || !containerRef.current) return;

    let destroyed = false;
    const el = containerRef.current;

    const initApp = async () => {
      const app = new Application();
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio, 1.5),
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      el.appendChild(app.canvas as HTMLCanvasElement);
      appRef.current = app;

      // Create caustic sprites
      const causticContainer = new Container();
      app.stage.addChild(causticContainer);

      const sprites: CausticSprite[] = [];
      for (let i = 0; i < SPRITE_COUNT; i++) {
        const gfx = new Graphics();
        const color = AURORA_COLORS[i % AURORA_COLORS.length];
        const radius = 60 + Math.random() * 120;

        gfx.circle(0, 0, radius);
        gfx.fill({ color, alpha: 0.08 });

        // Apply blur for soft glow
        gfx.filters = [new BlurFilter({ strength: 30 + Math.random() * 20 })];

        const sprite: CausticSprite = {
          gfx,
          baseX: Math.random() * window.innerWidth,
          baseY: Math.random() * window.innerHeight * 3, // span full page height
          radius,
          color,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.15,
          phase: Math.random() * Math.PI * 2,
        };

        causticContainer.addChild(gfx);
        sprites.push(sprite);
      }
      spritesRef.current = sprites;
    };

    initApp();

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [isDisabled]);

  // Register render tick
  useEffect(() => {
    if (isDisabled) return;

    const unregister = registerEngine("pixi-overlay", (time) => {
      const app = appRef.current;
      if (!app) return;

      const u = uniforms.current;
      const intensity = u.sectionIntensity;
      const scrollPx = window.scrollY;

      // Update sprite positions w/ simplex-like oscillation
      spritesRef.current.forEach((sprite) => {
        const t = time * 0.001;
        const ox = Math.sin(t * sprite.speedX + sprite.phase) * 80;
        const oy = Math.cos(t * sprite.speedY + sprite.phase * 1.3) * 50;

        sprite.gfx.position.set(
          sprite.baseX + ox + u.mouseX * 20,
          sprite.baseY + oy - scrollPx * 0.8 // parallax with scroll
        );

        // Fade based on section intensity
        sprite.gfx.alpha = intensity * 0.12;
      });

      app.renderer.render(app.stage);
    });

    return unregister;
  }, [registerEngine, uniforms, isDisabled]);

  if (isDisabled) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
