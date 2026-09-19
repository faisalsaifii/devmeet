import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Reveal, SectionLabel, TextReveal } from "./primitives";

const stats = [
  { k: "1", label: "room, everything inside" },
  { k: "0", label: "installs or downloads" },
  { k: "6+", label: "languages supported" },
  { k: "~12ms", label: "sync latency" },
];

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const xA = useTransform(scrollYProgress, [0, 1], ["6%", "-18%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-14%", "10%"]);

  return (
    <section ref={ref} className="relative overflow-hidden py-28 sm:py-36">
      <div className="select-none">
        <motion.p
          {...(reduced ? {} : { style: { x: xA } })}
          className="font-display text-foreground/[0.06] text-[clamp(4rem,15vw,13rem)] leading-[0.9] font-semibold whitespace-nowrap"
        >
          CODE · TALK · SHIP ·
        </motion.p>
        <motion.p
          {...(reduced ? {} : { style: { x: xB } })}
          className="font-display text-[clamp(4rem,15vw,13rem)] leading-[0.9] font-semibold whitespace-nowrap text-transparent [-webkit-text-stroke:1px_oklch(0.83_0.088_300/18%)]"
        >
          ONE INTERVIEW ROOM ·
        </motion.p>
      </div>

      <div className="mx-auto mt-20 max-w-6xl px-6">
        <Reveal>
          <SectionLabel>The experience</SectionLabel>
        </Reveal>
        <h2 className="max-w-3xl text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.05] font-semibold">
          <TextReveal text="No tab juggling. No screen sharing a laggy editor." />
        </h2>
        <Reveal delay={0.1}>
          <p className="text-muted-foreground mt-6 max-w-xl text-[1rem] leading-relaxed">
            DevMeet replaces the stack of tools interviewers stitch together — a
            video app, an online editor, a compiler, a chat window — with one
            focused room built for the conversation that matters.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="panel h-full p-6">
                <p className="font-display text-gradient text-[2.6rem] leading-none font-semibold">
                  {s.k}
                </p>
                <p className="text-muted-foreground mt-3 text-[0.88rem] leading-relaxed">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
