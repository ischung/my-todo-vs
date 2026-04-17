# syntax=docker/dockerfile:1.7

# ---------- Build stage ----------
FROM node:20-alpine AS build

# better-sqlite3 native build deps
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Workspace manifests first (cache-friendly layer)
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN npm ci

# Copy source
COPY backend ./backend
COPY frontend ./frontend

# Build the React SPA (outputs to frontend/dist)
RUN npm run build --workspace=frontend

# Prune dev dependencies for a slimmer runtime layer
RUN npm prune --omit=dev

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy only what the runtime needs
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production \
    PORT=8080 \
    DB_PATH=/app/data/todo.db \
    GIT_SHA=dev

# Persistent DB goes here
VOLUME /app/data

EXPOSE 8080

# Simple healthcheck hitting /api/health
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD wget -qO- http://localhost:8080/api/health >/dev/null || exit 1

CMD ["node", "backend/src/index.js"]
