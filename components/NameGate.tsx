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
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>What&apos;s your name?</DialogTitle>
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
							className="w-full bg-violet-500 text-white shadow-lg shadow-violet-950/40 hover:bg-violet-600 sm:w-auto"
						>
							Join Meet
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default NameGate;
