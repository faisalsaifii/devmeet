"use client";

import { useSocket } from "../Context";
import { Badge } from "@/components/ui/badge";
import { MicOff, User, VideoOff } from "lucide-react";

const nameBadge =
  "flex h-auto w-auto items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[0.7rem] font-black text-white backdrop-blur-md";

const micOffBadge =
  "flex h-auto w-auto items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-xs font-black text-white backdrop-blur-md";

const CameraOff = () => (
  <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 p-6">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_40%,oklch(0.68_0.214_305/28%),transparent_68%)]"
    />
    <span
      className="relative grid size-14 place-items-center rounded-full text-white ring-1 ring-white/20 shadow-[0_16px_40px_-16px_oklch(0.63_0.216_300.5/90%)]"
      style={{ backgroundImage: "var(--gradient-violet)" }}
    >
      <User className="size-6" />
    </span>
    <Badge className="relative border-0 bg-transparent p-0 text-sm text-muted-foreground">
      <VideoOff className="mr-1.5 size-4" />
      Camera is off
    </Badge>
  </div>
);

const VideoPlayer = () => {
  const {
    name,
    callAccepted,
    myVideo: myVideoRef,
    userVideo: userVideoRef,
    callEnded,
    stream,
    call,
    currentWindow,
    cameraEnabled,
    remoteStream,
    remoteCameraEnabled,
    remoteMicEnabled,
  } = useSocket();

  const horizontal = currentWindow === "meet";

  return (
    <div
      className={`flex h-full ${
        horizontal
          ? "flex-col items-center md:flex-row md:justify-center"
          : "flex-col"
      }`}
    >
      {callAccepted && !callEnded && (
        <div
          className={`meet-tile relative flex aspect-video w-full min-h-0 min-w-0 items-center justify-center ${
            horizontal ? "mb-2 md:mb-0 md:mr-2 md:w-1/2" : "mb-2"
          }`}
        >
          {remoteCameraEnabled && (
            <video
              playsInline
              ref={(el) => {
                userVideoRef.current = el;
                if (el && remoteStream) el.srcObject = remoteStream;
              }}
              autoPlay
              className="h-full w-full overflow-hidden object-cover"
            />
          )}
          {!remoteCameraEnabled && <CameraOff />}
          {!remoteMicEnabled && (
            <Badge className={`absolute left-2 top-2 ${micOffBadge}`}>
              <MicOff className="size-3" />
            </Badge>
          )}
          <Badge className={`absolute bottom-2 right-2 ${nameBadge}`}>
            <span className="size-1.5 rounded-full bg-live" />
            {call.name || "Someone"}
          </Badge>
        </div>
      )}
      {stream && (
        <div
          className={`meet-tile relative flex aspect-video w-full min-h-0 min-w-0 items-center justify-center ${
            horizontal ? "md:w-1/2" : ""
          }`}
        >
          {cameraEnabled && (
            <video
              playsInline
              muted
              ref={(el) => {
                myVideoRef.current = el;
                if (el && stream) el.srcObject = stream;
              }}
              autoPlay
              className="h-full w-full overflow-hidden object-cover"
            />
          )}
          {!cameraEnabled && <CameraOff />}
          <Badge className={`absolute bottom-2 right-2 ${nameBadge}`}>
            <span className="size-1.5 rounded-full bg-violet" />
            {name || "Me"}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;