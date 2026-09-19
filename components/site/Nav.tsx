import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Arrow, LINKS, MagneticLink } from "@/components/site/primitives";

const items = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "GitHub", href: LINKS.github },
];

export function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setStuck(v > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 180, damping: 26 }}
        className={cn(
          "flex w-full items-center gap-6 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5",
          stuck
            ? "glass max-w-4xl shadow-[0_20px_60px_-30px_oklch(0.63_0.216_300.5/45%)]"
            : "max-w-6xl border border-transparent bg-transparent",
        )}
      >
        <a href="#top" className="group flex items-center gap-2.5">
          <img src={"/Logo.svg"} alt="" className="size-7 rounded-full" />
          <span className="font-display text-[1.05rem] font-semibold tracking-tight">
            DevMeet
          </span>
        </a>

        <ul className="ml-auto hidden items-center gap-7 md:flex">
          {items.map((it) => (
            <li key={it.label}>
              <a
                href={it.href}
                {...(it.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className="text-muted-foreground hover:text-foreground relative text-[0.9rem] transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-[image:var(--gradient-violet)] after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden md:ml-0 md:block">
          <MagneticLink href={LINKS.app} className="px-5 py-2.5 text-[0.85rem]">
            Launch DevMeet <Arrow />
          </MagneticLink>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="border-border ml-auto flex size-9 flex-col items-center justify-center gap-1.5 rounded-full border md:hidden"
        >
          <span
            className={cn(
              "bg-foreground h-px w-4 transition-transform duration-300",
              open && "translate-y-[3.5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "bg-foreground h-px w-4 transition-transform duration-300",
              open && "-translate-y-[3.5px] -rotate-45",
            )}
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass fixed inset-x-4 top-20 rounded-3xl p-6 md:hidden"
          >
            <ul className="flex flex-col gap-5">
              {items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    onClick={() => setOpen(false)}
                    {...(it.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="font-display text-xl tracking-tight"
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <MagneticLink href={LINKS.app} full>
                Launch DevMeet <Arrow />
              </MagneticLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
