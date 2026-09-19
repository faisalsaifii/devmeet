"use client";

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
