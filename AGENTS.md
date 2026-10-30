# AGENTS.md

本文档适用于仓库根目录及其所有子目录。更深层的 `AGENTS.md` 可以补充对应目录的规则。

## 项目结构

```text
.
├─ apps/
│  ├─ frontend/            # Vue 3 前端应用
│  └─ backend/             # Fastify 后端服务
├─ packages/
│  ├─ database/            # 数据库代码预留
│  ├─ config/              # 共享配置预留
│  └─ shared/              # 共享类型和工具预留
├─ docs/                   # 项目文档
├─ scripts/                # 项目脚本
├─ Dockerfile              # 前后端生产镜像多阶段构建
├─ docker-compose.yml      # 生产服务编排
├─ docker-compose.dev.yml  # 本地开发服务编排
├─ docker/                 # 容器运行配置
├─ AGENTS.md               # 项目协作与代码规范
└─ README.md
```

## 开发规范

- 使用 TypeScript；前端遵循 Vue 3 Composition API 与 `<script setup>`。
- 前后端是独立 pnpm 项目，在对应的 `apps/frontend` 或 `apps/backend` 目录执行命令。
- 按职责组织代码，复用逻辑放入合适的共享模块；避免无关重构和重复实现。
- 更新功能或配置时同步维护相关文档；新增依赖前确认现有依赖无法满足需求。
- 完成修改后运行受影响应用的 `pnpm type-check`；涉及构建时再运行 `pnpm build`。
- 使用中文沟通和编写文档，技术名词、标识符和命令保留原文。
- 禁止使用、创建或依赖 `.pnpm-store`；依赖安装必须遵循项目现有的 pnpm 配置。
- 命令首次执行失败后，只允许基于明确的新诊断进行一次重试；重试仍然失败时必须立即停止继续尝试，并通知用户手动运行失败的命令，同时说明准确的错误信息和所需的环境条件。
- 开发过程中修改后端代码后，如需同步更新由 Docker Compose 部署的开发环境，必须及时提示用户手动运行 `docker compose -f docker-compose.dev.yml up -d` 或必要的相关更新命令。

