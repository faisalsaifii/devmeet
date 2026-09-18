"use client";

import { Editor } from "@monaco-editor/react";
import { useSocket } from "./Context";

type CodeEditorProps = {
	value?: string;
	onChange?: (value?: string) => void;
	handleChange?: (value?: string) => void;
	language?: string;
};

const CodeEditor = ({ value, onChange, language }: CodeEditorProps) => {
	const { editorTheme, editorFontSize } = useSocket();

	return (
		<div className="flex h-full p-1 bg-white dark:bg-neutral-900 rounded-b-md">
			<Editor
				language={language}
				theme={editorTheme}
				value={value}
				options={{
					selectOnLineNumbers: true,
					colorDecorators: true,
					fontSize: Number(editorFontSize),
				}}
				onChange={onChange}
			/>
		</div>
	);
};

export default CodeEditor;
