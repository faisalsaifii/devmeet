"use client";

import { useState } from "react";
import Link from "next/link";
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import Notifications from "./Notification/Notifications";
import Options from "./Options/Options";
import Compiler from "./Compiler/Compiler";
import NavBar from "./NavBar/NavBar";
import Info from "./Info";
import { useSocket } from "./Context";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

function Meet() {
	const { currentWindow, roomEnded } = useSocket();
	const [showInfo, setShowInfo] = useState(false);

	if (roomEnded) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-4">
				<h1 className="text-4xl font-bold">Call Ended</h1>
				<p className="text-lg text-muted-foreground">
					This meeting has been closed permanently.
				</p>
				<Link href="/meet">
					<Button className="mt-4 bg-violet-500 text-white shadow-lg shadow-violet-950/40 hover:bg-violet-600">
						<Phone className="mr-2 size-4" />
						Start a new meet
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<>
			{showInfo && <Info setShowInfo={setShowInfo} />}
			<NavBar setShowInfo={setShowInfo} />
			<div className={`flex h-full pt-14`}>
				<div
					className={`relative overflow-y-auto overflow-x-hidden no-scrollbar pt-1 ${
						currentWindow === "meet"
							? "w-full px-2"
							: currentWindow === "both"
							? "w-1/4 pl-2"
							: "hidden"
					}`}
				>
					<VideoPlayer />
					<Options />
				</div>
				<div
					className={`pt-1 ${
						currentWindow === "code"
							? "w-full"
							: currentWindow === "both"
							? "w-3/4"
							: "hidden"
					}`}
				>
					<Compiler />
				</div>
				<Notifications />
			</div>
		</>
	);
}

export default Meet;
