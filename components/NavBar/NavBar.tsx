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
		<nav className="absolute top-0 z-50 w-full h-18 flex items-center p-2 justify-between">
			<div className="flex items-center gap-3">
				<Link href="/">
					<Image
						className="h-10 w-10 rounded-full"
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
				className="rounded-md bg-muted p-1 font-thin"
			>
				<ToggleGroupItem
					value="meet"
					className="rounded-md bg-transparent px-3 aria-pressed:bg-background data-pressed:bg-background"
				>
					Meet
				</ToggleGroupItem>
				<ToggleGroupItem
					value="both"
					className="hidden rounded-md bg-transparent px-3 aria-pressed:bg-background data-pressed:bg-background md:inline-flex"
				>
					Home
				</ToggleGroupItem>
				<ToggleGroupItem
					value="code"
					className="rounded-md bg-transparent px-3 aria-pressed:bg-background data-pressed:bg-background"
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
					className="mx-2 hidden items-center justify-center rounded-md p-2 text-xs font-thin md:flex"
					variant="secondary"
				>
					Sponsor
				</Button>
				<a
					href="https://github.com/faisalsaifii/DevMeet"
					target="_blank"
					rel="noreferrer"
					className="m-1 h-6 rounded-full"
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