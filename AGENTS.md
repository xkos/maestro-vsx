# maestro

AI Coding 时代的文档中心开发指挥台 —— 一款 VS Code / Cursor 插件，将开发者的主操作面从代码编辑器转移到文档/任务/计划面板。

## 项目结构

- `docs/prds/` — 产品需求文档（me2ai：人维护）
  - `overview.md` — 产品定位、需求域、演进路线、设计原则
  - `ui-design.md` — UI 与交互设计
- `docs/tech/` — 技术文档（me2ai：人维护）
  - `architecture.md` — 技术选型、分层架构、模块划分
- `docs/ai2ai/` — 项目状态与迭代记录（ai2ai：AI 维护，人审核）
- `src/` — 插件源码（待创建）
  - `extension.ts` — 插件入口
  - `infrastructure/` — 基础设施层（文件系统、文件监听、Markdown 解析）
  - `services/` — 服务层（文档服务、任务服务、上下文服务、状态服务）
  - `providers/` — TreeView 提供者
  - `panels/` — Webview 面板管理
  - `webview/` — React 应用（Webview UI）
  - `types/` — 类型定义

## 架构概览

三层架构：Infrastructure → Service → Presentation

- Infrastructure：封装 `vscode.workspace.fs`、文件监听、Markdown 解析
- Service：文档发现与分类、任务状态管理、上下文组装、状态解析
- Presentation：TreeView（文档导航）+ Webview/React（任务看板、上下文管理器、仪表盘）

详见 `docs/tech/architecture.md`。

## 技术栈

- TypeScript (Strict Mode)
- VS Code Extension API
- React 18 + CSS Modules（Webview）
- esbuild（构建）
- pnpm（包管理）
- vitest（测试）

## 全局规范

- 强制使用 `vscode.workspace.fs`，禁止 Node.js `fs`
- Webview 与 Extension 通信使用强类型 Message Protocol
- 所有注册的事件监听器、命令、Webview Panel 必须推入 `context.subscriptions`
- 代码包含 JSDoc 注释
- 优先异步操作，保持 IDE 流畅
- Webview 样式使用 VS Code CSS 变量（`--vscode-*`），自动适配主题

## 文档职责划分

| 类别 | 位置 | 维护者 | 内容 |
|------|------|--------|------|
| me2ai | `docs/prds/`, `docs/tech/`, `AGENTS.md`, rules/ | 人 | 需求、架构、编码规范 — "应该是什么样" |
| ai2ai | `docs/ai2ai/` | AI（人审核） | 项目状态、迭代记录、经验库 — "现在实际是什么样" |

ai2ai 文档结构：
- `docs/ai2ai/status.md` — 全局状态快照（每次迭代后覆盖更新）
- `docs/ai2ai/tasks/NNN-xxx.md` — 迭代任务分解（事前计划，过程中更新状态）
- `docs/ai2ai/iterations/NNN-xxx.md` — 迭代归档（事后总结，只追加不修改）
- `docs/ai2ai/decisions.md` — AI 经验库（微决策 + 踩坑 + Boundary 变更）

tasks/ 和 iterations/ 共享编号，一一配对：task 定义"要做什么"，iteration 记录"做完了什么"。

## AI 决策边界

> 框架说明见 rules/ 中的 ai-boundary-framework

### Always do（直接执行）

- 遵循本文件和 rules/ 中的编码规范
- 更新 ai2ai 文档
- 运行已有的测试和 lint
- 按 task 文件中已审核的任务执行实现
- 使用 `vscode.workspace.fs` 进行文件操作
- 将事件监听器和命令推入 `context.subscriptions`
- Webview 样式使用 VS Code CSS 变量

### Ask first（说明意图，等确认）

- 新增 task 中未提及的外部依赖
- 改变已有的 Message Protocol 类型定义
- 改变已有 Service 层的公开接口
- 删除或重命名已有文件
- 重构涉及超过 3 个文件的变更
- 偏离当前 task 文件中定义的任务范围
- 修改 `package.json` 中的 `contributes` 配置

### Never do（禁止）

- 删除或覆盖 me2ai 文档的内容
- 使用 Node.js `fs` 模块替代 `vscode.workspace.fs`
- 在 Webview 中使用硬编码颜色值（必须用 CSS 变量）
- 修改用户的 `.cursorrules` 或其他 IDE 配置文件
- 引入私有文件格式（所有数据必须是标准 Markdown / JSON）
