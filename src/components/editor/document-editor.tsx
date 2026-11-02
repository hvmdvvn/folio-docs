"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./toolbar";
import { RelativeTime } from "@/components/relative-time";
import type { DocumentDetail } from "@/lib/types";

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export function DocumentEditor({ document }: { document: DocumentDetail }) {
  const [title, setTitle] = useState(document.title);
  const [sharedWith, setSharedWith] = useState(document.sharedWith);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [updatedAt, setUpdatedAt] = useState(document.updatedAt);
  const [shareEmail, setShareEmail] = useState("");
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [pendingShare, startShare] = useTransition();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef({ title: document.title, content: document.content });

  const persist = useCallback(async (payload: { title?: string; content?: string }) => {
    setSaveState("saving");
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setSaveState("error");
        return;
      }
      setUpdatedAt(data.updatedAt);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, [document.id]);

  const scheduleSave = useCallback(() => {
    setSaveState("dirty");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist({
        title: latest.current.title,
        content: latest.current.content,
      });
    }, 700);
  }, [persist]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Start writing…",
      }),
    ],
    content: document.content || "<p></p>",
    editorProps: {
      attributes: {
        class: "px-5 py-8 md:px-10 md:py-10",
      },
    },
    onUpdate: ({ editor: current }) => {
      latest.current.content = current.getHTML();
      scheduleSave();
    },
  });

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function onTitleChange(value: string) {
    setTitle(value);
    latest.current.title = value.trim() || "Untitled document";
    scheduleSave();
  }

  function shareDocument(event: React.FormEvent) {
    event.preventDefault();
    setShareError(null);
    startShare(async () => {
      const response = await fetch(`/api/documents/${document.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: shareEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        setShareError(data.error ?? "Could not share");
        return;
      }
      setSharedWith(data.document.sharedWith);
      setShareEmail("");
    });
  }

  async function revokeShare(email: string) {
    const response = await fetch(
      `/api/documents/${document.id}/share?email=${encodeURIComponent(email)}`,
      { method: "DELETE" },
    );
    const data = await response.json();
    if (response.ok) {
      setSharedWith(data.document.sharedWith);
    }
  }

  const statusLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "dirty"
        ? "Unsaved changes"
        : saveState === "error"
          ? "Save failed — retry by editing"
          : saveState === "saved"
            ? "Saved"
            : null;

  return (
    <div className="animate-rise mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link
          href="/documents"
          className="text-[var(--muted)] transition hover:text-[var(--ink)]"
        >
          ← All documents
        </Link>
        <div className="flex items-center gap-3">
          <span
            className={
              saveState === "error"
                ? "text-[var(--danger)]"
                : "text-[var(--muted)]"
            }
          >
            {statusLabel ?? <RelativeTime value={updatedAt} prefix="Updated " />}
          </span>
          {document.canShare ? (
            <button
              type="button"
              onClick={() => setShareOpen((v) => !v)}
              className="rounded-lg bg-[var(--ink)] px-3 py-2 font-semibold text-[var(--canvas)] transition hover:opacity-90"
            >
              Share
            </button>
          ) : (
            <span className="rounded-full bg-[var(--paper-deep)] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--warn)]">
              Shared with you
            </span>
          )}
        </div>
      </div>

      {shareOpen && document.canShare ? (
        <div className="mb-4 rounded-xl border border-[var(--line)] bg-[var(--canvas)] p-4 shadow-[var(--shadow)]">
          <h2
            className="font-[family-name:var(--font-display)] text-lg"
            style={{ fontWeight: 700 }}
          >
            Share this document
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Grant access by email. Demo users: jordan@folio.dev, sam@folio.dev
          </p>
          <form onSubmit={shareDocument} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="teammate@folio.dev"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="flex-1 rounded-lg border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              disabled={pendingShare}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pendingShare ? "Sharing…" : "Grant access"}
            </button>
          </form>
          {shareError ? (
            <p className="mt-2 text-sm text-[var(--danger)]">{shareError}</p>
          ) : null}
          <ul className="mt-4 space-y-2">
            {sharedWith.length === 0 ? (
              <li className="text-sm text-[var(--muted)]">Not shared with anyone yet.</li>
            ) : (
              sharedWith.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[var(--paper)] px-3 py-2 text-sm"
                >
                  <span>
                    <strong>{person.name}</strong>{" "}
                    <span className="text-[var(--muted)]">{person.email}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => revokeShare(person.email)}
                    className="text-[var(--danger)] hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--canvas)] shadow-[var(--shadow)]">
        <div className="border-b border-[var(--line)] px-5 pt-5 md:px-10 md:pt-8">
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full bg-transparent font-[family-name:var(--font-display)] text-3xl tracking-[-0.04em] outline-none md:text-4xl"
            style={{ fontWeight: 800 }}
            aria-label="Document title"
          />
          <p className="mt-2 pb-4 text-sm text-[var(--muted)]">
            Owned by {document.owner.name}
            {sharedWith.length
              ? ` · Shared with ${sharedWith.map((u) => u.name).join(", ")}`
              : ""}
          </p>
        </div>
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
