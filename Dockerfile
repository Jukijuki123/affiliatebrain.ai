FROM node:20-alpine AS base

# ─── Stage 1: Install dependencies ───────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund

# ─── Stage 2: Build ───────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Deklarasikan build arguments yang dikirim dari Cloud Build via --build-arg
# WAJIB: NEXT_PUBLIC_* harus tersedia saat `npm run build` agar Next.js
# dapat menyematkan (bake) nilainya ke dalam JavaScript bundle untuk browser.
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_APP_URL

# Tulis semua nilai ke .env.production sebelum `npm run build`.
# Next.js membaca .env.production saat build untuk production output.
# Gunakan printf agar karakter khusus seperti = di dalam nilai tidak bermasalah.
RUN printf "NEXT_PUBLIC_FIREBASE_API_KEY=%s\n" "$NEXT_PUBLIC_FIREBASE_API_KEY" > .env.production && \
    printf "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=%s\n" "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" >> .env.production && \
    printf "NEXT_PUBLIC_FIREBASE_PROJECT_ID=%s\n" "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" >> .env.production && \
    printf "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=%s\n" "$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" >> .env.production && \
    printf "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=%s\n" "$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" >> .env.production && \
    printf "NEXT_PUBLIC_FIREBASE_APP_ID=%s\n" "$NEXT_PUBLIC_FIREBASE_APP_ID" >> .env.production && \
    printf "NEXT_PUBLIC_APP_URL=%s\n" "$NEXT_PUBLIC_APP_URL" >> .env.production

RUN npm run build

# ─── Stage 3: Production runner ───────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080
CMD ["node", "server.js"]
