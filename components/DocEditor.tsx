"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import { yCursorPlugin } from "@tiptap/y-tiptap";
import type { Awareness } from "y-protocols/awareness";
import {
  Bold,
  Code as CodeIcon,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { getStoredName } from "@/lib/name";
import { useSocket } from "./Context";
import { DOC_FIELD, type CodeCollab } from "./Compiler/useCodeCollab";

const DOC_STORAGE_KEY = "doc-text";

const CURSOR_COLORS = [
  "#a06bff",
  "#f472b6",
  "#34d399",
  "#f59e0b",
  "#60a5fa",
  "#f87171",
];

const CURSOR_USER = {
  name: getStoredName() || "Guest",
  color: CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)],
};

const CollaborationCursor = Extension.create<
  {
    provider?: { awareness?: Awareness | null } | null;
    user?: Record<string, unknown>;
    cursorStateField?: string;
  },
  { destroy: (() => void) | null }
>({
  name: "collaborationCursor",
  addOptions() {
    return {
      provider: null as { awareness?: Awareness | null } | null,
      user: {},
      cursorStateField: "cursor",
    };
  },
  addStorage() {
    return { destroy: null };
  },
  addProseMirrorPlugins() {
    const { provider, user, cursorStateField } = this.options;
    const awareness = provider?.awareness;
    if (!awareness) return [];
    const setUser = () => {
      const state = awareness.getLocalState();
      if (state && state.user === user) return;
      awareness.setLocalStateField("user", user);
    };
    setUser();
    const onUpdate = ({ added }: { added: string[] }) => {
      if (added.includes("user")) return;
      setUser();
    };
    awareness.on("update", onUpdate);
    this.storage.destroy = () => awareness.off("update", onUpdate);
    return [yCursorPlugin(awareness, {}, cursorStateField)];
  },
  onDestroy() {
    if (typeof this.storage.destroy === "function") this.storage.destroy();
  },
});

const readStorage = (key: string): string => {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
};

const rawToHtml = (raw: string): string => {
  if (raw.includes("<")) return raw;
  return raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => `<p>${line || "<br>"}</p>`)
    .join("");
};

type DocEditorProps = {
  collab?: CodeCollab | null;
  className?: string;
};

const ToolButton = ({
  onClick,
  active = false,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon-sm"
    title={title}
    disabled={disabled}
    className={cn("h-7 w-7", active && "bg-muted text-foreground")}
    onClick={onClick}
  >
    {children}
  </Button>
);

const Divider = () => <div className="mx-1 h-4 w-px bg-border" />;

const DocEditor = ({ collab, className }: DocEditorProps) => {
  const { editorFontSize } = useSocket();

  const extensions = useMemo(
    () => [
      StarterKit.configure({ undoRedo: false }),
      Collaboration.configure({
        document: collab?.doc ?? null,
        field: DOC_FIELD,
      }),
      CollaborationCursor.configure({
        provider: collab?.provider ?? null,
        user: CURSOR_USER,
      }),
    ],
    [collab],
  );

  const editor = useEditor(
    {
      extensions,
      autofocus: false,
      immediatelyRender: false,
    },
    [],
  );

  useEffect(() => {
    if (!editor || !collab) return;
    const { doc, provider } = collab;
    const fragment = doc.getXmlFragment(DOC_FIELD);

    const seedFromStorage = () => {
      if (fragment.length > 0) return;
      const stored = readStorage(DOC_STORAGE_KEY);
      if (!stored) return;
      editor.commands.setContent(rawToHtml(stored), { emitUpdate: false });
    };

    const persistToStorage = () => {
      writeStorage(DOC_STORAGE_KEY, editor.getHTML());
    };

    if (provider.synced) seedFromStorage();
    provider.on("synced", seedFromStorage);
    editor.on("update", persistToStorage);

    return () => {
      provider.off("synced", seedFromStorage);
      editor.off("update", persistToStorage);
    };
  }, [editor, collab]);

  useEffect(() => {
    return () => {
      const awareness = collab?.provider.awareness;
      awareness?.setLocalStateField("cursor", null);
      awareness?.setLocalStateField("user", null);
    };
  }, [collab]);

  const fontSize = Math.min(20, Math.max(12, Number(editorFontSize) || 14));

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1 rounded-b-md bg-card p-1 pl-4",
        className,
      )}
    >
      {editor && (
        <div className="flex flex-wrap items-center gap-0.5">
          <ToolButton
            title="Undo"
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 />
          </ToolButton>
          <ToolButton
            title="Redo"
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 />
          </ToolButton>
          <Divider />
          <ToolButton
            title="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 />
          </ToolButton>
          <ToolButton
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 />
          </ToolButton>
          <ToolButton
            title="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 />
          </ToolButton>
          <Divider />
          <ToolButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold />
          </ToolButton>
          <ToolButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </ToolButton>
          <ToolButton
            title="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough />
          </ToolButton>
          <ToolButton
            title="Code"
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <CodeIcon />
          </ToolButton>
          <Divider />
          <ToolButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List />
          </ToolButton>
          <ToolButton
            title="Ordered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered />
          </ToolButton>
          <ToolButton
            title="Code block"
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <CodeIcon className="size-4" />
          </ToolButton>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="doc-editor min-h-0 flex-1 overflow-y-auto px-3 pb-3"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
};

export default DocEditor;
