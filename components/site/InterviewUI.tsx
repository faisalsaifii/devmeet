"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Tok = { t: string; c?: "key" | "str" | "fn" | "num" | "com" };

const CODE: Tok[][] = [
  [{ t: "// two-sum · O(n)", c: "com" }],
  [
    { t: "function", c: "key" },
    { t: " " },
    { t: "twoSum", c: "fn" },
    { t: "(nums, target) {" },
  ],
  [
    { t: "  const", c: "key" },
    { t: " seen = " },
    { t: "new", c: "key" },
    { t: " " },
    { t: "Map", c: "fn" },
    { t: "()" },
  ],
  [
    { t: "  for", c: "key" },
    { t: " (" },
    { t: "let", c: "key" },
    { t: " i = " },
    { t: "0", c: "num" },
    { t: "; i < nums.length; i++) {" },
  ],
  [{ t: "    const", c: "key" }, { t: " need = target - nums[i]" }],
  [
    { t: "    if", c: "key" },
    { t: " (seen." },
    { t: "has", c: "fn" },
    { t: "(need)) " },
    { t: "return", c: "key" },
    { t: " [seen." },
    { t: "get", c: "fn" },
    { t: "(need), i]" },
  ],
  [{ t: "    seen." }, { t: "set", c: "fn" }, { t: "(nums[i], i)" }],
  [{ t: "  }" }],
  [{ t: "  return", c: "key" }, { t: " []" }],
  [{ t: "}" }],
  [{ t: "" }],
  [
    { t: "twoSum", c: "fn" },
    { t: "([" },
    { t: "2", c: "num" },
    { t: ", " },
    { t: "7", c: "num" },
    { t: ", " },
    { t: "11", c: "num" },
    { t: "], " },
    { t: "9", c: "num" },
    { t: ") " },
    { t: "// → [0, 1]", c: "com" },
  ],
];

const colorFor: Record<string, string> = {
  key: "text-code-key",
  str: "text-code-str",
  fn: "text-code-fn",
  num: "text-code-num",
  com: "text-code-com",
};

