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
		<div className="meet-bootstrap">
			{!autoOpen && (
				<button
					onClick={() => setOpen(true)}
					style={{ backgroundImage: "var(--gradient-button)" }}
					className="m-8 flex cursor-pointer items-center justify-center rounded-full border-0 p-3 text-lg font-medium text-white shadow-[0_20px_50px_-22px_oklch(0.63_0.216_300.5/90%)] transition-opacity hover:opacity-90"
				>
					Start a Meeting Now
				</button>
			)}
			<Dialog open={open} onOpenChange={handleOpenChange}>
					<DialogContent className="overflow-hidden border-white/10 p-0 sm:max-w-lg">
					<div
						aria-hidden
						className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-violet/25 blur-3xl"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute -bottom-28 -left-20 size-56 rounded-full bg-violet/15 blur-3xl"
					/>
					<div className="relative grid gap-4 p-4 sm:p-6">
						<DialogHeader>
							<DialogTitle className="text-lg font-semibold">
								What&apos;s your name?
							</DialogTitle>
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
									style={{ backgroundImage: "var(--gradient-button)" }}
									className="h-10 w-full rounded-full border-0 text-white shadow-[0_18px_44px_-20px_oklch(0.63_0.216_300.5/90%)] transition-opacity hover:opacity-90 sm:w-auto"
								>
									Create Meet
								</Button>
							</DialogFooter>
						</form>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default StartMeeting;