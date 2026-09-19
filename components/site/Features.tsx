import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, SectionLabel, TextReveal } from "./primitives";

function Card({
  title,
  body,
  visual,
  className,
  index,
}: {
  title: string;
  body: string;
  visual: ReactNode;
  className?: string | undefined;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(340px circle at ${mx}% ${my}%, oklch(0.68 0.214 305 / 16%), transparent 70%)`;

  return (
    <Reveal delay={index * 0.06} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={(e) => {
          if (reduced || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 100);
          my.set(((e.clientY - r.top) / r.height) * 100);
        }}
        whileHover={reduced ? {} : { y: -5 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="panel group relative h-full overflow-hidden p-6 transition-colors duration-500 hover:border-lavender/35 sm:p-7"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
        <div className="dot-grid absolute inset-0 opacity-25" />
        <div className="relative">
          <div className="mb-6">{visual}</div>
          <h3 className="font-display text-[1.28rem] leading-snug font-semibold tracking-tight">
            {title}
          </h3>
          <p className="text-muted-foreground mt-2 text-[0.92rem] leading-relaxed">
            {body}
          </p>
        </div>
      </motion.div>
    </Reveal>
  );
}

function CodeFragment() {
  return (
    <div className="border-border bg-deep/70 rounded-xl border p-3 font-mono text-[0.62rem] leading-relaxed">
      <p className="text-code-key">
        const <span className="text-foreground/85">room</span> ={" "}
        <span className="text-code-fn">join</span>
        <span className="text-foreground/85">(</span>
        <span className="text-code-str">&quot;a7f2&quot;</span>
        <span className="text-foreground/85">)</span>
      </p>
      <p className="text-code-com">// both cursors, one buffer</p>
      <p className="text-foreground/70">
        room.<span className="text-code-fn">on</span>(
        <span className="text-code-str">&quot;edit&quot;</span>, sync)
        <span className="bg-lavender animate-blink ml-1 inline-block h-[0.9em] w-[2px] align-middle" />
      </p>
    </div>
  );
}

function VideoFragment() {
  return (
    <div className="flex gap-2">
      {[
        "linear-gradient(150deg, oklch(0.32 0.13 300), oklch(0.16 0.04 300))",
        "linear-gradient(150deg, oklch(0.28 0.09 250), oklch(0.15 0.03 300))",
      ].map((bg, i) => (
        <motion.div
          key={i}
          className="border-border relative aspect-4/3 flex-1 overflow-hidden rounded-lg border"
          style={{ background: bg }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 }}
        >
          <span className="bg-live absolute bottom-1.5 left-1.5 size-1.5 rounded-full" />
        </motion.div>
      ))}
    </div>
  );
}

function RunFragment() {
  return (
    <div className="border-border bg-deep/70 rounded-xl border p-3 font-mono text-[0.62rem]">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="text-primary-foreground rounded px-1.5 py-0.5 text-[0.55rem] font-semibold"
          style={{ backgroundImage: "var(--gradient-violet)" }}
        >
          ▶ Run
        </span>
        <span className="text-muted-foreground">node solution.js</span>
      </div>
      <p className="text-code-str">passed 3/3 · 0.42ms</p>
    </div>
  );
}

function LangFragment() {
  return (
    <div className="flex flex-wrap gap-1.5 font-mono text-[0.62rem]">
      {["JavaScript", "Python", "Java", "C++", "Go", "TypeScript"].map(
        (l, i) => (
          <motion.span
            key={l}
            className={cn(
              "border-border rounded-md border px-2 py-1",
              i === 1
                ? "border-violet/45 text-lavender"
                : "text-muted-foreground",
            )}
            whileHover={{ y: -2 }}
          >
            {l}
          </motion.span>
        ),
      )}
    </div>
  );
}

function LinkFragment() {
  return (
    <div className="border-border bg-deep/70 flex items-center gap-2 rounded-xl border p-3 font-mono text-[0.62rem]">
      <span className="text-muted-foreground truncate">devmeet.app/room/</span>
      <span className="text-lavender">a7f2-91c4</span>
      <span className="border-border text-foreground/70 ml-auto rounded border px-1.5 py-0.5">
        copy
      </span>
    </div>
  );
}

function SyncFragment() {
  return (
    <div className="flex items-center gap-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="bg-lavender/70 h-8 w-[3px] rounded-full"
          animate={{ scaleY: [0.4, 1, 0.5], opacity: [0.4, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
      <span className="text-muted-foreground font-mono text-[0.62rem]">
        state synced · 12ms
      </span>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionLabel>Features</SectionLabel>
        </Reveal>
        <h2 className="max-w-3xl text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.05] font-semibold">
          <TextReveal text="Everything technical interviews need." />
        </h2>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            index={0}
            className="sm:col-span-2"
            title="Collaborative Coding"
            body="Write and edit code together in real time."
            visual={<CodeFragment />}
          />
          <Card
            index={1}
            title="Video Calling"
            body="Talk face-to-face while watching the candidate solve problems."
            visual={<VideoFragment />}
          />
          <Card
            index={2}
            title="Built-in Compiler"
            body="Run code without leaving the interview."
            visual={<RunFragment />}
          />
          <Card
            index={3}
            title="Multiple Languages"
            body="Support coding across multiple programming languages."
            visual={<LangFragment />}
          />
          <Card
            index={4}
            title="Instant Rooms"
            body="Create a room and invite candidates with a simple link."
            visual={<LinkFragment />}
          />
          <Card
            index={5}
            className="sm:col-span-2 lg:col-span-3"
            title="Real-time Experience"
            body="Everything stays synchronized while you interview."
            visual={<SyncFragment />}
          />
        </div>
      </div>
    </section>
  );
}
