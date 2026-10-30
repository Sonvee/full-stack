# Full-Stack 项目模板

一个前后端分离的 TypeScript 全栈项目脚手架，当前包含一个 Vue 3 前端应用和一个 Fastify 后端服务。

## 当前状态

- 前端：Vue 3 + Vite，入口页面位于 `apps/frontend/src/App.vue`。
- 后端：Fastify，已提供 `GET /health` 健康检查接口。
- 数据库：后端使用 PostgreSQL、`pg` 连接池和 Drizzle ORM；业务表按需求定义在 `apps/backend/src/db/schema.ts`。
- Docker Compose：开发和生产环境分别由 `docker-compose.dev.yml` 与 `docker-compose.yml` 管理。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Vue 3、Vite、TypeScript、Vue Router、Pinia |
| 后端 | Node.js、Fastify、TypeScript、tsx |
| 工程化 | pnpm、Vue TSC、Oxlint/Oxfmt 配置（按应用启用） |
| 运行环境 | Node.js `>=22.18.0` |

## 目录结构

```text
.
├─ package.json             # 根 workspace 脚本与 pnpm 版本声明
├─ pnpm-workspace.yaml      # workspace 范围与 pnpm 配置
├─ pnpm-lock.yaml           # 统一依赖锁文件
├─ apps/
│  ├─ frontend/            # Vue 3 前端应用
│  └─ backend/             # Fastify 后端服务
├─ packages/
│  ├─ config/              # 共享配置（当前为目录占位）
│  ├─ database/            # 数据库相关代码（当前为目录占位）
│  └─ shared/              # 前后端共享类型和工具（当前为目录占位）
├─ docs/                   # 项目文档
├─ scripts/                # 项目脚本
├─ Dockerfile              # 生产镜像多阶段构建
├─ docker-compose.yml      # 生产服务编排
├─ docker-compose.dev.yml  # 本地开发服务编排
├─ docker/                 # 容器运行配置（Nginx）
├─ AGENTS.md               # 项目协作约定
└─ README.md
```

## 环境要求

- Node.js `22.18.0` 或更高版本
- pnpm

查看 Node.js 和 pnpm 版本：

```bash
node --version
pnpm --version
```

## 本地开发

仓库使用根目录的 pnpm workspace 统一管理前端、后端和共享 packages，依赖安装与锁文件统一在仓库根目录维护。

### 启动后端

后端启动时会连接 PostgreSQL 和 Redis。请先确保本机 PostgreSQL、Redis 分别监听 `localhost:5432`、`localhost:6379`，或从仓库根目录运行 `docker compose -f docker-compose.dev.yml up -d database redis` 启动开发依赖。

```bash
pnpm install
pnpm dev:backend
```

后端默认监听 `http://localhost:3001`。健康检查：

```bash
curl http://localhost:3001/health
```

预期响应：

```json
{"status":"ok"}
```

### 启动前端

在另一个终端执行：

```bash
pnpm dev:frontend
```

Vite 默认监听 `0.0.0.0:5173`。本机访问使用 `http://localhost:5173`，同一局域网中的其他设备使用开发机的局域网 IP 访问，例如 `http://192.168.1.100:5173`。

### Docker Compose

开发环境挂载源码并启用热更新：

```bash
docker compose -f docker-compose.dev.yml up
```

首次使用时，将根目录 `.env.example` 复制为 `.env`；Docker Compose 会自动加载 `.env`。开发容器从根 workspace 安装依赖并挂载整个仓库，前端地址为 `http://localhost:5173`，后端地址为 `http://localhost:3001`。PostgreSQL 和 Redis 分别映射到本机 `5432` 和 `6379`，示例数据库用户为 `root`，PostgreSQL 和 Redis 密码为 `root1234`。后端等待数据库和 Redis 健康后启动。

卸载开发环境时，在仓库根目录执行：

```bash
# 删除开发容器和网络，保留镜像及数据卷
docker compose -f docker-compose.dev.yml down

# 同时删除 Compose 使用的镜像，保留数据卷
docker compose -f docker-compose.dev.yml down --rmi all

# 连同 PostgreSQL、Redis 数据卷一起删除（会清空本地数据）
docker compose -f docker-compose.dev.yml down --rmi all -v
```

生产环境使用相同命令，将 `docker-compose.dev.yml` 参数去掉，例如：

```bash
docker compose down
docker compose down --rmi all
docker compose down --rmi all -v
```

