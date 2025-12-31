
FROM node:18-alpine AS base

# Prune
FROM base AS prune
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=store --docker

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=prune /app/out/full/ .
COPY turbo.json turbo.json
RUN npm run build --filter=store...

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/store/.next/standalone ./
COPY --from=builder /app/apps/store/.next/static ./apps/store/.next/static
COPY --from=builder /app/apps/store/public ./apps/store/public

EXPOSE 3000
CMD ["node", "apps/store/server.js"]
