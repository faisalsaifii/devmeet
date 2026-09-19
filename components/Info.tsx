"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const Info = ({ setShowInfo }: { setShowInfo: (show: boolean) => void }) => {
	return (
		<Dialog
			defaultOpen
			onOpenChange={(open) => setShowInfo(open)}
		>
			<DialogContent className="max-w-2xl text-foreground">
				<DialogHeader>
					<DialogTitle className="text-7xl font-black">
						DevMeet
					</DialogTitle>
					<DialogDescription className="text-xl font-thin">
						Coding Interview Platform
					</DialogDescription>
				</DialogHeader>
				<h2 className="mt-4 text-3xl font-bold">How to use?</h2>
				<ol className="m-2 ml-4 list-decimal text-lg font-thin">
					<li>Click &apos;Start a Meeting Now&apos;</li>
					<li>Enter your name</li>
					<li>Copy the invite link with the copy button</li>
					<li>
						Share the link so the other person joins the same room
					</li>
					<li>You will get an invitation to join the call</li>
					<li>Join the call</li>
					<li>Start Coding</li>
					<li>Voila 🎉</li>
				</ol>
			</DialogContent>
		</Dialog>
	);
};

export default Info;