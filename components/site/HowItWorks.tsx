import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Reveal, SectionLabel, TextReveal } from "./primitives";

const steps = [
  {
    n: "01",
    title: "Create a room",
    body: "Open DevMeet and spin up an interview room instantly — no scheduling, no installs.",
  },
  {
    n: "02",
    title: "Share the link",
    body: "Send the candidate a single link. They join in the browser, on any machine.",
  },
  {
    n: "03",
    title: "Interview together",
    body: "Talk over video while both of you write in the same editor, line by line.",
  },
  {
    n: "04",
    title: "Run the code",
    body: "Execute the solution in the built-in compiler and discuss the real output.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 65%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const height = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section id="how" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionLabel>How it works</SectionLabel>
        </Reveal>
        <h2 className="max-w-2xl text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.05] font-semibold">
          <TextReveal text="From link to live interview" />
          <br />
          <TextReveal
            text="in under a minute."
            highlight="under a minute."
            delay={0.12}
          />
        </h2>

        <div ref={ref} className="relative mt-16 pl-12 sm:pl-20">
          <div className="bg-border absolute top-2 bottom-2 left-[13px] w-px sm:left-[21px]" />
          <motion.div
            className="absolute top-2 left-[13px] w-px sm:left-[21px]"
            style={{ height, backgroundImage: "var(--gradient-violet)" }}
          />

          <div className="space-y-10 sm:space-y-14">
            {steps.map((s, i) => (
              <Reveal key={s.n} from="right" delay={i * 0.05}>
                <div className="relative">
                  <span className="glass absolute top-1 -left-12 flex size-7 items-center justify-center rounded-full font-mono text-[0.6rem] sm:-left-20 sm:size-11 sm:text-[0.7rem]">
                    {s.n}
                  </span>
                  <h3 className="text-[1.35rem] font-semibold tracking-tight sm:text-[1.6rem]">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-xl text-[0.95rem] leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
