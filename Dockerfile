FROM node:24-alpine AS frontend-build
WORKDIR /app
RUN corepack enable
COPY apps/frontend/package.json apps/frontend/pnpm-lock.yaml ./
COPY apps/frontend/.npmrc ./.npmrc
RUN pnpm install --frozen-lockfile
COPY apps/frontend/ ./
RUN pnpm build

FROM nginx:alpine AS frontend
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD wget -q --spider http://127.0.0.1/ || exit 1

FROM node:24-alpine AS backend-build
WORKDIR /app
RUN corepack enable
COPY apps/backend/package.json apps/backend/pnpm-lock.yaml apps/backend/pnpm-workspace.yaml ./
COPY apps/backend/.npmrc ./.npmrc
RUN pnpm install --frozen-lockfile
COPY apps/backend/ ./
RUN pnpm build

FROM node:24-alpine AS backend
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY apps/backend/package.json apps/backend/pnpm-lock.yaml apps/backend/pnpm-workspace.yaml ./
COPY apps/backend/.npmrc ./.npmrc
RUN pnpm install --prod --frozen-lockfile
COPY --from=backend-build /app/dist ./dist
USER node
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD ["node", "-e", "fetch('http://127.0.0.1:3001/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["node", "dist/server.js"]
