import { lazy, Suspense, useEffect, useState } from "react";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { SectionTransition } from "@/components/shared/SectionTransition";
import { AuroraProvider } from "@/aurora/AuroraProvider";
import { PhysicsParallaxProvider } from "@/physics/PhysicsParallaxProvider";
import { SceneBackground } from "@/components/scene/SceneBackground";

const Projects = lazy(() => import("@/components/projects/Projects").then(m => ({ default: m.Projects })));
const Skills = lazy(() => import("@/components/skills/Skills").then(m => ({ default: m.Skills })));
const Archive = lazy(() => import("@/components/archive/Archive").then(m => ({ default: m.Archive })));
const Timeline = lazy(() => import("@/components/timeline/Timeline").then(m => ({ default: m.Timeline })));
const Footer = lazy(() => import("@/components/footer/Footer").then(m => ({ default: m.Footer })));
const AuroraPixiOverlay = lazy(() => import("@/aurora/AuroraPixiOverlay").then(m => ({ default: m.AuroraPixiOverlay })));

const SectionSkeleton = () => (
  <div aria-hidden className="section-pad min-h-[60vh]" />
);

const Index = () => {
  // Defer Pixi caustic overlay until after window load + 1s
  const [showPixi, setShowPixi] = useState(false);
  useEffect(() => {
    const reveal = () => {
      const t = window.setTimeout(() => setShowPixi(true), 1000);
      return () => window.clearTimeout(t);
    };
    if (document.readyState === "complete") return reveal();
    window.addEventListener("load", reveal, { once: true });
    return () => window.removeEventListener("load", reveal);
  }, []);

  return (
    <AuroraProvider>
      <PhysicsParallaxProvider bodyCount={14}>
        {/* Persistent 3D canvas — fixed behind everything */}
        <SceneBackground />
        {/* PixiJS caustic overlay — deferred */}
        {showPixi && (
          <Suspense fallback={null}>
            <AuroraPixiOverlay />
          </Suspense>
        )}
        {/* DOM content */}
        <main className="relative z-10">
          <CustomCursor />
          <Hero />
          <SectionTransition />
          <Suspense fallback={<SectionSkeleton />}>
            <Projects />
          </Suspense>
          <SectionTransition />
          <About />
          <SectionTransition />
          <Suspense fallback={<SectionSkeleton />}>
            <Skills />
          </Suspense>
          <SectionTransition />
          <Suspense fallback={<SectionSkeleton />}>
            <Archive />
          </Suspense>
          <SectionTransition />
          <Suspense fallback={<SectionSkeleton />}>
            <Timeline />
          </Suspense>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </main>
      </PhysicsParallaxProvider>
    </AuroraProvider>
  );
};

export default Index;
