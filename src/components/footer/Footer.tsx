import type { LucideIcon } from "lucide-react";
import { Github, Linkedin, Mail } from "lucide-react";

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
            icon={Github}
            label="GitHub"
            value="@Vincenthe3231"
            href="https://github.com/Vincenthe3231"
          />
          <FooterLink
            icon={Mail}
            label="Email"
            value="vincenthe3231@gmail.com"
            href="mailto:vincenthe3231@gmail.com"
          />
          <FooterLink
            icon={Linkedin}
            label="LinkedIn"
            value="https://www.linkedin.com/in/law-wen-sen-7a001233b"
            href="https://www.linkedin.com/in/law-wen-sen-7a001233b"
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

type FooterLinkProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
};

const FooterLink = ({ icon: Icon, label, value, href }: FooterLinkProps) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel="noopener noreferrer"
    className="group glass rounded-2xl p-6 hover:border-accent/40 transition-colors"
  >
    <div className="flex gap-4">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-surface/50 text-accent transition-colors group-hover:border-accent/35 group-hover:bg-accent/10"
        aria-hidden
      >
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">
          {label}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg text-foreground/90 group-hover:text-accent transition-colors truncate">
            {value}
          </span>
          <span className="shrink-0 text-foreground/40 group-hover:text-accent transition-colors">↗</span>
        </div>
      </div>
    </div>
  </a>
);
