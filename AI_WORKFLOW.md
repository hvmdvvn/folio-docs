# AI workflow note

## Tools used

- **Cursor (Composer)** for scaffolding, TipTap wiring, Prisma models, and first-pass UI
- Manual review in the browser and terminal for correctness (auth/share flows, save behavior, import)

## Where AI materially sped things up

- Boilerplate: Next.js route handlers, Prisma schema, seed script
- TipTap editor setup (extensions, toolbar, autosave debounce pattern)
- First draft of Markdown→HTML import helpers and Vitest cases

## What I changed or rejected

- Rejected generic “AI SaaS” visuals (purple gradients, Inter-only UI, dashboard clutter). Redesigned toward an editorial desk: Syne + Manrope + Source Serif, ink/teal on warm paper.
- Narrowed AI-suggested scope (realtime cursors, comments, DOCX) — kept them as explicit non-goals.
- Tightened share UX copy and seeded account chips so reviewers do not hunt for credentials.
- Moved `SessionUser` out of a server-only auth module after catching a client-boundary issue AI did not anticipate.
- Simplified persistence to HTML-in-SQLite instead of a custom block document schema.

## How I verified

- `npm run test` for import conversion + HTML escaping
- `npm run build` for typecheck / production compile
- Manual path: Maya creates/shares → Jordan sees “Shared with you” → Sam has empty desk
- Import `fixtures/product-brief.md` and confirm headings/lists survive edit + refresh
- Checked save indicator transitions (dirty → saving → saved)

AI accelerated scaffolding; product judgment, scope cuts, visual direction, and verification stayed human-owned.
