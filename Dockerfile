# syntax=docker/dockerfile:1
# ============================================================
# Frontend — multi-stage build
#   stage 1 (build)  : install deps + Vite production build
#   stage 2 (runtime): serve the static dist via nginx
#
# Vite inlines VITE_* values at BUILD time. Rather than thread every key
# through as a build-arg, the CI pipeline writes all VITE_* CI/CD variables
# into `.env.production` (see .gitlab-ci.yml) and Vite reads it here. Adding a
# new VITE_* variable therefore needs NO change to this file — just add the
# CI/CD variable and document it in .env.example.
#
# To build locally: create a `.env.production` (or rely on the defaults in
# src/utils.jsx), then `docker build -t my-app .`
# ============================================================

ARG NODE_VERSION=20-alpine
ARG NGINX_VERSION=1.27-alpine

# ─── Build stage ────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS build
WORKDIR /app

# Install deps first — leverages Docker layer cache when only source changes.
# `npm install` (not `npm ci`) because the lockfile is intentionally gitignored.
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy source (includes the CI-generated .env.production) + build.
COPY . .
RUN npm run build

# ─── Runtime stage ──────────────────────────────────────────────────
FROM nginx:${NGINX_VERSION} AS runtime

# Replace nginx's default site with the SPA-aware config.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ship the built bundle.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck so docker / orchestrators can detect a broken container.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
