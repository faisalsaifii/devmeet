"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

const CopyLink = () => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Button
			onClick={handleCopy}
			className={
				copied
					? "m-1 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-normal text-white hover:bg-emerald-600"
					: "m-1 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-normal text-white hover:bg-white/25"
			}
		>
			{copied ? (
				<Check className="size-4" />
			) : (
				<Copy className="size-4" />
			)}
			{copied ? "Copied!" : "Copy link"}
		</Button>
	);
};

export default CopyLink;