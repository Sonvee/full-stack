# AGENTS.md

本文档定义本项目的协作约定，适用于仓库根目录及其所有子目录。更深层目录中的 `AGENTS.md` 可以补充或细化对应目录的规则。

## 项目结构

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

## 开发规范


