"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Arrow, Eyebrow, LINKS, SectionLabel } from "./markup";

export { Arrow, Eyebrow, LINKS, SectionLabel };

const EASE = [0.16, 1, 0.3, 1] as const;

const MotionLink = motion.create(Link);

type Dir = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: 42 },
  down: { x: 0, y: -42 },
  left: { x: 48, y: 0 },
  right: { x: -48, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  blur = true,
  once = true,
}: {
  children: ReactNode;
  className?: string | undefined;
  delay?: number;
  from?: Dir;
  blur?: boolean;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const o = offsets[from];
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: o.x,
        y: o.y,
        filter: blur ? "blur(14px)" : "blur(0px)",
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -10% 0px" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word masked text reveal. */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  highlight,
}: {
  text: string;
  className?: string | undefined;
  wordClassName?: string | undefined;
  delay?: number;
  highlight?: string;
}) {
  const reduced = useReducedMotion();
  const hi = highlight?.split(" ") ?? [];
  const words = text.split(" ");
  const hiStart = hi.length ? words.length - hi.length : -1;

  return (
    <span className={cn("inline", className)}>
      {words.map((w, i) => {
        const isHi = hiStart >= 0 && i >= hiStart;
        const isBreak = w === "\n";
        if (isBreak) return <br key={i} />;
        return (
          <span
            key={i}
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              className={cn(
                "inline-block",
                isHi && "text-gradient",
                wordClassName,
              )}
              {...(reduced
                ? {}
                : {
                    initial: { y: "110%", opacity: 0 },
                    whileInView: { y: "0%", opacity: 1 },
                  })}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: delay + i * 0.055, ease: EASE }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
    </span>
  );
}

export function MagneticLink({
  href,
  children,
  variant = "primary",
  className,
  full,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string | undefined;
  full?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  return (
    <MotionLink
      ref={ref}
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      {...(reduced ? {} : { style: { x, y } })}
      onMouseMove={(e) => {
        if (reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      {...(reduced
        ? {}
        : { whileHover: { scale: 1.035 }, whileTap: { scale: 0.98 } })}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-medium tracking-tight transition-colors duration-300",
        full && "w-full",
        variant === "primary"
          ? "text-primary-foreground glow-ring"
          : "border border-border text-foreground/85 hover:border-lavender/40 hover:text-foreground",
        className,
      )}
    >
      {variant === "primary" && (
        <>
          <span
            className="absolute inset-0 rounded-full"
            style={{ backgroundImage: "var(--gradient-violet)" }}
          />
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="animate-sheen absolute inset-y-0 -left-1/2 w-1/3 bg-foreground/25 blur-md" />
          </span>
        </>
      )}
      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </MotionLink>
  );
}
