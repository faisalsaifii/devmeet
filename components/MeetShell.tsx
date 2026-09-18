"use client";

import dynamic from "next/dynamic";

const Meet = dynamic(() => import("./Meet"), {
	ssr: false,
	loading: () => (
		<div className="flex h-full items-center justify-center font-thin text-neutral-500">
			Starting meeting...
		</div>
	),
});

const MeetShell = () => <Meet />;

export default MeetShell;