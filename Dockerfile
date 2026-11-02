FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Expect DATABASE_URL + AUTH_SECRET from the host environment.
CMD ["sh", "-c", "npx prisma db push && npx tsx prisma/seed.ts && npm start"]
