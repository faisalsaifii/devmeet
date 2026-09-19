import Image from "next/image";
import Link from "next/link";
import { LINKS } from "./markup";

export function Footer() {
  return (
    <footer className="border-border relative border-t py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row">
        <Link href="#top" className="flex items-center gap-2.5">
          <Image
            src="/Logo.svg"
            alt="DevMeet"
            width={24}
            height={24}
            className="size-6 rounded-full"
          />
          <span className="font-display text-[0.98rem] font-semibold tracking-tight">
            DevMeet
          </span>
        </Link>
        <p className="text-muted-foreground font-mono text-[0.7rem] tracking-wide sm:ml-4">
          Technical interviews, in one room.
        </p>
        <nav className="text-muted-foreground flex items-center gap-6 text-[0.85rem] sm:ml-auto">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how" className="hover:text-foreground transition-colors">
            How it works
          </Link>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}