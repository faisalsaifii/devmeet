"use client";

import { useState, useEffect } from "react";
import CodeEditor from "../CodeEditor";
import { useSocket } from "../Context";
import { useCodeCollab } from "./useCodeCollab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "lucide-react";

const LANGUAGES = {
	"54": { label: "C++", monaco: "cpp", code: "cpp" },
	"50": { label: "C", monaco: "c", code: "c" },
	"62": { label: "Java", monaco: "java", code: "java" },
	"71": { label: "Python", monaco: "python", code: "py" },
} as const;

const Compiler = () => {
	const {
		roomId,
		editorTheme,
		setEditorTheme,
		editorFontSize,
		setEditorFontSize,
	} = useSocket();

	const collab = useCodeCollab(roomId);

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
		if (!collab) return "";
		const key = LANGUAGES[languageId as keyof typeof LANGUAGES]?.code;
		return collab.doc.getText(key).toString();
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

	return (
		<>
			<div className="flex flex-col p-2 pt-0 pb-0 h-4/6">
				<span className="flex items-center justify-between rounded-t-md bg-card p-2 pl-3 text-md">
					<span className="font-bold">Code</span>
					<div className="flex items-center">
						<Input
							value={editorFontSize}
							onChange={(e) => setEditorFontSize(e.target.value)}
							title="Font Size"
							className="mr-2 h-8 w-20 appearance-none bg-card text-xs font-thin"
							type="number"
							max={52}
							min={1}
						/>
						<Select
							value={editorTheme}
							onValueChange={(value) => setEditorTheme(value ?? "light")}
							items={{ light: "Light", "vs-dark": "Dark" }}
						>
							<SelectTrigger
								title="Theme"
								className="mr-2 h-8 bg-card text-xs font-thin"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="light">Light</SelectItem>
								<SelectItem value="vs-dark">Dark</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={languageId}
							onValueChange={(value) => setLanguageId(value ?? "71")}
							items={Object.fromEntries(
								Object.entries(LANGUAGES).map(([id, { label }]) => [id, label])
							)}
						>
							<SelectTrigger
								title="Language"
								className="h-8 bg-card text-xs font-thin"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(LANGUAGES).map(([id, { label }]) => (
									<SelectItem key={id} value={id}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							type="submit"
							className="ml-2 h-7 w-7 bg-green-400 hover:bg-green-400/80"
							onClick={handleSubmit}
							title="Run"
							disabled={isRunning}
							size="icon"
						>
							<Play className="size-4" />
						</Button>
					</div>
				</span>
				<CodeEditor
					key={languageId}
					ytext={collab ? collab.doc.getText(language.code) : undefined}
					awareness={collab?.provider.awareness}
					language={language.monaco}
				/>
			</div>
			<div className="flex flex-col p-2 h-2/6 pb-0">
				<Tabs
					value={currentWindow}
					onValueChange={setCurrentWindow}
					className="flex flex-1 flex-col gap-0"
				>
					<span className="flex rounded-t-md bg-card py-2 pl-3 text-md">
						<TabsList className="rounded-md bg-muted p-1 font-thin">
							<TabsTrigger
								value="output"
								className="data-active:bg-background"
							>
								Output
							</TabsTrigger>
							<TabsTrigger
								value="input"
								className="data-active:bg-background"
							>
								Input
							</TabsTrigger>
						</TabsList>
					</span>
					{currentWindow === "output" ? (
						<CodeEditor
							key="output"
							value={output}
							onChange={(newValue) => setOutput(newValue ?? "")}
							language="plaintext"
						/>
					) : (
						<CodeEditor
							key="input"
							value={input}
							onChange={(newValue) => setInput(newValue ?? "")}
							language="plaintext"
						/>
					)}
				</Tabs>
			</div>
		</>
	);
};

export default Compiler;