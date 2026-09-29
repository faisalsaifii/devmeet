"use client";

import { useCallback, useEffect, useRef } from "react";
import { Excalidraw, reconcileElements, THEME } from "@excalidraw/excalidraw";
import type { RemoteExcalidrawElement } from "@excalidraw/excalidraw/data/reconcile";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type {
  AppState,
  BinaryFileData,
  BinaryFiles,
  Collaborator,
  ExcalidrawImperativeAPI,
  SocketId,
} from "@excalidraw/excalidraw/types";
import * as Y from "yjs";
import { cn } from "cn";
import { getStoredName } from "@/lib/name";
import { WHITEBOARD_FIELD, type CodeCollab } from "./Compiler/useCodeCollab";
import "@excalidraw/excalidraw/index.css";

const STORAGE_KEY = "whiteboard-scene";
const LOCAL_ORIGIN = "devmeet-whiteboard";
const POINTER_FIELD = "whiteboard-pointer";
const POINTER_THROTTLE_MS = 32;

type PointerState = {
  x: number;
  y: number;
  tool: "pointer" | "laser";
  button: "up" | "down";
};

type AwarenessState = Record<string, unknown> & {
  user?: { name?: string | null } | null;
  [POINTER_FIELD]?: PointerState | null;
};

type StoredScene = {
  elements: OrderedExcalidrawElement[];
  files: BinaryFiles;
  appState: Partial<AppState>;
};

type SharedScene = {
  doc: Y.Doc;
  elements: Y.Map<string>;
  files: Y.Map<string>;
};

const readScene = (): StoredScene | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredScene;
    if (!Array.isArray(parsed.elements)) return null;
    return {
      elements: parsed.elements,
      files: parsed.files ?? {},
      appState: parsed.appState ?? {},
    };
  } catch {
    return null;
  }
};

const writeScene = (scene: StoredScene) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scene));
  } catch {}
};

const parseAll = <T,>(map: Y.Map<string>): T[] => {
  const values: T[] = [];
  map.forEach((value) => {
    try {
      values.push(JSON.parse(value) as T);
    } catch {}
  });
  return values;
};

const pickAppState = (appState: AppState): Partial<AppState> => ({
  scrollX: appState.scrollX,
  scrollY: appState.scrollY,
  zoom: appState.zoom,
  gridSize: appState.gridSize,
  viewBackgroundColor: appState.viewBackgroundColor,
});

const sceneSignature = (
  elements: readonly OrderedExcalidrawElement[],
  files: BinaryFiles,
) =>
  `${elements
    .map((el) => `${el.id}.${el.versionNonce}.${el.isDeleted ? 1 : 0}`)
    .join("|")}#${Object.keys(files).sort().join(",")}`;

const isSameScene = (
  a: readonly OrderedExcalidrawElement[],
  b: readonly OrderedExcalidrawElement[],
) =>
  a.length === b.length &&
  a.every((element, index) => {
    const other = b[index];
    return (
      element.id === other.id &&
      element.versionNonce === other.versionNonce &&
      element.isDeleted === other.isDeleted
    );
  });

type WhiteboardCanvasProps = {
  collab?: CodeCollab | null;
  className?: string;
};

