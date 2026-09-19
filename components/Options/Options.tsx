"use client";

import { useState } from "react";
import { useSocket } from "../Context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Check,
	Copy,
	Mic,
	MicOff,
	PhoneOff,
	Video,
	VideoOff,
} from "lucide-react";

const controlButton = (enabled: boolean) =>
	enabled
		? "bg-white/90 text-neutral-900 shadow-lg shadow-black/20 hover:bg-white"
		: "bg-rose-500 text-white shadow-lg shadow-rose-950/40 hover:bg-rose-600";

const Options = () => {
	const {
		name,
		setName,
		leaveCall,
		callEnded,
		micEnabled,
		toggleMic,
		cameraEnabled,
		toggleCamera,
		me,
	} = useSocket();

	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error(error);
		}
	};

	const isInCall = !!me && !callEnded;

	return (
		<div className="absolute bottom-0 left-0 z-20 w-full p-3">
			<div className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-2xl border border-white/10 bg-black/60 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
				<div className="flex w-full items-center gap-1.5 md:w-auto">
					<Input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Name"
						className="h-8 w-28 flex-shrink-0 rounded-full border-white/10 bg-white/10 font-thin text-white backdrop-blur-sm placeholder:text-white/40 hover:border-white/20 focus-visible:border-white/30 focus-visible:ring-white/10 md:w-32"
					/>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									size="icon"
									onClick={handleCopy}
									className={
										copied
											? "bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-600"
											: "bg-white/15 text-white shadow-lg shadow-black/20 hover:bg-white/25"
									}
								/>
							}
						>
							{copied ? (
								<Check className="size-4" />
							) : (
								<Copy className="size-4" />
							)}
						</TooltipTrigger>
						<TooltipContent>
							{copied ? "Copied!" : "Copy invite link"}
						</TooltipContent>
					</Tooltip>
				</div>

				{isInCall && (
					<>
						<div className="hidden h-6 w-px bg-white/10 md:block" />
						<div className="flex items-center gap-1.5">
							<Tooltip>
								<TooltipTrigger
									render={
										<Button
											size="icon"
											onClick={toggleMic}
											className={controlButton(micEnabled)}
										/>
									}
								>
									{micEnabled ? (
										<Mic className="size-4" />
									) : (
										<MicOff className="size-4" />
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
											className={controlButton(cameraEnabled)}
										/>
									}
								>
									{cameraEnabled ? (
										<Video className="size-4" />
									) : (
										<VideoOff className="size-4" />
									)}
								</TooltipTrigger>
								<TooltipContent>
									{cameraEnabled ? "Camera off" : "Camera on"}
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger
									render={
										<Button
											size="icon"
											onClick={leaveCall}
											className="bg-rose-500 text-white shadow-lg shadow-rose-950/40 hover:bg-rose-600"
										/>
									}
								>
									<PhoneOff className="size-4" />
								</TooltipTrigger>
								<TooltipContent>Hang up</TooltipContent>
							</Tooltip>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Options;
