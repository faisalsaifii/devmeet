"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CodeEditor from "../CodeEditor";
import { useSocket } from "../Context";

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

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setCurrentWindow("output");
		setOutput("Loading...");
		const options = {
			method: "POST",
			url: "https://judge0-ce.p.rapidapi.com/submissions",
			params: {
				base64_encoded: "true",
				wait: "true",
				fields: "*",
			},
			headers: {
				"content-type": "application/json",
				"Content-Type": "application/json",
				"X-RapidAPI-Key": process.env.NEXT_PUBLIC_API_KEY ?? "",
				"X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
			},
			data: {
				language_id: languageId,
				source_code: btoa(
					languageId === "50"
						? cCode
						: languageId === "54"
						? cppCode
						: languageId === "62"
						? javaCode
						: pyCode
				),
				stdin: btoa(input),
			},
		};
		try {
			const response = await axios.request(options);
			setOutput(atob(response.data["stdout"]));
		} catch (error) {
			console.log(error);
			setOutput("Something went wrong");
		}
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
							<option value="54">C++</option>
							<option value="50">C</option>
							<option value="62">Java</option>
							<option value="71">Python</option>
						</select>
						<button
							type="submit"
							className="bg-green-400 rounded-md h-7 w-7 p-2 ml-2"
							onClick={handleSubmit}
							title="Run"
						>
							<img src="/run.svg" alt="Run" />
						</button>
					</div>
				</span>
				{languageId === "50" ? (
					<CodeEditor
						value={cCode}
						onChange={handleCCodeChange}
						language={"c"}
					/>
				) : languageId === "54" ? (
					<CodeEditor
						value={cppCode}
						onChange={handleCppCodeChange}
						language={"cpp"}
					/>
				) : languageId === "62" ? (
					<CodeEditor
						value={javaCode}
						onChange={handleJavaCodeChange}
						language={"java"}
					/>
				) : languageId === "71" ? (
					<CodeEditor
						value={pyCode}
						onChange={handlePyCodeChange}
						language={"python"}
					/>
				) : (
					<></>
				)}
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
				{currentWindow === "output" ? (
					<CodeEditor
						value={output}
						handleChange={(newValue) => setOutput(newValue ?? "")}
						language={"none"}
					/>
				) : (
					<CodeEditor
						value={input}
						handleChange={(newValue) => setInput(newValue ?? "")}
						language={"none"}
					/>
				)}
			</div>
		</>
	);
};

export default Compiler;
