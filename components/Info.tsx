"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const steps = [
	{
		title: "Start a meeting",
		body: "Click “Start a Meeting Now” and enter your name.",
	},
	{
		title: "Share the invite link",
		body: "Copy the link and share it so the other person joins the same room.",
	},
	{
		title: "Accept the invitation",
		body: "You will get an invitation to join the call — just accept it.",
	},
	{
		title: "Start coding",
		body: "Interview and code together in one shared editor. Voila!",
	},
];

const Info = ({ setShowInfo }: { setShowInfo: (show: boolean) => void }) => {
	return (
		<Dialog
			defaultOpen
			onOpenChange={(open) => setShowInfo(open)}
		>
			<DialogContent className="overflow-hidden rounded-2xl border-foreground/10 bg-card p-0 text-foreground sm:max-w-3xl">
				<div
					aria-hidden
					className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-violet/20 blur-3xl"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute -bottom-28 -left-20 size-56 rounded-full bg-violet/10 blur-3xl"
				/>

				<div className="no-scrollbar relative grid max-h-[calc(100dvh-2rem)] gap-8 overflow-y-auto p-6 sm:p-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-x-12">
					<DialogHeader className="gap-4">
						<span className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-lavender">
							<span className="bg-live size-1.5 rounded-full" />
							Coding Interview Platform
						</span>

						<DialogTitle className="text-4xl font-black tracking-tight sm:text-5xl">
							Dev
							<span
								className="bg-clip-text text-transparent"
								style={{ backgroundImage: "var(--gradient-violet)" }}
							>
								Meet
							</span>
						</DialogTitle>

						<DialogDescription className="max-w-md text-base leading-relaxed text-muted-foreground">
							Video call, a live shared editor and a compiler — one room for
							your entire technical interview.
						</DialogDescription>
					</DialogHeader>

					<div>
						<p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
							How to use
						</p>
						<ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-px before:bg-gradient-to-b before:from-violet/50 before:via-foreground/10 before:to-transparent before:content-['']">
							{steps.map((step, i) => (
								<li key={step.title} className="relative flex gap-4">
									<span
										className="z-10 grid size-9 shrink-0 place-items-center rounded-xl font-mono text-xs font-semibold text-white shadow-[0_4px_14px_-6px_oklch(0.63_0.216_300.5/70%)]"
										style={{ backgroundImage: "var(--gradient-violet)" }}
									>
										{i + 1}
									</span>
									<div className="pt-0.5">
										<h3 className="text-[0.95rem] font-semibold tracking-tight">
											{step.title}
										</h3>
										<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
											{step.body}
										</p>
									</div>
								</li>
							))}
						</ol>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default Info;