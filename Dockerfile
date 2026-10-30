FROM node:24-alpine AS frontend-build
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/frontend/package.json ./apps/frontend/package.json
RUN pnpm install --store-dir /pnpm/store --filter frontend-vue... --frozen-lockfile
COPY apps/frontend/ ./apps/frontend/
RUN pnpm --filter frontend-vue build

FROM nginx:alpine AS frontend
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /workspace/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD wget -q --spider http://127.0.0.1/ || exit 1

FROM node:24-alpine AS backend-build
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/backend/package.json ./apps/backend/package.json
RUN pnpm install --store-dir /pnpm/store --filter backend-fastify... --frozen-lockfile
COPY apps/backend/ ./apps/backend/
RUN pnpm --filter backend-fastify build

FROM node:24-alpine AS backend
WORKDIR /workspace
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/backend/package.json ./apps/backend/package.json
RUN pnpm install --store-dir /pnpm/store --filter backend-fastify... --prod --frozen-lockfile
COPY --from=backend-build /workspace/apps/backend/dist ./apps/backend/dist
WORKDIR /workspace/apps/backend
USER node
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD ["node", "-e", "fetch('http://127.0.0.1:3001/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["node", "dist/server.js"]
