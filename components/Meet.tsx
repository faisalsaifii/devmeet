"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import LoadingScreen from "./LoadingScreen";
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
	const { currentWindow, roomEnded, roomFull, connecting } = useSocket();
	const [showInfo, setShowInfo] = useState(false);
	const { defaultLayout, onLayoutChanged } = useDefaultLayout({
		id: "meet-video-code-split",
	});

	/* eslint-disable react-hooks/set-state-in-effect -- show the first-run guide only once */
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (localStorage.getItem("dm-seen-info")) return;
		localStorage.setItem("dm-seen-info", "1");
		setShowInfo(true);
	}, []);
	/* eslint-enable react-hooks/set-state-in-effect */

	if (roomEnded) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
				<div className="relative">
					<div
						aria-hidden
						className="absolute -inset-8 rounded-full bg-violet/25 blur-3xl"
					/>
					<div
						className="relative grid size-20 place-items-center rounded-2xl text-white shadow-[0_24px_64px_-24px_oklch(0.63_0.216_300.5/90%)] ring-1 ring-white/20"
						style={{ backgroundImage: "var(--gradient-violet)" }}
					>
						<Phone className="size-8" />
					</div>
				</div>
				<div className="mt-4">
					<h1 className="text-5xl font-black tracking-tight">
						Call{" "}
						<span className="meet-title-gradient">Ended</span>
					</h1>
					<p className="mt-2 text-lg text-muted-foreground">
						This meeting has been closed permanently.
					</p>
				</div>
				<Link href="/meet" className="mt-4">
					<Button
						className="h-11 rounded-full border-0 px-7 text-white shadow-[0_20px_50px_-22px_oklch(0.63_0.216_300.5/90%)] hover:opacity-90"
						style={{ backgroundImage: "var(--gradient-button)" }}
					>
						<Phone className="mr-2 size-4" />
						Start a new meet
					</Button>
				</Link>
			</div>
		);
	}

	if (roomFull) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
				<div className="relative">
					<div
						aria-hidden
						className="absolute -inset-8 rounded-full bg-rose-500/20 blur-3xl"
					/>
					<div
						className="relative grid size-20 place-items-center rounded-2xl bg-rose-500/90 text-white shadow-[0_24px_64px_-24px_oklch(0.64_0.2_20/80%)] ring-1 ring-white/20"
					>
						<Phone className="size-8" />
					</div>
				</div>
				<div className="mt-4">
					<h1 className="text-5xl font-black tracking-tight">
						Meet is{" "}
						<span className="bg-rose-400 bg-clip-text text-transparent">
							Full
						</span>
					</h1>
					<p className="mt-2 text-lg text-muted-foreground">
						This meeting already has 2 members.
					</p>
				</div>
				<Link href="/meet" className="mt-4">
					<Button
						className="h-11 rounded-full border-0 px-7 text-white shadow-[0_20px_50px_-22px_oklch(0.63_0.216_300.5/90%)] hover:opacity-90"
						style={{ backgroundImage: "var(--gradient-button)" }}
					>
						<Phone className="mr-2 size-4" />
						Start a new meet
					</Button>
				</Link>
			</div>
		);
	}

	if (connecting) {
		return <LoadingScreen />;
	}

	return (
		<>
			{showInfo && <Info setShowInfo={setShowInfo} />}
			<NavBar setShowInfo={setShowInfo} />
			<div className="animate-fade-in flex h-full overflow-hidden pt-14">
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
