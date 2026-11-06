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
- 完成修改后运行受影响应用的 `pnpm type-check`；涉及构建时再运行 `pnpm build`。
- 使用中文沟通和编写文档，技术名词、标识符和命令保留原文。
- 命令首次执行失败后，只允许基于明确的新诊断进行一次重试；重试仍然失败时必须立即停止继续尝试，并通知用户手动运行失败的命令，同时说明准确的错误信息和所需的环境条件。
- 开发过程中修改后端代码后，如需同步更新由 Docker Compose 部署的开发环境，必须及时提示用户手动运行 `docker compose -f docker-compose.dev.yml up -d` 或必要的相关更新命令。

## Git 提交规范

- AI 可以协助执行 `git add` 暂存改动，并编写符合下述规范的提交标题与描述。
- AI 不得执行 `git commit`、`git push` 或通过其他工具、接口进行等效的提交、上传操作；提交和上传必须由开发者本人手动执行。

采用 Conventional Commits，格式为 `type(scope): 描述`：类型和范围使用英文小写，描述使用中文；范围可用 `frontend`、`backend`、`readme` 等，也可省略。

| 类型 | 用途 |
| --- | --- |
| `feat` | 新增功能 |
| `fix` | 修复问题 |
| `docs` | 修改文档 |
| `style` | 调整代码格式，不涉及界面样式 |
| `refactor` | 重构代码，保持功能行为 |
| `perf` | 优化性能 |
| `test` | 新增或修改测试 |
| `build` | 修改构建配置或依赖 |
| `ci` | 修改持续集成流程 |
| `chore` | 其他维护工作 |
| `revert` | 撤销提交 |

示例：

```text
feat(frontend): 添加 Button 示例
docs(readme): 补充 Docker 技术栈
```

每次提交围绕一件完整的事情，描述写清楚改动；不兼容变更在冒号前加 `!`，例如 `feat(api)!: 调整用户接口返回字段`，并在提交正文说明影响和迁移方式。
