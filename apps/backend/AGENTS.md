# AGENTS.md

本文档适用于 `apps/backend/` 及其所有子目录，与[根目录协作规范](../../AGENTS.md)共同生效。

## 开发环境

- 修改后端代码后，如需同步更新由 Docker Compose 部署的开发环境，必须及时提示用户在仓库根目录手动运行 `docker compose -f docker-compose.dev.yml up -d` 或必要的相关更新命令。

## 数据库迁移

- 涉及数据库表、字段、索引等结构变更时，必须检查迁移文件是否同步，并在交付说明中明确提醒用户手动执行迁移；已有迁移无需重复生成，重启容器不会自动应用迁移。
- Docker Compose 开发环境须在仓库根目录手动执行 `docker compose -f docker-compose.dev.yml exec backend pnpm --filter backend-fastify db:migrate`，将迁移应用到后端容器连接的数据库。
- 遇到“服务暂时不可用，请稍后重试”等接口错误时，先查看后端日志；若出现 `relation ... does not exist` 或 `column ... does not exist`，优先排查迁移是否已应用到当前数据库。
