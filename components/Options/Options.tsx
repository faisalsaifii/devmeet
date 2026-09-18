"use client";

import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSocket } from "../Context";

const Options = () => {
	const {
		me,
		name,
		setName,
		callAccepted,
		leaveCall,
		callUser,
		callEnded,
		currentWindow,
	} = useSocket();

	const [idToCall, setIdToCall] = useState("");

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
					<CopyToClipboard text={me}>
						<button
							className="bg-purple-400 rounded-md h-10 w-10 p-2"
							title="Copy Meet ID"
						>
							<img src="/copy.svg" alt="Copy ID" />
						</button>
					</CopyToClipboard>
				</div>
			</div>
			<div
				className={`flex items-center ${
					currentWindow === "meet" ? "w-full md:w-1/2" : "mt-2"
				}`}
			>
				<input
					className="w-full dark:bg-neutral-900 focus:outline-none rounded-l-md p-4 border-0 font-thin"
					type="text"
					value={idToCall}
					onChange={(e) => setIdToCall(e.target.value)}
					placeholder="ID to Call"
				/>
				<div className="p-2 dark:bg-neutral-900 bg-white rounded-r-md">
					{callAccepted && !callEnded ? (
						<button
							onClick={leaveCall}
							className="bg-red-400 rounded-md h-10 w-10 p-2"
							title="Hang Up"
						>
							<img src="/cut.svg" alt="Hang Up" />
						</button>
					) : (
						<>
							{idToCall ? (
								<button
									onClick={() => callUser(idToCall)}
									className="bg-green-400 rounded-md h-10 w-10 p-2"
									title="Call"
								>
									<img src="/call.svg" alt="Call" />
								</button>
							) : (
								<div className="h-10 w-10"></div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Options;
