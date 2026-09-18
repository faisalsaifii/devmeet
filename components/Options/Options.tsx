"use client";

import { useState } from "react";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSocket } from "../Context";

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

	const handleCopy = () => {
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
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
				<input
					className="w-full dark:bg-neutral-900 focus:outline-none rounded-l-md p-4 border-0 font-thin"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Name"
				/>
				<div className="p-2 dark:bg-neutral-900 bg-white rounded-r-md">
					<CopyToClipboard
						text={typeof window !== "undefined" ? window.location.href : ""}
						onCopy={handleCopy}
					>
						<button
							className={`rounded-md h-10 w-10 p-2 ${
								copied ? "bg-green-400" : "bg-purple-400"
							}`}
							title={copied ? "Link copied!" : "Copy invite link to share"}
						>
							<Image width={24} height={24} src="/copy.svg" alt="Copy invite link" />
						</button>
					</CopyToClipboard>
				</div>
			</div>
			<div
				className={`flex items-center ${
					currentWindow === "meet" ? "w-full md:w-1/2" : "mt-2"
				}`}
			>
				{callAccepted && !callEnded ? (
					<button
						onClick={leaveCall}
						className="bg-red-400 rounded-md h-10 w-10 p-2"
						title="Hang Up"
					>
						<Image width={24} height={24} src="/cut.svg" alt="Hang Up" />
					</button>
				) : null}
				<span className="font-thin text-sm ml-2 text-neutral-500">
					Share the invite link with the other person to connect.
				</span>
			</div>
		</div>
	);
};

export default Options;