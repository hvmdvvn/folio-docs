# Folio

A lightweight collaborative document editor — create drafts, edit rich text in the browser, import `.txt` / `.md`, and share with teammates.

Built as a focused product slice (not a Google Docs clone): depth in editing, persistence, import, and sharing.

**Live demo:** [https://folio-docs-seven.vercel.app](https://folio-docs-seven.vercel.app)

## Demo accounts

| Email | Password | Role in the demo |
| --- | --- | --- |
| `maya@folio.dev` | `folio123` | Owns the kickoff notes; can share |
| `jordan@folio.dev` | `folio123` | Receives Maya’s shared document |
| `sam@folio.dev` | `folio123` | Empty desk for a clean walkthrough |

## Local setup

Requirements: Node.js 20+ and a Postgres database.

Free DB options that work well: [Neon](https://neon.tech), Supabase, or `npx create-db` (temporary Prisma Postgres you can claim).

```bash
npm install
cp .env.example .env
# set DATABASE_URL and AUTH_SECRET in .env
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

- `npm run test` — unit tests (import/parser)
- `npm run db:setup` — push schema + seed users/docs
- `npm run build` / `npm start` — production build

## What works

- Create / rename / edit documents with bold, italic, underline, headings, lists
- Autosave (~700ms debounce) with visible save state
- Reopen after refresh (SQLite via Prisma)
- Import `.txt` or `.md` as a new editable document (max 512 KB)
- Share by email with seeded users; owned vs shared lists are separate
- Owner can revoke access

## Supported file import types

**Accepted:** `.txt`, `.md`, `.markdown`  
**Not in scope:** `.docx`, PDF, images

A sample file lives at `fixtures/product-brief.md`.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- TipTap for rich text
- Prisma + Postgres for persistence
- Cookie session (JWT via `jose`) + seeded bcrypt passwords

## Docs in this repo

- `ARCHITECTURE.md` — priorities and tradeoffs
- `AI_WORKFLOW.md` — how AI was used on this assignment
- `SUBMISSION.md` — deliverable checklist
- `WALKTHROUGH.txt` — walkthrough video URL (fill after recording)

## Deploy notes

Works on Vercel, Railway, Render, or Fly. Set:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="<long random string>"
```

On first boot (or via CI), run `npm run db:setup` so schema + demo users exist. A `Dockerfile` is included for container hosts.
