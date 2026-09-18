"use client";

import { useEffect } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

export const LANGUAGE_CODES = ["c", "cpp", "java", "py"] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

const STORAGE_KEYS: Record<LanguageCode, string> = {
	c: "c-code",
	cpp: "cpp-code",
	java: "java-code",
	py: "py-code",
};

const getCollabUrl = () => {
	if (typeof window === "undefined") return "ws://localhost:3000/collab";
	const { protocol, host } = window.location;
	return `${protocol === "https:" ? "wss:" : "ws:"}//${host}/collab`;
};

export type CodeCollab = {
	doc: Y.Doc;
	provider: HocuspocusProvider;
};

const collabCache = new Map<string, CodeCollab>();

const createCollab = (roomId: string): CodeCollab => {
	const doc = new Y.Doc();
	const provider = new HocuspocusProvider({
		url: getCollabUrl(),
		name: roomId,
		document: doc,
	});
	return { doc, provider };
};

const getCollab = (roomId: string): CodeCollab => {
	const existing = collabCache.get(roomId);
	if (existing) return existing;
	const collab = createCollab(roomId);
	collabCache.set(roomId, collab);
	return collab;
};

export const useCodeCollab = (roomId?: string): CodeCollab | null => {
	const collab = roomId && typeof window !== "undefined" ? getCollab(roomId) : null;

	useEffect(() => {
		if (!collab) return;
		const { doc, provider } = collab;

		const writeBack: Array<() => void> = LANGUAGE_CODES.map((code) => {
			const text = doc.getText(code);
			const onUpdate = () => {
				localStorage.setItem(STORAGE_KEYS[code], text.toString());
			};
			text.observe(onUpdate);
			return () => text.unobserve(onUpdate);
		});

		let seeded = false;
		const seedFromStorage = () => {
			if (seeded) return;
			seeded = true;
			for (const code of LANGUAGE_CODES) {
				const text = doc.getText(code);
				if (text.length > 0) continue;
				const stored = localStorage.getItem(STORAGE_KEYS[code]);
				if (stored) {
					text.insert(0, stored);
				}
			}
		};
		provider.on("synced", seedFromStorage);

		return () => {
			writeBack.forEach((unobserve) => unobserve());
			provider.off("synced", seedFromStorage);
		};
	}, [collab]);

	return collab;
};