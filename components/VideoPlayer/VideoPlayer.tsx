"use client";

import { useSocket } from "../Context";
import { Badge } from "@/components/ui/badge";

const VideoPlayer = () => {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    currentWindow,
  } = useSocket();

  return (
    <div
      className={`flex h-full ${
        currentWindow !== "meet"
          ? "flex-col"
          : "flex-col md:flex-row justify-start items-center md:justify-center"
      }`}
    >
      {callAccepted && !callEnded && (
        <div
          className={`relative flex items-center justify-center rounded-md bg-muted ${
            currentWindow === "meet" ? "mb-2 md:mb-0 md:mr-2" : "mb-2"
          }`}
        >
          <video
            playsInline
            ref={userVideo}
            autoPlay
            className="rounded-md max-h-full max-w-full w-auto h-auto overflow-hidden"
          />
          <Badge className="absolute bottom-1 left-1/2 -translate-x-1/2 border-0 bg-transparent font-black text-muted-foreground">
            {call.name || "Someone"}
          </Badge>
        </div>
      )}
      {stream && (
        <div className="relative flex items-center justify-center rounded-md bg-muted">
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="rounded-md max-h-full max-w-full w-auto h-auto overflow-hidden"
          />
          <Badge className="absolute bottom-1 left-1/2 -translate-x-1/2 border-0 bg-transparent font-black text-muted-foreground">
            {name || "Me"}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
