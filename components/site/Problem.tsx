import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Reveal, SectionLabel, TextReveal } from "./primitives";
import { InterviewUI } from "./InterviewUI";

const chain = [
  "Zoom / Google Meet",
  "Google Docs",
  "Candidate's IDE",
  "Screen sharing",
  '"Can you paste that again?"',
  "Chaos",
];

export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const collapsed = useInView(ref, { once: true, margin: "-35% 0px -35% 0px" });

  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionLabel>The problem</SectionLabel>
        </Reveal>
        <h2 className="max-w-3xl text-[clamp(2rem,5vw,3.75rem)] leading-[1.03] font-semibold">
          <TextReveal text="Why are coding interviews still stitched together?" />
        </h2>

        <div className="mt-16 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div ref={ref} className="relative">
            <div className="from-border via-border absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b to-transparent" />
            <ul className="space-y-4">
              {chain.map((c, i) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: -26, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex items-center gap-4 pl-8"
                >
                  <span
                    className={
                      "absolute left-0 size-[15px] rounded-full border " +
                      (i === chain.length - 1
                        ? "border-destructive/60 bg-destructive/30"
                        : "border-border bg-surface-2")
                    }
                  />
                  <span
                    className={
                      "panel w-full px-4 py-3 font-mono text-[0.8rem] " +
                      (i === chain.length - 1
                        ? "text-destructive/90"
                        : "text-muted-foreground")
                    }
                  >
                    {c}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display mb-6 text-[clamp(1.6rem,3.4vw,2.5rem)] leading-tight font-semibold"
            >
              DevMeet replaces all of it.
            </motion.p>
            <div className="text-muted-foreground mb-7 flex flex-wrap items-center gap-2 font-mono text-[0.72rem] tracking-widest uppercase">
              <span className="panel px-3 py-1.5">Video call</span>
              <span className="text-lavender">+</span>
              <span className="panel px-3 py-1.5">Shared IDE</span>
              <span className="text-lavender">+</span>
              <span className="panel px-3 py-1.5">Execution</span>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(18px)" }}
              animate={
                collapsed
                  ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, scale: 0.9, y: 40, filter: "blur(18px)" }
              }
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.5,
              }}
            >
              <InterviewUI compact />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
