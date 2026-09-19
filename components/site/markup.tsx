import type { ReactNode } from "react";

export const LINKS = {
  app: "/meet",
  github: "https://github.com/faisalsaifii/devmeet",
};

export function Arrow({ char = "→" }: { char?: string }) {
  return (
    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
      {char}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-[0.68rem] font-medium tracking-[0.22em] text-lavender uppercase">
      <span className="bg-live size-1.5 rounded-full" />
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-muted-foreground mb-5 font-mono text-[0.7rem] tracking-[0.3em] uppercase">
      {children}
    </p>
  );
}