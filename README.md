# Folio

A lightweight collaborative document editor — create drafts, edit rich text in the browser, import `.txt` / `.md`, and share with teammates.

Built as a focused product slice (not a Google Docs clone): depth in editing, persistence, import, and sharing.

## Demo accounts

| Email | Password | Role in the demo |
| --- | --- | --- |
| `maya@folio.dev` | `folio123` | Owns the kickoff notes; can share |
| `jordan@folio.dev` | `folio123` | Receives Maya’s shared document |
| `sam@folio.dev` | `folio123` | Empty desk for a clean walkthrough |

## Local setup

Requirements: Node.js 20+.

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

- `npm run test` — unit tests (import/parser)
- `npm run db:setup` — create SQLite schema + seed users/docs
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
- Prisma + SQLite for persistence
- Cookie session (JWT via `jose`) + seeded bcrypt passwords

## Docs in this repo

- `ARCHITECTURE.md` — priorities and tradeoffs
- `AI_WORKFLOW.md` — how AI was used on this assignment
- `SUBMISSION.md` — deliverable checklist
- `WALKTHROUGH.txt` — walkthrough video URL (fill after recording)

## Deploy notes

This app is a standard Node server (`next start`) with a SQLite file. Prefer a host that keeps a persistent disk (Railway, Render, Fly) and set:

```env
DATABASE_URL="file:/data/folio.db"
AUTH_SECRET="<long random string>"
```

A `Dockerfile` is included for that path. Serverless-only hosts without a database will lose writes between cold starts — use Postgres/Turso if you move there.
