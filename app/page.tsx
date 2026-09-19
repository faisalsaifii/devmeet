"use client";

import { Atmosphere } from "@/components/site/Atmosphere";
import { Experience } from "@/components/site/Experience";
import { Features } from "@/components/site/Features";
import { FinalCTA, Footer } from "@/components/site/FinalCTA";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Nav } from "@/components/site/Nav";
import { OpenSource } from "@/components/site/OpenSource";
import { Problem } from "@/components/site/Problem";
import { Showcase } from "@/components/site/Showcase";
import "@/app/page.css";

export default function Home() {
  return (
    <div className="dm-site flex flex-col">
      <Atmosphere />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Showcase />
        <Features />
        <HowItWorks />
        <Experience />
        <OpenSource />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
