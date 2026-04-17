import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Projects } from "@/components/projects/Projects";
import { Skills } from "@/components/skills/Skills";
import { Values } from "@/components/values/Values";
import { Timeline } from "@/components/timeline/Timeline";
import { Footer } from "@/components/footer/Footer";
import { CustomCursor } from "@/components/shared/CustomCursor";

const Index = () => {
  return (
    <main className="relative">
      <CustomCursor />
      <Hero />
      <div className="hairline" />
      <About />
      <div className="hairline" />
      <Projects />
      <div className="hairline" />
      <Skills />
      <div className="hairline" />
      <Values />
      <div className="hairline" />
      <Timeline />
      <Footer />
    </main>
  );
};

export default Index;
