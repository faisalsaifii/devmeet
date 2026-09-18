import type { Metadata } from "next";
import MeetShell from "@/components/MeetShell";
import { ContextProvider } from "@/components/Context";

export const metadata: Metadata = {
	title: "Start a Meeting",
	description: "Join or start a live coding interview meeting on DevMeet.",
};

export default async function MeetRoomPage({
	params,
}: {
	params: Promise<{ roomId: string }>;
}) {
	const { roomId } = await params;

	return (
		<ContextProvider roomId={roomId}>
			<MeetShell />
		</ContextProvider>
	);
}