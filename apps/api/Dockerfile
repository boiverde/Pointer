
FROM node:18-alpine AS base

# Prune
FROM base AS prune
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=api --docker

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=prune /app/out/full/ .
COPY turbo.json turbo.json
RUN npm run build --filter=api...

# Runner
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main"]
