"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { Loader2, Play } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useDefaultLayout } from "react-resizable-panels";

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
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "compiler-code-io-split",
  });

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

  const getSourceCode = useCallback(() => {
    if (!collab) return "";
    const key = LANGUAGES[languageId as keyof typeof LANGUAGES]?.code;
    return collab.doc.getText(key).toString();
  }, [collab, languageId]);

  const handleSubmit = useCallback(async () => {
    setCurrentWindow("output");
    setOutput("Loading...");
    setIsRunning(true);
    try {
      const sourceCode = getSourceCode();
      if (!sourceCode.trim()) {
        throw new Error("Please write some code before running");
      }
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId,
          sourceCode,
          stdin: input,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Compilation failed");
      }
      const deco = (value?: string) => value?.trim() ?? "";
      const result = [
        deco(data.compileOutput),
        deco(data.stdout),
        deco(data.stderr),
      ]
        .filter(Boolean)
        .join("\n");
      setOutput(result || "(No output)");
    } catch (error) {
      console.error(error);
      setOutput(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Something went wrong",
      );
    } finally {
      setIsRunning(false);
    }
  }, [languageId, input, getSourceCode]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleSubmitRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const language = LANGUAGES[languageId as keyof typeof LANGUAGES];

  return (
    <ResizablePanelGroup
      orientation="vertical"
      id="compiler-code-io-split"
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      className="h-full w-full"
    >
      <ResizablePanel
        id="compiler-code"
        defaultSize="66"
        minSize="25"
        className="p-1"
      >
        <div className="flex h-full flex-col">
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
                  Object.entries(LANGUAGES).map(([id, { label }]) => [
                    id,
                    label,
                  ]),
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
                type="button"
                className="ml-2 h-7 w-7 bg-green-400 hover:bg-green-400/80"
                onClick={handleSubmit}
                title="Run (Ctrl+Enter)"
                disabled={isRunning}
                size="icon"
              >
                {isRunning ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
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
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="compiler-io" defaultSize="34" minSize="15">
        <div className="flex h-full flex-col p-1">
          <Tabs
            value={currentWindow}
            onValueChange={setCurrentWindow}
            className="flex min-h-0 flex-1 flex-col gap-0"
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
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Compiler;
