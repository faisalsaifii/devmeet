"use client";

import { useSocket } from "../Context";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Mic,
	MicOff,
	PhoneOff,
	Video,
	VideoOff,
} from "lucide-react";

const controlButton = (enabled: boolean) =>
	enabled
		? "rounded-full bg-white/90 text-neutral-900 shadow-lg shadow-black/20 hover:bg-white"
		: "rounded-full bg-white/15 text-white shadow-lg shadow-black/20 hover:bg-white/25";

const Options = () => {
	const {
		leaveCall,
		callEnded,
		micEnabled,
		toggleMic,
		cameraEnabled,
		toggleCamera,
		me,
	} = useSocket();

	const isInCall = !!me && !callEnded;

	if (!isInCall) return null;

	return (
		<div className="absolute bottom-0 left-0 z-20 w-full p-3">
			<div className="mx-auto flex w-fit max-w-full items-center rounded-full border border-white/10 bg-black/55 p-2 shadow-2xl shadow-black/50 backdrop-blur-2xl">
				<div className="flex items-center gap-2">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									size="icon"
									onClick={toggleMic}
									className={`size-11 ${controlButton(micEnabled)}`}
								/>
							}
						>
							{micEnabled ? (
								<Mic className="size-5" />
							) : (
								<MicOff className="size-5" />
							)}
						</TooltipTrigger>
						<TooltipContent>
							{micEnabled ? "Mute" : "Unmute"}
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									size="icon"
									onClick={toggleCamera}
									className={`size-11 ${controlButton(cameraEnabled)}`}
								/>
							}
						>
							{cameraEnabled ? (
								<Video className="size-5" />
							) : (
								<VideoOff className="size-5" />
							)}
						</TooltipTrigger>
						<TooltipContent>
							{cameraEnabled ? "Camera off" : "Camera on"}
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="mx-2 h-7 w-px bg-white/15" />
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								size="icon"
								onClick={leaveCall}
								className="size-11 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-950/40 hover:bg-rose-600"
							/>
						}
					>
						<PhoneOff className="size-5" />
					</TooltipTrigger>
					<TooltipContent>Hang up</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};

export default Options;
