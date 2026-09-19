import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Arrow, Eyebrow, LINKS, MagneticLink, TextReveal } from "./primitives";
import { InterviewUI } from "./InterviewUI";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const soft = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
  });

  const rotateX = useTransform(soft, [0, 0.55], [17, 0]);
  const scale = useTransform(soft, [0, 0.55], [0.92, 1.02]);
  const y = useTransform(soft, [0, 1], [0, -90]);
  const glow = useTransform(soft, [0, 0.6], [0.35, 0.8]);
  const copyY = useTransform(soft, [0, 1], [0, -160]);
  const copyOpacity = useTransform(soft, [0, 0.55], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative pt-36 pb-24 sm:pt-44 lg:pb-32"
    >
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
        {...(reduced ? {} : { style: { y: copyY, opacity: copyOpacity } })}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Eyebrow>The interviewing IDE</Eyebrow>
        </motion.div>

        <h1 className="mt-8 text-[clamp(2.6rem,8.4vw,6.75rem)] leading-[0.95] font-semibold">
          <TextReveal text="Where technical interviews" delay={0.1} />
          <br />
          <TextReveal
            text="actually happen."
            highlight="actually happen."
            delay={0.32}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-muted-foreground mx-auto mt-8 max-w-xl text-[1.02rem] leading-relaxed sm:text-[1.12rem]"
        >
          <span className="text-foreground/90">
            Video calls and collaborative coding, together in one workspace.
          </span>{" "}
          Conduct technical interviews with a built-in collaborative IDE,
          real-time video and everything you need to see candidates solve
          problems live.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <MagneticLink href={LINKS.app} className="w-full sm:w-auto">
            Start Interview <Arrow />
          </MagneticLink>
          <MagneticLink
            href={LINKS.github}
            variant="ghost"
            className="w-full sm:w-auto"
          >
            View on GitHub <Arrow char="↗" />
          </MagneticLink>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15 }}
          className="text-muted-foreground mt-6 font-mono text-[0.72rem] tracking-wide"
        >
          No setup. No separate editor. Just send a link and start coding.
        </motion.p>
      </motion.div>

      {/* hero visual */}
      <div className="relative mx-auto mt-16 max-w-6xl px-4 sm:mt-24 sm:px-6">
        <motion.div
          aria-hidden
          className="absolute inset-x-8 top-8 bottom-16 rounded-[3rem] blur-[110px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, var(--primary), transparent 70%)",
            ...(reduced ? {} : { opacity: glow }),
          }}
        />
        <div style={{ perspective: 1600 }}>
          <motion.div
            initial={{ opacity: 0, y: 70, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            {...(reduced
              ? {}
              : {
                  style: {
                    rotateX,
                    scale,
                    y,
                    transformStyle: "preserve-3d" as const,
                  },
                })}
          >
            <InterviewUI />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
