"use client";

import { motion, useReducedMotion } from "motion/react";

const particles = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  d: 9 + (i % 7) * 2.5,
  s: i % 3 === 0 ? 2 : 1,
  delay: (i % 5) * 1.3,
}));

/** Ambient page background: gradients, grid, drifting blobs, particles, grain. */
export function Atmosphere() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="bg-background absolute inset-0" />
      <div className="line-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]" />
      <div
        className="animate-drift absolute -top-[22%] left-1/2 h-[62vh] w-[70vw] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--primary), transparent 68%)",
        }}
      />
      <div
        className="animate-drift absolute top-[45%] -left-[15%] h-[52vh] w-[46vw] rounded-full opacity-[0.18] blur-[130px]"
        style={{
          background: "radial-gradient(circle, var(--violet), transparent 70%)",
        }}
      />
      <div
        className="animate-drift absolute top-[110%] right-[-10%] h-[55vh] w-[45vw] rounded-full opacity-[0.14] blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, var(--secondary), transparent 70%)",
        }}
      />

      {!reduced &&
        particles.map((p, i) => (
          <motion.span
            key={i}
            className="bg-lavender/50 absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.s,
              height: p.s,
            }}
            animate={{ y: [0, -40, 0], opacity: [0, 0.7, 0] }}
            transition={{
              duration: p.d,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}

      <div className="grain absolute inset-0 opacity-40" />
    </div>
  );
}
