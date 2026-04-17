export const Footer = () => {
  return (
    <footer id="contact" className="relative section-pad pt-24 pb-12 overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-20 h-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, hsl(var(--accent) / 0.18), transparent 70%)",
        }}
      />

      <div className="relative">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          06 / Reach out
        </span>
        <h2 className="text-display text-6xl md:text-8xl lg:text-9xl mt-6 leading-[0.9] text-balance">
          Let's build<br />something <span className="text-accent">considered.</span>
        </h2>

        <p className="mt-8 max-w-xl text-lg text-foreground/65 text-balance">
          I'm finishing my degree and ready for the team that takes architecture, AI integration and shipping discipline as seriously as I do.
        </p>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          <FooterLink
            label="GitHub"
            value="@Vincenthe3231"
            href="https://github.com/Vincenthe3231"
          />
          <FooterLink
            label="Email"
            value="hello@vincenthe.dev"
            href="mailto:hello@vincenthe.dev"
          />
          <FooterLink
            label="LinkedIn"
            value="linkedin.com/in/vincenthe"
            href="https://linkedin.com/in/vincenthe"
          />
        </div>

        <div className="hairline my-16" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/40">
            Vincenthe · Internship Portfolio · 2025
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/40">
            Built with React · Three.js · Framer Motion
          </span>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ label, value, href }: { label: string; value: string; href: string }) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel="noopener noreferrer"
    className="group glass rounded-2xl p-6 hover:border-accent/40 transition-colors"
  >
    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-3">
      {label}
    </div>
    <div className="flex items-center justify-between gap-4">
      <span className="text-lg text-foreground/90 group-hover:text-accent transition-colors truncate">
        {value}
      </span>
      <span className="text-foreground/40 group-hover:text-accent transition-colors">↗</span>
    </div>
  </a>
);
