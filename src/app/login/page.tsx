import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { FolioMark } from "@/components/brand";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/documents");

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 md:px-10">
      <header className="animate-rise flex items-center justify-between">
        <FolioMark />
        <p className="hidden text-sm text-[var(--muted)] sm:block">
          Internal productivity pilot
        </p>
      </header>

      <section className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="animate-rise max-w-xl" style={{ animationDelay: "80ms" }}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Shared writing
          </p>
          <h1
            className="font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-[-0.04em] text-[var(--ink)] md:text-6xl"
            style={{ fontWeight: 800 }}
          >
            Folio
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--ink-soft)]">
            A lightweight place to draft, import, and share documents with your
            team — without the ceremony of a full suite.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-[var(--muted)]">
            <li>Rich text that stays readable after refresh</li>
            <li>Import .txt / .md into an editable draft</li>
            <li>Share by email with a clear owned vs shared split</li>
          </ul>
        </div>

        <div className="animate-ink" style={{ animationDelay: "140ms" }}>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
