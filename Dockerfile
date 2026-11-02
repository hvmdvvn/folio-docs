FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:/data/folio.db
ENV AUTH_SECRET=folio-production-change-me-please-32

EXPOSE 3000

CMD ["sh", "-c", "mkdir -p /data && npx prisma db push && npx tsx prisma/seed.ts && npm start"]
