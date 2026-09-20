"use client";

import { useEffect, useState, type ReactNode } from "react";
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
import { confirmName, getStoredName, isNameConfirmed, storeName } from "@/lib/name";

const NameGate = ({ children }: { children: ReactNode }) => {
	const [ready, setReady] = useState(false);
	const [name, setName] = useState("");
	const [confirmed, setConfirmed] = useState(false);
	const router = useRouter();

	/* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on the client only */
	useEffect(() => {
		setName(getStoredName());
		setConfirmed(isNameConfirmed());
		setReady(true);
	}, []);
	/* eslint-enable react-hooks/set-state-in-effect */

	if (!ready) return null;

	if (confirmed && name.trim()) return <>{children}</>;

	const joinMeeting = () => {
		const trimmed = name.trim();
		if (!trimmed) return;
		storeName(trimmed);
		confirmName();
		setName(trimmed);
		setConfirmed(true);
	};

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) router.push("/");
			}}
		>
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
							Enter your name so the other participant knows who&apos;s joining.
							Grant camera &amp; mic access so you&apos;re ready when the call
							starts.
						</DialogDescription>
					</DialogHeader>
					<CameraPreview />
					<form
						onSubmit={(e) => {
							e.preventDefault();
							joinMeeting();
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
								Join Meet
							</Button>
						</DialogFooter>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default NameGate;
