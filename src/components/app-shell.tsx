"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolioMark } from "./brand";
import type { SessionUser } from "@/lib/types";

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 md:px-8">
      <header className="animate-rise mb-8 flex items-center justify-between gap-4">
        <Link href="/documents" className="transition hover:opacity-80">
          <FolioMark />
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <div className="hidden text-right sm:block">
            <p className="font-semibold text-[var(--ink)]">{user.name}</p>
            <p className="text-[var(--muted)]">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-[var(--ink-soft)] transition hover:border-[var(--ink)]"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
