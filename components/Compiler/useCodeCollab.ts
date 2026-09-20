"use client";

import { useEffect } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

export const LANGUAGE_CODES = ["c", "cpp", "java", "py"] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export const DOC_TEXT_KEY = "doc" as const;

const STORAGE_KEYS: Record<LanguageCode, string> = {
	c: "c-code",
	cpp: "cpp-code",
	java: "java-code",
	py: "py-code",
};

type CollabElement = { key: string; storageKey: string };

const COLLAB_ELEMENTS: CollabElement[] = [
	...LANGUAGE_CODES.map((code) => ({
		key: code,
		storageKey: STORAGE_KEYS[code],
	})),
	{ key: DOC_TEXT_KEY, storageKey: "doc-text" },
];

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

		const writeBack: Array<() => void> = COLLAB_ELEMENTS.map(({ key, storageKey }) => {
			const text = doc.getText(key);
			const onUpdate = () => {
				localStorage.setItem(storageKey, text.toString());
			};
			text.observe(onUpdate);
			return () => text.unobserve(onUpdate);
		});

		let seeded = false;
		const seedFromStorage = () => {
			if (seeded) return;
			seeded = true;
			for (const { key, storageKey } of COLLAB_ELEMENTS) {
				const text = doc.getText(key);
				if (text.length > 0) continue;
				const stored = localStorage.getItem(storageKey);
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