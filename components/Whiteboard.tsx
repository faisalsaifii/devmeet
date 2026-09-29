"use client";

import dynamic from "next/dynamic";
import { cn } from "cn";
import type { CodeCollab } from "./Compiler/useCodeCollab";

const WhiteboardCanvas = dynamic(() => import("./WhiteboardCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
      Loading board...
    </div>
  ),
});

type WhiteboardProps = {
  collab?: CodeCollab | null;
  className?: string;
};

const Whiteboard = ({ collab, className }: WhiteboardProps) => (
  <div
    className={cn(
      "flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-md bg-card p-1",
      className,
    )}
  >
    <WhiteboardCanvas collab={collab} />
  </div>
);

export default Whiteboard;
