interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export const SectionHeader = ({ eyebrow, title, description, align = "left" }: SectionHeaderProps) => (
  <div className={align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl"}>
    <div className="flex items-center gap-3 mb-6">
      <span className="h-px w-10 bg-accent" />
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">{eyebrow}</span>
    </div>
    <h2 className="text-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance">
      {title}
    </h2>
    {description && (
      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">{description}</p>
    )}
  </div>
);
