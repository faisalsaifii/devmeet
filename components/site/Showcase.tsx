"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { InterviewUI } from "./InterviewUI";
import { Reveal, SectionLabel, TextReveal } from "./primitives";

type Key = "video" | "editor" | "run" | "room";

const callouts: { key: Key; title: string; body: string }[] = [
  {
    key: "video",
    title: "Real-time video",
    body: "Talk face-to-face without leaving the coding environment.",
  },
  {
    key: "editor",
    title: "Shared IDE",
    body: "Interviewer and candidate can work in the same code editor.",
  },
  {
    key: "run",
    title: "Run code instantly",
    body: "Execute code directly inside the interview.",
  },
  {
    key: "room",
    title: "Built for technical interviews",
    body: "No juggling multiple tabs, screens or applications.",
  },
];

export function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(
      Math.min(
        callouts.length - 1,
        Math.max(0, Math.floor(v * callouts.length * 1.02)),
      ),
    );
  });
  const scale = useTransform(scrollYProgress, [0, 0.15], [0.96, 1]);

  return (
    <section id="product" ref={ref} className="relative h-[420vh]">
      <div className="sticky top-0 flex min-h-screen flex-col justify-center py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Reveal>
            <SectionLabel>Product</SectionLabel>
          </Reveal>
          <h2 className="max-w-2xl text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.05] font-semibold">
            <TextReveal text="Everything you need." />
            <br />
            <TextReveal text="One interview room." delay={0.15} />
          </h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <motion.div style={{ scale }}>
              <InterviewUI highlight={callouts[active]!.key} />
            </motion.div>

            <ul className="space-y-3">
              {callouts.map((c, i) => (
                <li
                  key={c.key}
                  className={cn(
                    "panel relative overflow-hidden p-5 transition-all duration-500",
                    i === active
                      ? "border-violet/40 opacity-100 shadow-[var(--shadow-glow)]"
                      : "opacity-45",
                  )}
                >
                  {i === active && (
                    <motion.span
                      layoutId="callout-bar"
                      className="absolute inset-y-0 left-0 w-[2px]"
                      style={{ backgroundImage: "var(--gradient-violet)" }}
                    />
                  )}
                  <p className="text-muted-foreground mb-1 font-mono text-[0.62rem] tracking-[0.25em]">
                    0{i + 1}
                  </p>
                  <h3 className="text-[1.05rem] font-semibold tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 text-[0.88rem] leading-relaxed">
                    {c.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
