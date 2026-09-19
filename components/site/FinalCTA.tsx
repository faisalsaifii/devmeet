import {
  Arrow,
  Eyebrow,
  LINKS,
  MagneticLink,
  Reveal,
  TextReveal,
} from "@/components/site/primitives";

export function FinalCTA() {
  return (
    <section className="relative py-32 sm:py-44">
      <div
        aria-hidden
        className="animate-drift absolute top-1/2 left-1/2 h-[46vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[130px]"
        style={{
          background: "radial-gradient(circle, var(--violet), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal from="none">
          <Eyebrow>Ready when you are</Eyebrow>
        </Reveal>
        <h2 className="mt-8 text-[clamp(2.2rem,6.5vw,4.6rem)] leading-[0.98] font-semibold">
          <TextReveal text="Start your next" />
          <br />
          <TextReveal
            text="technical interview now."
            highlight="interview now."
            delay={0.14}
          />
        </h2>
        <Reveal delay={0.2}>
          <p className="text-muted-foreground mx-auto mt-7 max-w-lg text-[1rem] leading-relaxed">
            Create a room, share the link, and start coding together in seconds.
          </p>
        </Reveal>
        <Reveal delay={0.28}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <MagneticLink href={LINKS.app} className="w-full sm:w-auto">
              Launch DevMeet <Arrow />
            </MagneticLink>
            <MagneticLink
              href={LINKS.github}
              variant="ghost"
              className="w-full sm:w-auto"
            >
              View source <Arrow char="↗" />
            </MagneticLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-border relative border-t py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={"/Logo.svg"} alt="" className="size-6 rounded-full" />
          <span className="font-display text-[0.98rem] font-semibold tracking-tight">
            DevMeet
          </span>
        </a>
        <p className="text-muted-foreground font-mono text-[0.7rem] tracking-wide sm:ml-4">
          Technical interviews, in one room.
        </p>
        <nav className="text-muted-foreground flex items-center gap-6 text-[0.85rem] sm:ml-auto">
          <a
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a href="#how" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
