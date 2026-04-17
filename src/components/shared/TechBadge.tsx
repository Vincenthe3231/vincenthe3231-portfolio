interface TechBadgeProps {
  label: string;
  accent?: string; // CSS var name e.g. "--p-human"
}

export const TechBadge = ({ label, accent }: TechBadgeProps) => (
  <span
    className="inline-flex items-center rounded-full border border-foreground/10 bg-surface-elevated/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/80 backdrop-blur"
    style={accent ? { borderColor: `hsl(var(${accent}) / 0.35)`, color: `hsl(var(${accent}))` } : undefined}
  >
    {label}
  </span>
);
