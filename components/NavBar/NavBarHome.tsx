"use client";

import Github from "../../icons/Github";

const NavBar = ({ setShowInfo }: { setShowInfo?: (show: boolean) => void }) => {
	return (
		<nav className="absolute top-0 w-full h-18 flex items-center p-2 justify-between">
			<a href="https://developermeet.vercel.app">
				<img className="h-10 rounded-full" src="/img/logo.svg" alt="Logo" />
			</a>

			<div className="flex">
				<a
					href="https://github.com/sponsors/faisalsaifii"
					target="_blank"
					rel="noreferrer"
					className="flex p-2 items-center justify-center mx-2 text-xs font-thin rounded-md bg-neutral-200 dark:bg-neutral-800"
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
					onClick={() => setShowInfo?.(true)}
				>
					<img className="h-full" src="/img/info.svg" alt="Info" />
				</button>
			</div>
		</nav>
	);
};

export default NavBar;
