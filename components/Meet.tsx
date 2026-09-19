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
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useDefaultLayout } from "react-resizable-panels";

function Meet() {
	const { currentWindow, roomEnded } = useSocket();
	const [showInfo, setShowInfo] = useState(false);
	const { defaultLayout, onLayoutChanged } = useDefaultLayout({
		id: "meet-video-code-split",
	});

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
			<div className="flex h-full pt-14">
				{currentWindow === "both" ? (
					<ResizablePanelGroup
						orientation="horizontal"
						id="meet-video-code-split"
						defaultLayout={defaultLayout}
						onLayoutChanged={onLayoutChanged}
						className="h-full w-full"
					>
						<ResizablePanel
							id="meet-video"
							defaultSize="25"
							minSize="15"
							maxSize="40"
							className="pt-1"
						>
							<div className="relative h-full overflow-y-auto overflow-x-hidden no-scrollbar px-2">
								<VideoPlayer />
								<Options />
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel
							id="meet-code"
							defaultSize="75"
							minSize="45"
							className="pt-1"
						>
							<div className="h-full">
								<Compiler />
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				) : currentWindow === "meet" ? (
					<div className="relative w-full overflow-y-auto overflow-x-hidden no-scrollbar px-2 pt-1">
						<VideoPlayer />
						<Options />
					</div>
				) : (
					<div className="w-full pt-1">
						<Compiler />
					</div>
				)}
				<Notifications />
			</div>
		</>
	);
}

export default Meet;
