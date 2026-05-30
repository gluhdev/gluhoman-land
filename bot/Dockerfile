# Multi-stage build for the Gluhoman Telegram bot.
# Build context: repo ROOT (compose: context: ., dockerfile: bot/Dockerfile),
# so the bot reuses the main app's Postgres Prisma schema for production.

# ---------- Stage 1: deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY bot/package.json bot/package-lock.json* ./
# Install without running the postinstall `prisma generate` (no schema yet / wrong default).
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund --ignore-scripts; \
    else \
      npm install --no-audit --no-fund --ignore-scripts; \
    fi

# ---------- Stage 2: build ----------
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY bot/package.json ./package.json
COPY bot/tsconfig.json ./tsconfig.json
COPY bot/src ./src
# Use the main app's Postgres schema (prod DB), not the bot's sqlite dev one.
COPY prisma ./prisma
RUN npx prisma generate --schema=prisma/schema.postgres.prisma
RUN npm run build

# ---------- Stage 3: runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl libc6-compat tini
RUN addgroup -S bot && adduser -S bot -G bot

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY bot/package.json ./package.json

USER bot

HEALTHCHECK --interval=60s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "process.exit(0)"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
