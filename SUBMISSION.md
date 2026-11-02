# Submission contents

This folder / repository includes:

| Item | Location |
| --- | --- |
| Source code | repository root (`src/`, `prisma/`, etc.) |
| Local setup instructions | `README.md` |
| Architecture note | `ARCHITECTURE.md` |
| AI workflow note | `AI_WORKFLOW.md` |
| Walkthrough video URL | `WALKTHROUGH.txt` |
| Sample import file | `fixtures/product-brief.md` |
| Dockerfile | `Dockerfile` |

## Live product URL

_Paste deployed URL here after deploy:_

```
LIVE_URL=
```

## Reviewer credentials

- `maya@folio.dev` / `folio123`
- `jordan@folio.dev` / `folio123`
- `sam@folio.dev` / `folio123`

Suggested path: sign in as Maya → open **Product kickoff notes** → Share with `jordan@folio.dev` → sign out → sign in as Jordan → confirm it appears under **Shared with you**.

## Working vs incomplete

**Working**

- Auth with seeded users
- Document CRUD + rich text + autosave
- Owned vs shared lists
- Share / revoke by email
- `.txt` / `.md` import
- Persistence across refresh
- Automated import tests

**Intentionally incomplete**

- Realtime multiplayer
- Comments / suggestions
- Version history
- `.docx` / PDF import
- Role-based permissions beyond owner vs collaborator access

**Next 2–4 hours**

- Durable hosted database (Postgres/Turso)
- Export Markdown
- Viewer-only shares
