"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

const pad = (n: number) => String(n).padStart(2, "0");

const formatElapsed = (seconds: number) => {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const MeetTimer = () => {
	const [start] = useState(() => Date.now());
	const [elapsed, setElapsed] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setElapsed(Math.floor((Date.now() - start) / 1000));
		}, 1000);
		return () => clearInterval(id);
	}, [start]);

	return (
		<div className="m-1 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white tabular-nums backdrop-blur-lg">
			<Timer className="size-4 text-lavender" />
			{formatElapsed(elapsed)}
		</div>
	);
};

export default MeetTimer;