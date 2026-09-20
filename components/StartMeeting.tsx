"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CameraPreview from "@/components/CameraPreview";
import { confirmName, getStoredName, storeName } from "@/lib/name";

const StartMeeting = ({ autoOpen = false }: { autoOpen?: boolean }) => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const router = useRouter();

	/* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on the client only */
	useEffect(() => {
		setName(getStoredName());
		if (autoOpen) setOpen(true);
	}, [autoOpen]);
	/* eslint-enable react-hooks/set-state-in-effect */

	const createMeeting = () => {
		storeName(name);
		confirmName();
		router.push(`/meet/${crypto.randomUUID()}`);
	};

	const handleOpenChange = (next: boolean) => {
		if (autoOpen && !next) {
			router.push("/");
			return;
		}
		setOpen(next);
	};

	return (
		<>
			{!autoOpen && (
				<button
					onClick={() => setOpen(true)}
					className="text-lg m-8 flex p-3 items-center justify-center mx-2 font-thin rounded-md bg-neutral-200 dark:bg-neutral-800"
				>
					Start a Meeting Now
				</button>
			)}
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>What&apos;s your name?</DialogTitle>
						<DialogDescription>
							Enter your name so the other participant knows who&apos;s
							joining. Grant camera &amp; mic access so you&apos;re ready
							when the call starts.
						</DialogDescription>
					</DialogHeader>
					<CameraPreview />
					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (name.trim()) createMeeting();
						}}
						className="flex flex-col gap-4"
					>
						<Input
							autoFocus
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Your name"
						/>
						<DialogFooter>
							<Button
								type="submit"
								disabled={!name.trim()}
								className="w-full bg-violet-500 text-white shadow-lg shadow-violet-950/40 hover:bg-violet-600 sm:w-auto"
							>
								Create Meet
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default StartMeeting;