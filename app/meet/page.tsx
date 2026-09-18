import type { Metadata } from "next";
import MeetShell from "@/components/MeetShell";

export const metadata: Metadata = {
	title: "Start a Meeting",
	description: "Join or start a live coding interview meeting on DevMeet.",
};

export default function MeetPage() {
	return <MeetShell />;
}