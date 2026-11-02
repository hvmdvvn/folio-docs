# Deploy Folio (durable live URL)

The app needs two environment variables:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=a-long-random-string
```

## Option A — Vercel (recommended)

1. Claim the demo Prisma Postgres (keeps it free / durable):
   https://create-db.prisma.io/claim?projectID=proj_bu1duis35xif72bsj900y8ut
2. Import the GitHub repo in Vercel: https://github.com/hvmdvvn/folio-docs
3. Add `DATABASE_URL` and `AUTH_SECRET` in Project → Settings → Environment Variables
4. Deploy
5. After the first deploy, run seed once from your machine against that same `DATABASE_URL`:

```bash
npm run db:setup
```

Or add a one-off Vercel build command:

```bash
prisma generate && prisma db push && tsx prisma/seed.ts && next build
```

## Option B — Railway / Render / Fly

Use the included `Dockerfile`. Set the same env vars. On boot it runs `db push` + seed + `next start`.

## Temporary tunnel (machine must stay on)

```bash
npm run dev
npx localtunnel --port 3000
```
