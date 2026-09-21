"use client";

import "@/lib/monaco";
import { useCallback, useEffect, useRef } from "react";
import { Editor, type OnMount } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import type { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";
import { cn } from "cn";
import { useSocket } from "./Context";

type CodeEditorProps = {
	value?: string;
	onChange?: (value?: string) => void;
	language?: string;
	ytext?: Y.Text;
	awareness?: Awareness | null;
	className?: string;
};

const CodeEditor = ({
	value,
	onChange,
	language,
	ytext,
	awareness,
	className,
}: CodeEditorProps) => {
	const { editorFontSize } = useSocket();
	const bindingRef = useRef<MonacoBinding | null>(null);
	const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

	const ensureBinding = useCallback(() => {
		const editor = editorRef.current;
		if (!editor || !ytext || bindingRef.current) return;
		const model = editor.getModel();
		if (!model) return;
		bindingRef.current = new MonacoBinding(
			ytext,
			model,
			new Set([editor]),
			awareness ?? null
		);
	}, [awareness, ytext]);

	useEffect(() => {
		ensureBinding();
		return () => {
			awareness?.setLocalStateField("selection", null);
			bindingRef.current?.destroy();
			bindingRef.current = null;
		};
	}, [awareness, ensureBinding]);

	const handleMount: OnMount = (editor) => {
		editorRef.current = editor;
		ensureBinding();
	};

	const shared = Boolean(ytext);

	return (
		<div className={cn("flex min-h-0 flex-1 p-1 bg-card rounded-b-md", className)}>
			<Editor
				language={language}
				theme="midnight-violet"
				value={shared ? undefined : value}
				options={{
					selectOnLineNumbers: true,
					colorDecorators: true,
					fontSize: Math.min(52, Math.max(2, Number(editorFontSize) || 14)),
					automaticLayout: true,
				}}
				onChange={shared ? undefined : onChange}
				onMount={handleMount}
				loading={
					<div className="w-full h-full flex items-center justify-center text-sm font-normal text-neutral-400">
						Loading editor...
					</div>
				}
			/>
		</div>
	);
};

export default CodeEditor;