import { values } from "@/data/values";
import { SectionHeader } from "../shared/SectionHeader";

export const Values = () => {
  return (
    <section id="values" className="relative section-pad">
      <SectionHeader
        eyebrow="04 / Philosophy"
        title="Why I build the way I do."
      />

      <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {values.map((v, i) => (
          <div
            key={v.number}
            className="relative glass rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[340px]"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                Value · {v.number}
              </span>
              <span className="text-display text-5xl md:text-6xl text-foreground/10 leading-none">
                {v.number}
              </span>
            </div>

            <div className="mt-10">
              <h3 className="text-display text-3xl md:text-4xl leading-[0.95] mb-4 text-balance">
                {v.title}
              </h3>
              <p className="text-base md:text-lg text-foreground/70 text-balance">
                {v.description}
              </p>
            </div>

            <div
              aria-hidden
              className="absolute bottom-6 right-6 h-16 w-16 rounded-full border border-accent/20"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
