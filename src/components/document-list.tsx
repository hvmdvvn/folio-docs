"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { DocumentSummary } from "@/lib/types";
import { RelativeTime } from "./relative-time";

export function DocumentList({
  owned,
  shared,
}: {
  owned: DocumentSummary[];
  shared: DocumentSummary[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [importing, setImporting] = useState(false);

  function createDocument() {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled document" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not create document");
        return;
      }
      router.push(`/documents/${data.id}`);
      router.refresh();
    });
  }

  async function onImport(file: File | undefined) {
    if (!file) return;
    setError(null);
    setImporting(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/documents/import", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Import failed");
        return;
      }
      router.push(`/documents/${data.id}`);
      router.refresh();
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="animate-rise space-y-10">
      <section className="flex flex-col gap-5 border-b border-[var(--line)] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Your desk
          </p>
          <h1
            className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-[-0.04em] md:text-5xl"
            style={{ fontWeight: 800 }}
          >
            Documents
          </h1>
          <p className="mt-3 max-w-xl text-[var(--ink-soft)]">
            Create a blank draft, or import a <strong>.txt</strong> /{" "}
            <strong>.md</strong> file into a new editable document.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={createDocument}
            disabled={pending}
            className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {pending ? "Creating…" : "New document"}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--ink)] disabled:opacity-60"
          >
            {importing ? "Importing…" : "Import file"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.markdown,text/plain,text/markdown"
            className="hidden"
            onChange={(e) => onImport(e.target.files?.[0])}
          />
        </div>
      </section>

      {error ? (
        <p className="rounded-lg bg-[#f8e8e8] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}

      <DocSection
        title="Owned by you"
        empty="No documents yet. Create one or import a Markdown file."
        docs={owned}
        badge="Owner"
      />

      <DocSection
        title="Shared with you"
        empty="Nothing shared yet. Sign in as Jordan after Maya shares a doc."
        docs={shared}
        badge="Shared"
      />
    </div>
  );
}

function DocSection({
  title,
  empty,
  docs,
  badge,
}: {
  title: string;
  empty: string;
  docs: DocumentSummary[];
  badge: string;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2
          className="font-[family-name:var(--font-display)] text-xl tracking-[-0.02em]"
          style={{ fontWeight: 700 }}
        >
          {title}
        </h2>
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          {docs.length}
        </span>
      </div>

      {docs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--canvas)]/70 px-4 py-8 text-sm text-[var(--muted)]">
          {empty}
        </p>
      ) : (
        <ul className="divide-y divide-[var(--line)] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--canvas)] shadow-[var(--shadow)]">
          {docs.map((doc) => (
            <li key={doc.id}>
              <Link
                href={`/documents/${doc.id}`}
                className="flex items-start justify-between gap-4 px-4 py-4 transition hover:bg-[var(--paper)]/70 md:px-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold text-[var(--ink)]">
                      {doc.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                        badge === "Owner"
                          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "bg-[var(--paper-deep)] text-[var(--warn)]"
                      }`}
                    >
                      {badge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {badge === "Shared"
                      ? `From ${doc.owner.name}`
                      : doc.sharedWith.length
                        ? `Shared with ${doc.sharedWith.map((u) => u.name).join(", ")}`
                        : "Only you"}
                    {" · "}
                    <RelativeTime value={doc.updatedAt} prefix="Updated " />
                  </p>
                </div>
                <span className="mt-1 text-[var(--muted)]" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
