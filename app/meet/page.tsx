import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";

export const metadata: Metadata = {
  title: "Start a Meeting",
  description: "Join or start a live coding interview meeting on DevMeet.",
};

export const dynamic = "force-dynamic";

export default function MeetPage() {
  redirect(`/meet/${randomUUID()}`);
}
