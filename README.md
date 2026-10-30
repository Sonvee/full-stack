# Full-Stack 项目模板

一个面向现代 Web 应用的前后端分离全栈项目模板。

项目采用 Vue 3 构建前端，Fastify 提供后端 API，PostgreSQL 负责数据存储，并通过 Docker 统一开发与部署环境。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Vue 3、Vite、TypeScript、Tailwind CSS |
| 状态与工具 | Pinia、VueUse |
| 后端 | Node.js、Fastify、TypeScript |
| 数据库 | PostgreSQL、Drizzle ORM |
| 工程化 | pnpm、Oxlint、Oxfmt、TypeScript |
| 部署 | Docker、Docker Compose |

## 目录规划

```text
.
├─ apps/
│  ├─ frontend/            # Vue 3 前端应用
│  └─ backend/             # Fastify 后端服务
├─ packages/
│  ├─ database/            # Drizzle schema、迁移与数据库访问
│  ├─ config/              # 共享 TypeScript、Oxlint、Oxfmt 等配置
│  └─ shared/              # 前后端共享类型和工具（按需增加）
├─ docs/                   # 架构、开发、API 和部署文档
├─ scripts/                # 项目维护和自动化脚本
├─ package.json            # 根工作区脚本
├─ docker-compose.yml      # 本地开发与部署编排
├─ pnpm-workspace.yaml     # pnpm workspace 配置
├─ AGENTS.md               # 项目协作与代码规范
└─ README.md
```

## 开发约定


## 本地开发


## 环境变量


## Docker 部署


## License