const WhiteboardCanvas = ({ collab, className }: WhiteboardCanvasProps) => {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const sharedRef = useRef<SharedScene | null>(null);
  const syncedRef = useRef(false);
  const mergedRef = useRef(false);
  const signatureRef = useRef("");
  const pointerAtRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  const initialData = useCallback(() => {
    const stored = readScene();
    if (!stored) return null;
    return {
      elements: stored.elements,
      appState: stored.appState,
      files: stored.files,
    };
  }, []);

  const writeShared = useCallback(
    (
      elements: readonly OrderedExcalidrawElement[],
      files: BinaryFiles,
    ) => {
      const shared = sharedRef.current;
      if (!shared) return;
      shared.doc.transact(() => {
        for (const element of elements) {
          const json = JSON.stringify(element);
          if (shared.elements.get(element.id) !== json) {
            shared.elements.set(element.id, json);
          }
        }
        const dropped: string[] = [];
        shared.files.forEach((_, key) => {
          if (!files[key]) dropped.push(key);
        });
        for (const file of Object.values(files)) {
          const json = JSON.stringify(file);
          if (shared.files.get(file.id) !== json) {
            shared.files.set(file.id, json);
          }
        }
        dropped.forEach((key) => shared.files.delete(key));
      }, LOCAL_ORIGIN);
    },
    [],
  );

  const applyRemote = useCallback(() => {
    const api = apiRef.current;
    const shared = sharedRef.current;
    if (!api || !shared) return;
    const remote = parseAll<OrderedExcalidrawElement>(
      shared.elements,
    ) as RemoteExcalidrawElement[];
    if (!remote.length) return;
    const local = api.getSceneElements();
    const reconciled = reconcileElements(local, remote, api.getAppState());
    if (isSameScene(local, reconciled)) return;
    const files = parseAll<BinaryFileData>(shared.files);
    if (files.length) api.addFiles(files);
    api.updateScene({ elements: reconciled });
  }, []);

  const merge = useCallback(() => {
    if (mergedRef.current) return;
    const api = apiRef.current;
    if (!api) return;
    mergedRef.current = true;
    const shared = sharedRef.current;
    if (shared && shared.elements.size > 0) {
      applyRemote();
      return;
    }
    const elements = api.getSceneElements();
    if (!elements.length) return;
    if (shared) writeShared(elements, api.getFiles());
    writeScene({
      elements: [...elements],
      files: api.getFiles(),
      appState: pickAppState(api.getAppState()),
    });
  }, [applyRemote, writeShared]);

  const renderCollaborators = useCallback(() => {
    const api = apiRef.current;
    const awareness = collab?.provider.awareness;
    if (!api || !awareness) return;
    const collaborators = new Map<SocketId, Collaborator>();
    awareness.getStates().forEach((raw, clientId) => {
      if (clientId === awareness.clientID) return;
      const state = raw as AwarenessState;
      const pointer = state[POINTER_FIELD];
      const name = state.user?.name;
      if (!pointer && !name) return;
      collaborators.set(String(clientId) as SocketId, {
        id: String(clientId),
        username: name || "Guest",
        pointer: pointer
          ? { x: pointer.x, y: pointer.y, tool: pointer.tool }
          : undefined,
        button: pointer?.button,
      });
    });
    api.updateScene({ collaborators });
  }, [collab]);

  const handleApi = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      apiRef.current = api;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      // Excalidraw calls this while it is still mounting, so scene updates
      // have to wait until the next frame.
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        merge();
        renderCollaborators();
      });
    },
    [merge, renderCollaborators],
  );

  const handleChange = useCallback(
    (
      elements: readonly OrderedExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles,
    ) => {
      const next = sceneSignature(elements, files);
      if (next === signatureRef.current) return;
      signatureRef.current = next;
      if (!syncedRef.current) return;
      writeShared(elements, files);
      writeScene({
        elements: [...elements],
        files,
        appState: pickAppState(appState),
      });
    },
    [writeShared],
  );

  const handlePointerUpdate = useCallback(
    ({
      pointer,
      button,
    }: {
      pointer: { x: number; y: number; tool: "pointer" | "laser" };
      button: "up" | "down";
    }) => {
      const awareness = collab?.provider.awareness;
      if (!awareness) return;
      const now = Date.now();
      if (now - pointerAtRef.current < POINTER_THROTTLE_MS) return;
      pointerAtRef.current = now;
      awareness.setLocalStateField(POINTER_FIELD, {
        x: pointer.x,
        y: pointer.y,
        tool: pointer.tool,
        button,
      } satisfies PointerState);
    },
    [collab],
  );

  useEffect(() => {
    if (!collab) {
      syncedRef.current = true;
      merge();
      return;
    }

    const shared: SharedScene = {
      doc: collab.doc,
      elements: collab.doc.getMap(`${WHITEBOARD_FIELD}-elements`),
      files: collab.doc.getMap(`${WHITEBOARD_FIELD}-files`),
    };
    sharedRef.current = shared;

    const onRemote = (
      _event: Y.YMapEvent<string>,
      transaction: Y.Transaction,
    ) => {
      if (transaction.origin === LOCAL_ORIGIN) return;
      applyRemote();
    };
    shared.elements.observe(onRemote);
    shared.files.observe(onRemote);

    const onSynced = () => {
      syncedRef.current = true;
      merge();
    };
    collab.provider.on("synced", onSynced);
    if (collab.provider.synced) onSynced();

    return () => {
      shared.elements.unobserve(onRemote);
      shared.files.unobserve(onRemote);
      collab.provider.off("synced", onSynced);
      sharedRef.current = null;
    };
  }, [collab, applyRemote, merge]);

  useEffect(() => {
    const awareness = collab?.provider.awareness;
    if (!awareness) return;
    if (!awareness.getLocalState()?.user) {
      awareness.setLocalStateField("user", {
        name: getStoredName() || "Guest",
      });
    }
    awareness.on("change", renderCollaborators);
    renderCollaborators();
    return () => {
      awareness.off("change", renderCollaborators);
      awareness.setLocalStateField(POINTER_FIELD, null);
    };
  }, [collab, renderCollaborators]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      apiRef.current = null;
    };
  }, []);

  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col", className)}>
      <Excalidraw
        excalidrawAPI={handleApi}
        initialData={initialData}
        onChange={handleChange}
        onPointerUpdate={handlePointerUpdate}
        handleKeyboardGlobally={false}
        isCollaborating
        theme={THEME.DARK}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            saveToActiveFile: false,
            toggleTheme: null,
          },
        }}
      />
    </div>
  );
};

export default WhiteboardCanvas;
