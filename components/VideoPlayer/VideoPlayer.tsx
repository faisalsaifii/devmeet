"use client";

import { useSocket } from "../Context";
import { Badge } from "@/components/ui/badge";
import { MicOff, VideoOff } from "lucide-react";

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
    remoteCameraEnabled,
    remoteMicEnabled,
  } = useSocket();

  const horizontal = currentWindow === "meet";

  return (
    <div
      className={`flex h-full ${
        horizontal
          ? "flex-col md:flex-row items-center md:justify-center"
          : "flex-col"
      }`}
    >
      {callAccepted && !callEnded && (
        <div
          className={`relative flex min-h-0 min-w-0 aspect-video w-full items-center justify-center overflow-hidden rounded-md bg-muted ${
            horizontal ? "mb-2 md:mb-0 md:mr-2 md:w-1/2" : "mb-2"
          }`}
        >
          {remoteCameraEnabled ? (
            <video
              playsInline
              ref={userVideoRef}
              autoPlay
              className="h-full w-full overflow-hidden object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <VideoOff className="size-10 text-muted-foreground" />
              <Badge className="border-0 bg-transparent font-thin text-sm text-muted-foreground">
                Camera is off
              </Badge>
            </div>
          )}
          {!remoteMicEnabled && (
            <Badge className="absolute bottom-1 left-1 flex h-auto w-auto items-center gap-1 rounded-md border-0 bg-black/50 px-2 py-0.5 text-xs font-black text-white">
              <MicOff className="size-3" />
            </Badge>
          )}
          <Badge className="absolute right-1 bottom-1 flex h-auto w-auto items-center rounded-md border-0 bg-black/50 px-2 py-0.5 text-xs font-black text-white">
            {call.name || "Someone"}
          </Badge>
        </div>
      )}
      {stream && (
        <div
          className={`relative flex aspect-video w-full min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-md bg-muted ${
            horizontal ? "md:w-1/2" : ""
          }`}
        >
          {cameraEnabled ? (
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
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <VideoOff className="size-10 text-muted-foreground" />
              <Badge className="border-0 bg-transparent font-thin text-sm text-muted-foreground">
                Camera is off
              </Badge>
            </div>
          )}
          <Badge className="absolute bottom-1 right-1 flex h-auto w-auto items-center rounded-md border-0 bg-black/50 px-2 py-0.5 text-xs font-black text-white">
            {name || "Me"}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;