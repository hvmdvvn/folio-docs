# Folio — architecture note

## Product cut

The assignment asks for a Google Docs–inspired editor under a hard timebox. I optimized for a **coherent vertical slice**:

1. Document create → edit → autosave → reopen  
2. Import that becomes a real editable document  
3. Sharing that reviewers can verify with two seeded accounts  

I intentionally deferred realtime collaboration, comments, version history, DOCX parsing, and fine-grained roles (viewer vs editor). Those are valuable, but each one dilutes polish on the core loop.

## System shape

```
Browser (TipTap editor + desk UI)
    │  REST JSON / multipart
    ▼
Next.js App Router
  ├─ Server Components for lists / auth gate
  ├─ Route handlers for mutations
  └─ JWT session cookie
    │
    ▼
Prisma → SQLite (Document, User, DocumentShare)
```

**Why this stack:** one TypeScript codebase, fast to deploy, TipTap gives a production-grade editing surface without rebuilding a document model, SQLite keeps local setup zero-friction for reviewers.

## Persistence model

- `content` is stored as HTML produced by TipTap. That preserves bold/italic/underline/headings/lists across reload without inventing a custom schema.
- Sharing is a simple join table (`DocumentShare`). Ownership is `Document.ownerId`. The UI splits “Owned by you” vs “Shared with you” so the access model is visible, not buried in settings.
- Autosave is debounced client-side and PATCHes title + HTML. Conflicts / OT are out of scope; last write wins.

## Auth

Lightweight email/password against seeded users. Sessions are signed JWTs in an httpOnly cookie. Enough to demonstrate sharing across identities without spending the timebox on OAuth or email verification.

## File upload

Import accepts `.txt` / `.md` only. A small deterministic converter turns Markdown structure into HTML TipTap can edit. Raw HTML in uploads is escaped. This is product-relevant (start from an existing brief) without dragging in LibreOffice/mammoth complexity.

## Quality bar for the timebox

- Explicit validation errors from API routes (Zod + typed HTTP errors)
- One meaningful automated test around import conversion / XSS escaping
- Seeded multi-user demo path documented in the UI and README

## What I would build next (2–4 hours)

1. Postgres (Neon/Turso) for durable cloud deploys without a volume  
2. Viewer vs editor share roles  
3. Export to Markdown  
4. Presence indicator (even polling-based) once the core loop is locked
