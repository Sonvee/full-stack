# AGENTS.md

本文档适用于 `apps/frontend/` 及其所有子目录，与[根目录协作规范](../../AGENTS.md)共同生效。

## 开发规范

- 遵循 Vue 3 Composition API 与 `<script setup>`。
- Vue 模板引用变量统一以 `Ref` 结尾，模板 `ref` 与 `useTemplateRef` 的名称保持一致，例如 `filterFormRef`。
- `useTemplateRef` 默认不写泛型，由 Vue 工具链自动推断类型，例如 `const actionDialogRef = useTemplateRef('actionDialogRef')`；仅在无法正确推断类型时才显式指定泛型。
- 编写工具逻辑前，先检查原生 JavaScript API、项目已有工具、`@vueuse/core` 和 `es-toolkit`；Vue 响应式及浏览器交互优先使用 VueUse，通用数据处理优先复用 `es-toolkit`，按需导入，避免重复造轮子。

## CRUD 页面实现基准（强制）

- `src/views/admin/tools/test-sample/` 是前端 CRUD 页面的强制实现基准。凡涉及新增（Create）、查询（Read，包括列表与详情）、修改（Update）、删除（Delete）中任意一个或多个操作的页面及其配套组件，在新增、修改或重构时都必须严格仿照该样例，无论是否同时具备四项功能。
- 开始开发或修改前，必须先阅读样例的当前实现：[页面入口](src/views/admin/tools/test-sample/index.vue)、[筛选表单](src/views/admin/tools/test-sample/components/FilterForm.vue)、[新增 / 编辑弹窗](src/views/admin/tools/test-sample/components/ActionDialog.vue)、[字典 composable](src/composables/use-dict.ts)及[API 写法参考](src/api/test-sample/)，按所涉及的功能对照对应实现。
- 严格遵循的范围包括但不限于：目录与文件组织、组件职责拆分、Vue SFC 块顺序、导入与代码排列、模板布局、组件及工具复用、状态与类型组织、函数写法、异步处理、样式写法，以及注释、代码风格和命名风格；均以样例当前代码为准。
- 注释须沿用样例的位置、格式和说明粒度：模板按区域添加 `<!-- ... -->` 注释，函数及关键数据使用中文 `/** ... */` 文档注释，样式中的非直观规则按样例补充说明；注释内容须与当前业务一致。
- 同职责的变量、方法、事件和组件沿用样例命名，如 `dataList`、`queryParams`、`selectedList`、`toQuery`、`toSearch`、`toReset`、`toAdd`、`toUpdate`、`toDelete`、`toConfirm`、`handleSelectionChange`、`FilterForm` 和 `ActionDialog`；字典通过 `useDict` 加载，变量名沿用字典编码。
- 涉及筛选、分页、行选择、表单校验、弹窗初始化与重置、提交、单条或批量删除时，必须沿用样例对应的数据流、事件契约、加载状态、重复提交防护、确认提示，以及成功后的列表刷新和页码处理方式。
- 按实际需求保留对应操作及其配套实现，未涉及的操作、组件、状态、方法和依赖不添加；业务实体、字段、文案和 API 标识符等按实际模块替换，所涉及部分的通用结构和写法仍须严格遵循样例。

## TypeScript 类型组织规范

- 自定义 composable 和组件等，其专属类型可以就近放在所属目录的 `types.ts` 等类型文件中；组件的 props、事件、插槽、实例及内部上下文类型保留在各自组件目录内。
- 组件使用的业务类型仍从 `src/types/` 引用。

## 页面开发与组件复用（强制）

- Vue 模板保持简洁，禁止添加 `aria-*` 属性，如果有非必要的 `id`、`role` 等属性，则必须移除。
- 页面和项目自定义组件中的图标不使用 `data-icon` 属性（包括 `inline-start`、`inline-end` 等取值）；即使 shadcn-vue 示例或 skill 建议添加，也以本项目约定为准。
- `el-button` 的前缀图标和纯图标按钮：iconfont 使用 `#icon` 插槽，Vue 图标组件使用 `:icon`。图文间距和 `loading` 时的图标切换由组件处理；后缀图标和自定义布局保留在默认插槽。
- 未经用户明确允许，AI 禁止修改组件库源码，包括通过 CLI 生成或复制到项目内的官方组件文件（如 `src/components/ui/`）；样式调整、图标替换、注释补充、代码格式化及结构重排均属于源码修改。
- 组件定制应优先通过官方提供的 props、插槽、调用处配置或项目自定义封装组件（如 `Sv*`）实现；确需修改组件库源码时，必须先说明具体文件、修改内容及原因，并获得用户明确许可后再执行。
- 开发任何页面（含模板、样例）前，必须先查组件库的官方组件、组合方案及项目已有实现，再确定实现方式，禁止默认手写。
- 已有方案能够满足需求时，必须优先复用其组件和配套能力，禁止仅模仿外观或重复实现已有功能。
- 只有确认项目已有方案及网上可用库均无法满足需求并说明缺口后，才可自行实现缺失部分。

## 设计规范 

- 避免不必要的辅助标签与说明。让布局本身发挥解释作用。
