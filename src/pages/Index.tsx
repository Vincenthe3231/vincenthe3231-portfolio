import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Projects } from "@/components/projects/Projects";
import { Skills } from "@/components/skills/Skills";
import { Lessons } from "@/components/lessons/Lessons";
import { Timeline } from "@/components/timeline/Timeline";
import { Footer } from "@/components/footer/Footer";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { SectionTransition } from "@/components/shared/SectionTransition";
import { AuroraProvider } from "@/aurora/AuroraProvider";
import { AuroraPixiOverlay } from "@/aurora/AuroraPixiOverlay";
import { PhysicsParallaxProvider } from "@/physics/PhysicsParallaxProvider";
import { SceneBackground } from "@/components/scene/SceneBackground";

const Index = () => {
  return (
    <AuroraProvider>
      <PhysicsParallaxProvider bodyCount={14}>
        {/* Persistent 3D canvas — fixed behind everything */}
        <SceneBackground />
        {/* PixiJS caustic overlay */}
        <AuroraPixiOverlay />
        {/* DOM content */}
        <main className="relative z-10">
          <CustomCursor />
          <Hero />
          <SectionTransition />
          <About />
          <SectionTransition />
          <Projects />
          <SectionTransition />
          <Skills />
          <SectionTransition />
          <Lessons />
          <SectionTransition />
          <Timeline />
          <Footer />
        </main>
      </PhysicsParallaxProvider>
    </AuroraProvider>
  );
};

export default Index;