其中 `-v` 会删除 Compose 管理的数据卷，只有确认不再需要本地数据库和 Redis 数据时才使用。

生产环境使用根目录 `Dockerfile` 的 `frontend` 和 `backend` 构建阶段，Compose 会为两个服务构建独立镜像：

```bash
docker compose up --build -d
```

### 推送到 Docker Hub

生产 Compose 固定使用 `latest` 标签。发布版本时，先构建并推送 `latest`，再复制为对应的版本标签：

```powershell
docker login
$version = "1.0.0"
docker compose -f docker-compose.yml build frontend backend
docker push sonve/full-stack:frontend-latest
docker push sonve/full-stack:backend-latest
docker tag sonve/full-stack:frontend-latest "sonve/full-stack:frontend-$version"
docker tag sonve/full-stack:backend-latest "sonve/full-stack:backend-$version"
docker push "sonve/full-stack:frontend-$version"
docker push "sonve/full-stack:backend-$version"
```

默认使用的镜像标签为 `sonve/full-stack:frontend-latest` 和 `sonve/full-stack:backend-latest`。示例命令额外生成 `sonve/full-stack:frontend-1.0.0` 和 `sonve/full-stack:backend-1.0.0`。

生产前端默认映射到本机 `80`，后端映射到 `3001`。数据库和 Redis 不映射到宿主机端口；数据保存在 `postgres_data` 和 `redis_data` 卷中。数据库用户、PostgreSQL 和 Redis 密码及端口均可在根目录 `.env` 中修改。`.env.example` 中的值仅为示例，部署时请替换密码，并使用 URL 安全字符。停止生产服务使用 `docker compose down`。

### 服务器生产环境部署

服务器只需要安装 Docker、Docker Compose，并上传 `docker-compose.yml`。以下命令需要在 `docker-compose.yml` 所在目录执行。生产环境建议同时创建 `.env`，配置数据库密码、Redis 密码和端口。Docker Hub 仓库为私有仓库时，先登录；公开仓库可跳过登录：

```bash
docker login
docker compose pull
docker compose up -d
docker compose ps
```

发布新镜像后，在服务器更新：

```bash
docker compose pull
docker compose up -d
```

停止服务器上的生产服务：

```bash
docker compose down
```

有待执行的数据库迁移时，先启动数据库，再运行一次迁移任务：

```bash
docker compose up -d database
docker compose --profile tools run --rm migrate
```

## 环境变量

后端支持以下环境变量：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `HOST` | `0.0.0.0` | 服务监听地址 |
| `PORT` | `3001` | 服务监听端口 |
| `DATABASE_URL` | `postgresql://root:root1234@localhost:5432/app` | PostgreSQL 连接地址 |
| `REDIS_URL` | `redis://:root1234@localhost:6379` | Redis 连接地址 |

Drizzle schema 位于 `apps/backend/src/db/schema.ts`，配置文件为 `apps/backend/drizzle.config.ts`。添加业务表后，在仓库根目录生成并执行迁移：

```bash
pnpm db:generate
pnpm db:migrate
```

例如：

```bash
$env:PORT=3001
pnpm dev:backend
```

Linux/macOS 可使用：

```bash
PORT=3001 pnpm dev:backend
```

## 常用命令

### 根目录

```bash
pnpm install       # 安装整个 workspace 的依赖
pnpm type-check    # 检查所有 workspace 包
pnpm build         # 构建所有 workspace 包
pnpm dev:frontend  # 启动前端开发服务器
pnpm dev:backend   # 启动后端开发服务器
pnpm format        # 格式化前端 src 目录
```

### 按 workspace 包执行

```bash
pnpm --filter frontend-vue dev
pnpm --filter frontend-vue type-check
pnpm --filter backend-fastify dev
pnpm --filter backend-fastify type-check
pnpm --filter backend-fastify build
pnpm --filter backend-fastify start
```

## 开发约定

- 前端使用 Vue 3 Composition API 和 `<script setup lang="ts">`。
- 新增后端路由时，放在 `apps/backend/src/routes/` 下，并在 `src/routes/index.ts` 注册。
- 跨应用复用的类型或工具放入 `packages/shared`，数据库相关实现放入 `packages/database`。
- 提交代码前至少运行受影响应用的 `pnpm type-check`；发布前再运行对应的 `pnpm build`。

## 后续扩展

数据库服务已由 Docker Compose 提供；应用接入数据库、共享 workspace 配置或 API 文档后，请同步更新相关配置和使用说明。

## License

暂未指定 License。
