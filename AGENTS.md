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
- 涉及 shadcn-vue 的组件安装、使用、样式定制、调试或更新时，必须先阅读并遵守 [.agents/skills/shadcn-vue/SKILL.md](.agents/skills/shadcn-vue/SKILL.md)，并按其要求读取相关参考文件。
- 前后端是独立 pnpm 项目，在对应的 `apps/frontend` 或 `apps/backend` 目录执行命令。
- 按职责组织代码，复用逻辑放入合适的共享模块；避免无关重构和重复实现。
- 前端编写工具逻辑前，先检查原生 JavaScript API、项目已有工具、`@vueuse/core` 和 `es-toolkit`；Vue 响应式及浏览器交互优先使用 VueUse，通用数据处理优先复用 `es-toolkit`，按需导入，避免重复造轮子。
- 更新功能或配置时同步维护相关文档；新增依赖前确认现有依赖无法满足需求。
- AI 不得自动更新 README 文件；仅在用户明确要求更新 README 时才允许修改，功能或配置变更不构成更新 README 的授权。
- AI 禁止编写、修改或执行测试脚本，禁止进行功能、界面、交互、运行效果等成果验证；仅允许执行 `type-check`、lint 等静态代码检查。
- 完成代码修改后运行受影响应用的 `pnpm type-check`；构建、成果验证与最终验收由开发者手动完成，AI 可简明扼要地建议开发者验收步骤。
- 使用中文沟通和编写文档，技术名词、标识符和命令保留原文。
- 除 pnpm 外，命令首次执行失败后，只允许基于明确的新诊断进行一次重试；重试仍然失败时必须立即停止继续尝试，并通知用户手动运行失败的命令，同时说明准确的错误信息和所需的环境条件。
- pnpm 无法运行或连接失败时，立即停止重试，说明错误并提供手动执行命令，等待用户确认执行完成后再继续。
- 开发过程中修改后端代码后，如需同步更新由 Docker Compose 部署的开发环境，必须及时提示用户手动运行 `docker compose -f docker-compose.dev.yml up -d` 或必要的相关更新命令。

## Git 提交规范

- AI 可以暂存、编写提交信息并执行 `git commit`；禁止执行 `git push` 或等效远程上传，推送由开发者手动完成。
- 采用 Conventional Commits：`type(scope): 中文描述`，类型和范围使用英文小写，范围可省略。例如：`docs(agents): 更新 Git 规范`。
- 类型：`feat` 功能、`fix` 修复、`docs` 文档、`style` 代码格式、`refactor` 重构、`perf` 性能、`test` 测试、`build` 构建与依赖、`ci` 持续集成、`chore` 维护、`revert` 撤销。
- 每次提交只做一件完整的事；简单改动只写简短标题，必要时再补充正文。
- 不兼容变更在冒号前加 `!`，并在正文说明影响和迁移方式。
