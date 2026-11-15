# AGENTS.md

本文档适用于 `apps/backend/` 及其所有子目录，与[根目录协作规范](../../AGENTS.md)共同生效。

## 开发环境

- 修改后端代码后，如需同步更新由 Docker Compose 部署的开发环境，必须及时提示用户在仓库根目录手动运行 `docker compose -f docker-compose.dev.yml up -d` 或必要的相关更新命令。
