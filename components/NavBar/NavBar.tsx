"use client";

import Image from "next/image";
import Link from "next/link";
import { useSocket } from "../Context";
import Github from "../../icons/Github";

const NavBar = ({ setShowInfo }: { setShowInfo: (show: boolean) => void }) => {
	const { currentWindow, setCurrentWindow } = useSocket();

	return (
		<nav className="absolute top-0 w-full h-18 flex items-center p-2 justify-between">
			<Link href="/">
				<Image
					className="h-10 w-10 rounded-full"
					width={40}
					height={40}
					src="/img/logo.svg"
					alt="Logo"
				/>
			</Link>
			<div className="rounded-md bg-neutral-200 dark:bg-neutral-900 p-1 font-thin">
				<button
					className={`p-1 px-3 rounded-md ${
						currentWindow === "meet"
							? "dark:bg-black bg-white"
							: "dark:bg-neutral-900 bg-neutral-200"
					}`}
					onClick={() => setCurrentWindow("meet")}
				>
					Meet
				</button>
				<button
					className={`hidden md:inline p-1 px-3 rounded-md ${
						currentWindow === "both"
							? "dark:bg-black bg-white"
							: "dark:bg-neutral-900 bg-neutral-200"
					}`}
					onClick={() => setCurrentWindow("both")}
				>
					Home
				</button>
				<button
					className={`p-1 px-3 rounded-md ${
						currentWindow === "code"
							? "dark:bg-black bg-white"
							: "dark:bg-neutral-900 bg-neutral-200"
					}`}
					onClick={() => setCurrentWindow("code")}
				>
					Code
				</button>
			</div>
			<div className="flex">
				<a
					href="https://github.com/sponsors/faisalsaifii"
					target="_blank"
					rel="noreferrer"
					className="hidden md:flex p-2 items-center justify-center mx-2 text-xs font-thin rounded-md bg-neutral-200 dark:bg-neutral-800"
				>
					Sponsor
				</a>
				<a
					href="https://github.com/faisalsaifii/DevMeet"
					target="_blank"
					rel="noreferrer"
					className="m-1 h-6 rounded-full"
				>
					<Github />
				</a>
				<button
					className="m-1 h-6 bg-purple-400 rounded-full"
					title="Info"
					onClick={() => setShowInfo(true)}
				>
					<Image
						className="h-full w-auto"
						width={24}
						height={24}
						src="/img/info.svg"
						alt="Info"
					/>
				</button>
			</div>
		</nav>
	);
};

export default NavBar;
