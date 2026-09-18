"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CodeEditor from "../CodeEditor";
import { useSocket } from "../Context";

const LANGUAGES = {
	"54": { label: "C++", monaco: "cpp", code: "cpp" },
	"50": { label: "C", monaco: "c", code: "c" },
	"62": { label: "Java", monaco: "java", code: "java" },
	"71": { label: "Python", monaco: "python", code: "py" },
} as const;

const Compiler = () => {
	const {
		editorTheme,
		setEditorTheme,
		editorFontSize,
		setEditorFontSize,
		cCode,
		javaCode,
		pyCode,
		cppCode,
		handleCCodeChange,
		handleCppCodeChange,
		handleJavaCodeChange,
		handlePyCodeChange,
	} = useSocket();

	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [languageId, setLanguageId] = useState("71");
	const [currentWindow, setCurrentWindow] = useState("output");
	const [isRunning, setIsRunning] = useState(false);
	const [hydrated, setHydrated] = useState(false);

	/* eslint-disable react-hooks/set-state-in-effect -- hydrate persisted editor state on the client only */
	useEffect(() => {
		setInput(localStorage.getItem("input") || "");
		setOutput(localStorage.getItem("output") || "");
		setLanguageId(localStorage.getItem("language_id") || "71");
		setCurrentWindow(localStorage.getItem("current-io-window") || "output");
		setHydrated(true);
	}, []);
	/* eslint-enable react-hooks/set-state-in-effect */

	useEffect(() => {
		if (!hydrated) return;
		localStorage.setItem("output", output);
		localStorage.setItem("language_id", languageId);
		localStorage.setItem("input", input);
		localStorage.setItem("current-io-window", currentWindow);
	}, [hydrated, languageId, input, output, currentWindow]);

	const getSourceCode = () => {
		const key = LANGUAGES[languageId as keyof typeof LANGUAGES]?.code;
		if (key === "c") return cCode;
		if (key === "cpp") return cppCode;
		if (key === "java") return javaCode;
		return pyCode;
	};

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setCurrentWindow("output");
		setOutput("Loading...");
		setIsRunning(true);
		try {
			const response = await fetch("/api/compile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					languageId,
					sourceCode: getSourceCode(),
					stdin: input,
				}),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error);
			}
			setOutput(data.stdout);
		} catch (error) {
			console.error(error);
			setOutput("Something went wrong");
		} finally {
			setIsRunning(false);
		}
	};

	const language = LANGUAGES[languageId as keyof typeof LANGUAGES];
	const codeEditor = {
		value:
			language.code === "c"
				? cCode
				: language.code === "cpp"
				? cppCode
				: language.code === "java"
				? javaCode
				: pyCode,
		onChange:
			language.code === "c"
				? handleCCodeChange
				: language.code === "cpp"
				? handleCppCodeChange
				: language.code === "java"
				? handleJavaCodeChange
				: handlePyCodeChange,
	};

	return (
		<>
			<div className="flex flex-col p-2 pt-0 pb-0 h-4/6">
				<span className="flex items-center justify-between rounded-t-md bg-white dark:bg-neutral-900 p-2 pl-3 text-md dark:text-neutral-400">
					<span className="font-bold">Code</span>
					<div>
						<input
							value={editorFontSize}
							onChange={(e) => setEditorFontSize(e.target.value)}
							title="Font Size"
							className="dark:bg-neutral-800 rounded-md bg-white font-thin mr-2 text-xs p-2 focus:outline-none w-20 appearance-none"
							type="number"
							max={52}
							min={1}
						/>
						<select
							value={editorTheme}
							onChange={(e) => setEditorTheme(e.target.value)}
							title="Theme"
							className="dark:bg-neutral-800 rounded-md bg-white font-thin mr-2 text-xs p-2 appearance-none"
						>
							<option value="light">Light</option>
							<option value="vs-dark">Dark</option>
						</select>
						<select
							value={languageId}
							onChange={(e) => setLanguageId(e.target.value)}
							title="Language"
							className="dark:bg-neutral-800 rounded-md bg-white font-thin text-xs p-2 appearance-none"
						>
							{Object.entries(LANGUAGES).map(([id, { label }]) => (
								<option key={id} value={id}>
									{label}
								</option>
							))}
						</select>
						<button
							type="submit"
							className="bg-green-400 rounded-md h-7 w-7 p-2 ml-2"
							onClick={handleSubmit}
							title="Run"
							disabled={isRunning}
						>
							<Image
								width={12}
								height={12}
								src="/run.svg"
								alt="Run"
							/>
						</button>
					</div>
				</span>
				<CodeEditor
					key={languageId}
					value={codeEditor.value}
					onChange={codeEditor.onChange}
					language={language.monaco}
				/>
			</div>
			<div className="flex flex-col p-2 h-2/6 pb-0">
				<span className="flex rounded-t-md bg-white dark:bg-neutral-900 p-2 text-md dark:text-neutral-400">
					<div className="rounded-md bg-neutral-100 dark:bg-black p-1 font-thin">
						<button
							className={`p-1 px-3 rounded-md ${
								currentWindow === "output"
									? "dark:bg-neutral-900 bg-white"
									: "dark:bg-black bg-neutral-100"
							}`}
							onClick={() => setCurrentWindow("output")}
						>
							Output
						</button>
						<button
							className={`p-1 px-3 rounded-md ${
								currentWindow === "input"
									? "dark:bg-neutral-900 bg-white"
									: "dark:bg-black bg-neutral-100"
							}`}
							onClick={() => setCurrentWindow("input")}
						>
							Input
						</button>
					</div>
				</span>
				<CodeEditor
					key={currentWindow}
					value={currentWindow === "output" ? output : input}
					onChange={(newValue) =>
						currentWindow === "output"
							? setOutput(newValue ?? "")
							: setInput(newValue ?? "")
					}
					language="plaintext"
				/>
			</div>
		</>
	);
};

export default Compiler;