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