# Multi-stage build for Gluhoman Telegram bot
# Build context: bot/  (i.e. `docker build -t gluhoman-bot -f bot/Dockerfile bot/`)

# ---------- Stage 1: deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
# Prisma needs openssl on Alpine
RUN apk add --no-cache openssl libc6-compat
COPY package.json package-lock.json* ./
COPY prisma ./prisma
# Use npm ci when lockfile exists, fall back to npm install otherwise.
# postinstall runs `prisma generate` — schema already in place above.
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi

# ---------- Stage 2: build ----------
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY tsconfig.json ./tsconfig.json
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm run build

# ---------- Stage 3: runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl libc6-compat tini

# Non-root user
RUN addgroup -S bot && adduser -S bot -G bot

# Only production runtime artifacts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json ./package.json

USER bot

HEALTHCHECK --interval=60s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "process.exit(0)"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
