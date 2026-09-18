"use client";

import { useSocket } from "../Context";

const Notifications = () => {
	const { call, answerCall, callAccepted, leaveCall, callEnded } = useSocket();

	return (
		<>
			{call.isReceivingCall && !callAccepted && !callEnded && (
				<div
					className="flex flex-col absolute bottom-6 right-6 p-4 rounded-2xl justify-between backdrop-blur-2xl bg-white/50 dark:bg-black/50"
					style={{ zIndex: 100 }}
				>
					<span className="pr-20 text-3xl font-thin">
						{call.name || "Somebody"} has sent an invite
					</span>
					<div className="flex justify-end items-center mt-10 text-white">
						<button
							onClick={answerCall}
							className="p-2 font-bold bg-green-400 rounded-md"
						>
							Accept
						</button>
						<button
							title="Close"
							className="p-2 m-2 font-bold bg-red-500 rounded-md"
							onClick={leaveCall}
						>
							Decline
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Notifications;
