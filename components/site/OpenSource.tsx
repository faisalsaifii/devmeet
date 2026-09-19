import { motion } from "motion/react";
import {
  Arrow,
  LINKS,
  MagneticLink,
  Reveal,
  SectionLabel,
  TextReveal,
} from "./primitives";

const files = [
  "README.md",
  "src/room/editor.ts",
  "src/room/video.ts",
  "src/compiler/run.ts",
  "src/lib/sync.ts",
];

export function OpenSource() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal>
            <SectionLabel>Open source</SectionLabel>
          </Reveal>
          <h2 className="text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.05] font-semibold">
            <TextReveal text="Built in the open." />
          </h2>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground mt-6 max-w-lg text-[1rem] leading-relaxed">
              DevMeet is open source. Read the code, understand exactly how
              interviews are handled, self-host it, or contribute the feature
              your hiring process needs.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MagneticLink href={LINKS.github}>
                Star on GitHub <Arrow char="↗" />
              </MagneticLink>
              <MagneticLink href={LINKS.app} variant="ghost">
                Try DevMeet <Arrow />
              </MagneticLink>
            </div>
          </Reveal>
        </div>

        <Reveal from="left" delay={0.1}>
          <div className="panel overflow-hidden p-0">
            <div className="border-border flex items-center gap-2 border-b px-4 py-3 font-mono text-[0.68rem]">
              <span className="bg-live size-2 rounded-full" />
              <span className="text-muted-foreground">
                faisalsaifii / devmeet
              </span>
              <span className="text-lavender ml-auto">main</span>
            </div>
            <ul className="divide-border divide-y font-mono text-[0.72rem]">
              {files.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="hover:bg-surface-2/60 flex items-center gap-3 px-4 py-3 transition-colors"
                >
                  <span className="text-code-com">›</span>
                  <span className="text-foreground/80">{f}</span>
                  <span className="text-muted-foreground ml-auto">updated</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
