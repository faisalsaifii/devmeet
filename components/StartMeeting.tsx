"use client";

import { useRouter } from "next/navigation";

const StartMeeting = () => {
	const router = useRouter();

	const startMeeting = () => {
		router.push(`/meet/${crypto.randomUUID()}`);
	};

	return (
		<button
			onClick={startMeeting}
			className="text-lg m-8 flex p-3 items-center justify-center mx-2 font-thin rounded-md bg-neutral-200 dark:bg-neutral-800"
		>
			Start a Meeting Now
		</button>
	);
};

export default StartMeeting;