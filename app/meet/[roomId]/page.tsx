import type { Metadata } from "next";
import MeetShell from "@/components/MeetShell";
import NameGate from "@/components/NameGate";
import { ContextProvider } from "@/components/Context";
import { isRoomClosed } from "@/lib/rooms";

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
  const roomClosed = isRoomClosed(roomId);

  return (
    <div className="meet-app h-full">
      <NameGate>
        <ContextProvider roomId={roomId} initialRoomEnded={roomClosed}>
          <MeetShell />
        </ContextProvider>
      </NameGate>
    </div>
  );
}
