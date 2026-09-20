"use client";

import Image from "next/image";
import Link from "next/link";
import { useSocket } from "../Context";
import Github from "../../icons/Github";
import CopyLink from "../CopyLink";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import MeetTimer from "./MeetTimer";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group";

const NavBar = ({ setShowInfo }: { setShowInfo: (show: boolean) => void }) => {
	const { currentWindow, setCurrentWindow } = useSocket();

	return (
		<nav className="absolute top-0 z-50 flex h-18 w-full items-center justify-between bg-gradient-to-b from-black/50 via-black/25 to-transparent p-2">
			<div className="flex items-center gap-3">
				<Link href="/">
					<Image
						className="h-10 w-10 rounded-full shadow-[0_0_0_1px_oklch(0.985_0.008_300/20%),0_8px_24px_-8px_oklch(0.63_0.216_300.5/70%)]"
						width={40}
						height={40}
						src="/img/logo.svg"
						alt="Logo"
					/>
				</Link>
				<MeetTimer />
			</div>
			<ToggleGroup
				value={[currentWindow]}
				onValueChange={(values) => {
					const next = values[0];
					if (next) setCurrentWindow(next);
				}}
				className="rounded-full border border-white/10 bg-white/10 p-1 font-thin shadow-inner shadow-black/30 backdrop-blur-xl"
			>
				<ToggleGroupItem
					value="meet"
					className="rounded-full px-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white aria-pressed:bg-white/90 data-pressed:bg-white/90 aria-pressed:text-neutral-900 data-pressed:text-neutral-900"
				>
					Meet
				</ToggleGroupItem>
				<ToggleGroupItem
					value="both"
					className="hidden rounded-full px-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white aria-pressed:bg-white/90 data-pressed:bg-white/90 aria-pressed:text-neutral-900 data-pressed:text-neutral-900 md:inline-flex"
				>
					Home
				</ToggleGroupItem>
				<ToggleGroupItem
					value="code"
					className="rounded-full px-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white aria-pressed:bg-white/90 data-pressed:bg-white/90 aria-pressed:text-neutral-900 data-pressed:text-neutral-900"
				>
					Code
				</ToggleGroupItem>
			</ToggleGroup>
			<div className="flex items-center">
				<CopyLink />
				<Button
					nativeButton={false}
					render={
						<a
							href="https://github.com/sponsors/faisalsaifii"
							target="_blank"
							rel="noreferrer"
						/>
					}
					className="mx-2 hidden items-center justify-center rounded-full bg-white/15 px-3 py-1 text-xs font-thin text-white transition-colors hover:bg-white/25 md:flex"
				>
					Sponsor
				</Button>
				<a
					href="https://github.com/faisalsaifii/DevMeet"
					target="_blank"
					rel="noreferrer"
					className="m-1 grid size-7 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
				>
					<Github />
				</a>
				<Button
					size="icon"
					title="Info"
					onClick={() => setShowInfo(true)}
					className="m-1 size-7 rounded-full bg-white/15 text-white hover:bg-white/25"
				>
					<Info className="size-4" />
				</Button>
			</div>
		</nav>
	);
};

export default NavBar;