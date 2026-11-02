# Submission contents

| Item | Location |
| --- | --- |
| Source code | https://github.com/hvmdvvn/folio-docs |
| Local setup | `README.md` |
| Architecture note | `ARCHITECTURE.md` |
| AI workflow note | `AI_WORKFLOW.md` |
| Deploy guide | `DEPLOY.md` |
| Walkthrough video URL | `WALKTHROUGH.txt` |
| Sample import file | `fixtures/product-brief.md` |
| Dockerfile | `Dockerfile` |

## Live product URL

```
https://folio-docs-seven.vercel.app
```

Claim the demo Postgres DB so it does not auto-delete after 24h:

```
https://create-db.prisma.io/claim?projectID=proj_bu1duis35xif72bsj900y8ut
```

## Reviewer credentials

- `maya@folio.dev` / `folio123`
- `jordan@folio.dev` / `folio123`
- `sam@folio.dev` / `folio123`

Suggested path: Maya → **Product kickoff notes** → Share with `jordan@folio.dev` → sign out → Jordan → confirm **Shared with you**.

## Working vs incomplete

**Working**

- Auth with seeded users
- Document CRUD + rich text + autosave
- Owned vs shared lists
- Share / revoke by email
- `.txt` / `.md` import
- Persistence across refresh (Postgres)
- Automated import tests

**Intentionally incomplete**

- Realtime multiplayer
- Comments / suggestions
- Version history
- `.docx` / PDF import
- Role-based permissions beyond owner vs collaborator access

**Next 2–4 hours**

- Finish durable Vercel project link + custom domain
- Export Markdown
- Viewer-only shares