function VideoTile({
  name,
  role,
  hue,
  speaking,
}: {
  name: string;
  role: string;
  hue: string;
  speaking?: boolean;
}) {
  return (
    <div className="border-border bg-deep/80 relative overflow-hidden rounded-xl border">
      <div className="aspect-4/3 relative">
        <div className="absolute inset-0" style={{ background: hue }} />
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-foreground/15 bg-foreground/10 text-foreground/70 flex size-11 items-center justify-center rounded-full border text-xs font-semibold backdrop-blur-sm">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>
        {speaking && (
          <div
            className="border-live/60 absolute inset-0 rounded-xl border"
            aria-hidden
          />
        )}
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
          <span className="bg-deep/80 text-foreground/85 rounded-md px-1.5 py-0.5 text-[0.6rem] font-medium backdrop-blur-sm">
            {name}
          </span>
          <span className="text-muted-foreground bg-deep/80 rounded-md px-1.5 py-0.5 text-[0.55rem] tracking-widest uppercase backdrop-blur-sm">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * A high-fidelity mock of the DevMeet interview room: editor + video panel.
 */
export function InterviewUI({
  className,
  compact,
  highlight,
}: {
  className?: string;
  compact?: boolean;
  highlight?: "video" | "editor" | "run" | "room" | null;
}) {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(reduced ? CODE.length : 4);
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setTyped((n) => {
        if (n >= CODE.length) {
          setRan(true);
          return n;
        }
        return n + 1;
      });
    }, 420);
    return () => clearInterval(id);
  }, [reduced]);

  const dim = (k: string) =>
    highlight && highlight !== k ? "opacity-35 saturate-50" : "";

  return (
    <div
      className={cn(
        "border-border bg-deep/90 grain relative overflow-hidden rounded-2xl border shadow-[var(--shadow-float)]",
        className,
      )}
    >
      {/* moving gradient behind the chrome */}
      <div
        className="animate-drift pointer-events-none absolute -top-1/3 left-1/4 h-[70%] w-[60%] rounded-full opacity-45 blur-3xl"
        style={{ background: "var(--gradient-violet)" }}
      />

      {/* window chrome */}
      <div className="border-border/80 bg-surface/60 relative flex items-center gap-3 border-b px-4 py-3 backdrop-blur-md">
        <div className="flex gap-1.5">
          <span className="bg-foreground/20 size-2.5 rounded-full" />
          <span className="bg-foreground/15 size-2.5 rounded-full" />
          <span className="bg-foreground/10 size-2.5 rounded-full" />
        </div>
        <div
          className={cn(
            "border-border bg-deep/70 text-muted-foreground mx-auto hidden items-center gap-2 rounded-md border px-3 py-1 font-mono text-[0.65rem] sm:flex",
            dim("room"),
          )}
        >
          devmeet.app/room/<span className="text-lavender">a7f2-91c4</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="bg-live size-1.5 rounded-full" />
          <span className="text-muted-foreground text-[0.62rem] tracking-wide">
            2 live
          </span>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-[1.65fr_0.85fr]">
        {/* editor */}
        <div
          className={cn("relative transition-all duration-500", dim("editor"))}
        >
          {/* tabs */}
          <div className="border-border/70 flex items-center gap-1 border-b px-3 pt-2">
            {["solution.js", "notes.md"].map((f, i) => (
              <span
                key={f}
                className={cn(
                  "rounded-t-md px-3 py-2 font-mono text-[0.68rem]",
                  i === 0
                    ? "bg-surface/80 text-foreground border-border border-x border-t"
                    : "text-muted-foreground",
                )}
              >
                {f}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-2 pb-1.5">
              <span className="border-border text-muted-foreground rounded-md border px-2 py-1 font-mono text-[0.62rem]">
                JavaScript ⌄
              </span>
              <span
                className={cn(
                  "text-primary-foreground rounded-md px-2.5 py-1 text-[0.62rem] font-semibold",
                  dim("run"),
                )}
                style={{ backgroundImage: "var(--gradient-button)" }}
              >
                ▶ Run
              </span>
            </div>
          </div>

          {/* code */}
          <div
            className={cn(
              "relative px-3 py-4 font-mono leading-[1.75]",
              compact ? "text-[0.6rem]" : "text-[0.66rem] sm:text-[0.74rem]",
            )}
          >
            {CODE.map((line, i) => {
              const visible = i < typed;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3 transition-all duration-500",
                    visible ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="text-muted-foreground/50 w-5 shrink-0 text-right select-none">
                    {i + 1}
                  </span>
                  <span className="text-foreground/85 whitespace-pre">
                    {line.map((tok, j) => (
                      <span
                        key={j}
                        className={tok.c ? colorFor[tok.c] : undefined}
                      >
                        {tok.t}
                      </span>
                    ))}
                    {i === Math.min(typed, CODE.length) - 1 && (
                      <span className="bg-lavender animate-blink ml-0.5 inline-block h-[1em] w-[2px] align-middle" />
                    )}
                  </span>
                </div>
              );
            })}

            {/* collaborator cursor */}
            <div className="border-violet/60 bg-violet/10 text-lavender absolute top-[5.4rem] right-6 rounded-md border px-2 py-0.5 text-[0.58rem]">
              Priya is editing
            </div>
          </div>

          {/* terminal */}
          <div className="border-border/70 bg-deep/70 border-t px-4 py-3 font-mono text-[0.64rem]">
            <div className="text-muted-foreground mb-1.5 flex items-center gap-3 tracking-widest uppercase">
              <span className="text-foreground/70">Output</span>
              <span>Terminal</span>
              <span className="ml-auto normal-case">node v20</span>
            </div>
            <p className="text-code-com">$ node solution.js</p>
            <p
              className={cn(
                "text-code-str transition-opacity duration-700",
                ran ? "opacity-100" : "opacity-0",
              )}
            >
              [ 0, 1 ]{" "}
              <span className="text-muted-foreground">
                · 0.42ms · passed 3/3
              </span>
            </p>
          </div>
        </div>

        {/* video panel */}
        <div
          className={cn(
            "border-border/70 bg-surface/40 flex flex-col gap-3 border-t p-3 transition-all duration-500 lg:border-t-0 lg:border-l",
            dim("video"),
          )}
        >
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <VideoTile
              name="Faisal S"
              role="Interviewer"
              hue="linear-gradient(150deg, oklch(0.3 0.12 300), oklch(0.16 0.04 300))"
              speaking
            />
            <VideoTile
              name="Priya K"
              role="Candidate"
              hue="linear-gradient(150deg, oklch(0.28 0.09 250), oklch(0.15 0.03 300))"
            />
          </div>

          <div className="border-border bg-deep/60 mt-auto flex items-center justify-center gap-2 rounded-xl border p-2">
            {["mic", "cam", "share", "end"].map((c) => (
              <span
                key={c}
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-[0.6rem]",
                  c === "end"
                    ? "bg-destructive/80"
                    : "bg-foreground/8 text-foreground/60",
                )}
              >
                {c === "mic"
                  ? "🎙"
                  : c === "cam"
                    ? "▣"
                    : c === "share"
                      ? "⇪"
                      : "✕"}
              </span>
            ))}
          </div>

          <div className="text-muted-foreground flex items-center justify-between px-1 text-[0.58rem]">
            <span className="flex items-center gap-1.5">
              <span className="bg-live size-1.5 rounded-full" /> synced
            </span>
            <span>28:14</span>
          </div>
        </div>
      </div>

      {/* glass reflection */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, oklch(0.98 0.008 300 / 8%) 0%, transparent 32%, transparent 68%, oklch(0.98 0.008 300 / 4%) 100%)",
        }}
      />
    </div>
  );
}
