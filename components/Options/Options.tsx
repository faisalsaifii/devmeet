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
import { Copy, PhoneOff } from "lucide-react";

const Options = () => {
	const {
		name,
		setName,
		callAccepted,
		leaveCall,
		callEnded,
		currentWindow,
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

	return (
		<div
			className={`flex w-full ${
				currentWindow === "meet" ? "p-2 flex-col md:flex-row" : "flex-col"
			} absolute left-0 bottom-0 z-20`}
		>
			<div
				className={`flex items-center ${
					currentWindow === "meet"
						? "w-full md:w-1/2 mb-2 md:mb-0 md:mr-2"
						: "mt-2"
				}`}
			>
				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Name"
					className="h-10 flex-1 rounded-r-none border-0 bg-card font-thin"
				/>
				<div className="rounded-r-md bg-card p-2">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									size="icon"
									onClick={handleCopy}
									className={
										copied
											? "bg-green-400 hover:bg-green-400/80"
											: "bg-purple-400 hover:bg-purple-400/80"
									}
								/>
							}
						>
							<Copy className="size-4" />
						</TooltipTrigger>
						<TooltipContent>
							{copied ? "Link copied!" : "Copy invite link to share"}
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
			<div
				className={`flex items-center ${
					currentWindow === "meet" ? "w-full md:w-1/2" : "mt-2"
				}`}
			>
				{callAccepted && !callEnded ? (
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									size="icon"
									onClick={leaveCall}
									className="bg-red-400 hover:bg-red-400/80"
								/>
							}
						>
							<PhoneOff className="size-4" />
						</TooltipTrigger>
						<TooltipContent>Hang Up</TooltipContent>
					</Tooltip>
				) : null}
				<span className="font-thin text-sm ml-2 text-neutral-500">
					Share the invite link with the other person to connect.
				</span>
			</div>
		</div>
	);
};

export default Options;