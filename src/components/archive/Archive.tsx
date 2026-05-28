import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { projects } from "@/data/projects";

const ArchiveScene = lazy(() =>
  import("./ArchiveScene").then((m) => ({ default: m.ArchiveScene })),
);

// ─── Accent palette matching ArchiveScene ──────────────────────────────────
const ACCENT_PALETTE = [
  "#6FF9FF", "#8BE9FD", "#7AA2FF", "#B48CFF",
  "#6FF9FF", "#8BE9FD", "#7AA2FF", "#B48CFF",
];

export const Archive = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const scrollRef   = useRef(0);
  const mouseRef    = useRef({ x: 0, y: 0 });
  const reduced     = useReducedMotion();

  // Mount canvas only when section enters viewport
  const [mountCanvas, setMountCanvas] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setMountCanvas(entry.isIntersecting),
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  // Track section scroll progress (0..1)
  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const raw = Math.max(0, -rect.top) / Math.max(total, 1);
      scrollRef.current = Math.min(1, Math.max(0, raw));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  // Track mouse for camera parallax
  useEffect(() => {
    if (reduced) return;
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="archive"
      className="relative"
      style={{ minHeight: reduced ? "auto" : "200vh" }}
      aria-label="Archive — eight lessons"
    >
      {/* Sticky 3D vault stage */}
      {!reduced && (
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          aria-hidden
        >
          {/* Section label — top-left, minimal */}
          <div className="absolute top-8 left-0 right-0 z-10 px-10 pointer-events-none">
            <div className="flex items-baseline gap-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/30">
                04 / Archive
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/18">
                Eight ships · Eight lessons
              </span>
            </div>
          </div>

          {/* R3F Canvas */}
          <div className="absolute inset-0">
            {mountCanvas && (
              <Suspense fallback={null}>
                <ArchiveScene scrollRef={scrollRef} mouseRef={mouseRef} />
              </Suspense>
            )}
          </div>

          {/* Bottom fade into darkness */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #05070A)" }}
          />
        </div>
      )}

      {/* Static fallback — reduced-motion OR CSS-grid for a11y/SEO ─────────── */}
      <div
        className={
          reduced
            ? "section-pad py-24"
            : "sr-only"
        }
        role="region"
        aria-label="Archive entries"
      >
        {!reduced && null}
        {reduced && (
          <>
            <div className="mb-16">
              <span className="font-mono text-xs tracking-widest uppercase text-white/40">
                04 / Archive
              </span>
              <h2 className="mt-4 font-serif text-4xl text-white/90">
                Eight ships. Eight lessons.
              </h2>
              <p className="mt-3 text-sm text-white/50 max-w-md">
                One thing each project forced me to understand — not in theory, but under deadline.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-6"
                >
                  <p
                    className="mb-3 font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: ACCENT_PALETTE[i % ACCENT_PALETTE.length] }}
                  >
                    {String(i + 1).padStart(2, "0")} · {p.title}
                  </p>
                  <p className="text-sm leading-relaxed text-white/60">
                    {p.story.learned}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
