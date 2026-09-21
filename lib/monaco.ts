"use client";

import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

self.MonacoEnvironment = {
	getWorker: () =>
		new Worker(new URL("../workers/editor.worker.ts", import.meta.url), {
			type: "module",
		}),
};

loader.config({ monaco });

// "midnight-violet" — the app's violet/glass palette, tuned for the editor.
// Palette (workbench):
//   bg         #0a0812  ~ oklch(0.055 0.02 300)
//   sunken     #141024  ~ oklch(0.1 0.03 300)
//   raised     #1a1430  ~ oklch(0.135 0.03 300)
//   violet     #a06bff  ~ oklch(0.68 0.214 305)
//   lavender   #cdb8ff  ~ oklch(0.83 0.088 300)
//   live green #55e0a0  ~ oklch(0.78 0.17 155)
monaco.editor.defineTheme("midnight-violet", {
	base: "vs-dark",
	inherit: true,
	rules: [
		{ token: "", foreground: "b9aedc", background: "0a0812" },
		{ token: "comment", foreground: "5f5b84", fontStyle: "italic" },
		{ token: "keyword", foreground: "bd8cff" },
		{ token: "storage", foreground: "a78ff7" },
		{ token: "operator", foreground: "8f86c9" },
		{ token: "number", foreground: "f5a5d8" },
		{ token: "regexp", foreground: "55e0a0" },
		{ token: "string", foreground: "55e0a0" },
		{ token: "string.escape", foreground: "ffd48c" },
		{ token: "constant", foreground: "c9a0ff" },
		{ token: "type", foreground: "9d8cff" },
		{ token: "type.identifier", foreground: "8fb9ff" },
		{ token: "function", foreground: "7fd0ff" },
		{ token: "variable", foreground: "d8cef5" },
		{ token: "variable.parameter", foreground: "e5b8ff" },
		{ token: "tag", foreground: "bd8cff" },
		{ token: "attribute.name", foreground: "a78ff7" },
		{ token: "attribute.value", foreground: "55e0a0" },
		{ token: "delimiter", foreground: "6f6a94" },
		{ token: "delimiter.bracket", foreground: "9d8cff" },
		{ token: "meta.brace", foreground: "9d8cff" },
		{ token: "invalid", foreground: "ff6b8b" },
		{ token: "decorator", foreground: "ffd48c" },
		{ token: "markup.bold", fontStyle: "bold" },
		{ token: "markup.italic", fontStyle: "italic" },
		{ token: "markup.heading", foreground: "bd8cff", fontStyle: "bold" },
		{ token: "markup.link", foreground: "7fd0ff" },
		{ token: "markup.underline.link", foreground: "7fd0ff", fontStyle: "underline" },
		{ token: "markup.quote", foreground: "5f5b84", fontStyle: "italic" },
		{ token: "markup.inline.raw", foreground: "55e0a0" },
	],
	colors: {
		"editor.background": "#0a0812",
		"editor.foreground": "#b9aedc",
		"editor.lineHighlightBackground": "#141024a8",
		"editor.selectionBackground": "#6b35e64d",
		"editor.inactiveSelectionBackground": "#4c1d9533",
		"editor.selectionHighlightBackground": "#4c1d9566",
		"editorCursor.foreground": "#a06bff",
		"editorCursor.background": "#0a0812",
		"editorLineNumber.foreground": "#383252",
		"editorLineNumber.activeForeground": "#a78ff7",
		"editorIndentGuide.background": "#1d1836",
		"editorIndentGuide.activeBackground": "#3a315f",
		"editorWhitespace.foreground": "#1d1836a6",
		"editorRuler.foreground": "#1d1836",
		"editorBracketMatch.background": "#a06bff2e",
		"editorBracketMatch.border": "#a06bffb0",
		"editorGutter.background": "#0a0812",
		"editorWidget.background": "#141024",
		"editorWidget.border": "#2a2246",
		"editorSuggestWidget.background": "#141024",
		"editorSuggestWidget.border": "#2a2246",
		"editorSuggestWidget.selectedBackground": "#241c3e",
		"editorSuggestWidget.highlightForeground": "#cdb8ff",
		"editorHoverWidget.background": "#141024",
		"editorHoverWidget.border": "#2a2246",
		"editorLink.activeForeground": "#7fd0ff",
		"editorFindMatchBackground": "#a06bff40",
		"editorFindMatchHighlightBackground": "#4c1d9566",
		"editor.wordHighlightBackground": "#2a2246",
		"editor.wordHighlightStrongBackground": "#3a315f",
		"scrollbarSlider.background": "#a06bff30",
		"scrollbarSlider.hoverBackground": "#a06bff55",
		"scrollbarSlider.activeBackground": "#a06bff7a",
		"minimap.background": "#0a0812",
		"minimap.selectionHighlight": "#6b35e64d",
		"diffEditor.insertedTextBackground": "#55e0a01a",
		"diffEditor.removedTextBackground": "#ff6b8b1a",
	},
});