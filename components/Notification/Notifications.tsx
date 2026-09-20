"use client";

import { useSocket } from "../Context";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";

const Notifications = () => {
	const { call, answerCall, callAccepted, leaveCall, callEnded } = useSocket();

	return (
		<>
			{call.isReceivingCall && !callAccepted && !callEnded && (
<Card
				className="absolute right-6 bottom-6 w-80 rounded-2xl border border-white/10 bg-card/60 p-4 shadow-[0_24px_60px_-24px_oklch(0.63_0.216_300.5/60%)] backdrop-blur-2xl"
				style={{ zIndex: 100 }}
			>
					<CardContent className="p-0">
						<p className="pr-20 text-3xl font-thin">
							{call.name || "Somebody"} has sent an invite
						</p>
					</CardContent>
					<CardFooter className="mt-10 justify-end gap-2 border-0 bg-transparent p-0 text-white">
						<Button
							onClick={answerCall}
							className="bg-green-400 font-bold hover:bg-green-400/80"
						>
							<Check className="size-4" />
							Accept
						</Button>
						<Button
							title="Close"
							onClick={leaveCall}
							className="bg-red-500 font-bold hover:bg-red-500/80"
						>
							<X className="size-4" />
							Decline
						</Button>
					</CardFooter>
				</Card>
			)}
		</>
	);
};

export default Notifications;