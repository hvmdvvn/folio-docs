# Temporary public URL

While a durable host is being connected, you can expose local `npm run dev` with:

```bash
npx localtunnel --port 3000
```

or Cloudflare:

```bash
cloudflared tunnel --url http://localhost:3000
```

For a durable reviewer URL, deploy the included `Dockerfile` on Railway/Render/Fly with a persistent volume mounted at `/data`.
