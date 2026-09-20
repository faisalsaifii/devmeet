"use client";

import Image from "next/image";
import { Loader2Icon } from "lucide-react";
import { useSocket } from "./Context";

const tiles = [0, 1];

const LoadingScreen = () => {
  const { name } = useSocket();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 p-6 py-20">
      <div className="flex flex-col items-center gap-4">
        <Image
          className="h-14 w-14 rounded-2xl animate-pulse"
          width={56}
          height={56}
          src="/img/logo.svg"
          alt="DevMeet logo"
        />
        <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-lavender">
          <span className="size-1.5 animate-pulse rounded-full bg-live" />
          Connecting call
        </span>
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-4 md:flex-row">
        {tiles.map((i) => (
          <div
            key={i}
            className="meet-tile animate-shimmer relative aspect-video w-full md:w-1/2"
          >
            <div className="animate-shimmer absolute right-2 bottom-2 h-5 w-20 overflow-hidden rounded-md bg-foreground/10" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 font-thin text-muted-foreground">
        <Loader2Icon className="animate-spin size-4" />
        Joining meet{name ? ` as ${name}` : ""}…
      </div>
    </div>
  );
};

export default LoadingScreen;