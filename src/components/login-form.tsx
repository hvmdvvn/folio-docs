"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const ACCOUNTS = [
  { email: "maya@folio.dev", label: "Maya — owns shared kickoff" },
  { email: "jordan@folio.dev", label: "Jordan — receives shares" },
  { email: "sam@folio.dev", label: "Sam — empty desk" },
];

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("maya@folio.dev");
  const [password, setPassword] = useState("folio123");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not sign in");
        return;
      }
      router.replace("/documents");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-6 shadow-[var(--shadow)] md:p-8"
    >
      <h2
        className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.03em]"
        style={{ fontWeight: 700 }}
      >
        Sign in
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Seeded demo accounts — password for all:{" "}
        <code className="rounded bg-[var(--paper-deep)] px-1.5 py-0.5 text-[var(--ink)]">
          folio123
        </code>
      </p>

      <label className="mt-6 block text-sm font-medium text-[var(--ink-soft)]">
        Email
        <input
          className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--accent)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-[var(--ink-soft)]">
        Password
        <input
          type="password"
          className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--accent)]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => {
              setEmail(account.email);
              setPassword("folio123");
            }}
            className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {account.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-[#f8e8e8] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Enter Folio"}
      </button>
    </form>
  );
}
