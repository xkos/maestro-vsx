# 任务 001: 插件骨架 + 项目初始化命令

> 状态：✅ 已关闭
> 配对迭代：[iterations/001-skeleton.md](../iterations/001-skeleton.md)

## 迭代目标

搭建 Maestro 插件的最小可运行骨架，实现项目初始化命令，能通过 F5 启动调试并在侧边栏看到 Maestro 图标。

## 前置条件

- Node.js 18+
- pnpm
- VS Code / Cursor

## 任务分解

- [x] T1: 生成 VS Code 插件项目骨架（TypeScript）
  - 验证：`pnpm install` 成功，无报错

- [x] T2: 调整项目结构，建立 `src/core/`、`src/providers/`、`src/types/` 目录
  - 验证：目录结构与 `docs/tech/architecture.md` 中的预期一致

- [x] T3: 配置 esbuild 打包
  - 验证：`pnpm run compile` 成功产出 `dist/extension.js`

- [x] T4: 在 `package.json` 中注册 Maestro 侧边栏视图容器和视图
  - 注册 Activity Bar 图标（使用自定义 SVG 图标）
  - 注册 `maestro-docs` 视图（文档导航）
  - 注册 `maestro-tasks` 视图（任务列表）
  - 验证：F5 启动后，Activity Bar 出现 Maestro 图标，点击后侧边栏显示两个视图

- [x] T5: 实现 `projectBootstrap.ts`——项目初始化核心逻辑
  - 创建 `docs/prds/`、`docs/tech/`、`docs/ai2ai/`、`docs/ai2ai/tasks/`、`docs/ai2ai/iterations/` 目录
  - 生成骨架文件：`AGENTS.md`、`docs/ai2ai/status.md`、`docs/ai2ai/decisions.md`
  - 使用 `vscode.workspace.fs` 实现
  - 验证：调用后目录和文件正确创建，已存在的文件不被覆盖

- [x] T6: 注册命令 `maestro.initializeProject`，绑定到 projectBootstrap
  - 在命令面板（Ctrl+Shift+P）中可搜索到 "Maestro: Initialize Project"
  - 执行后弹出 `showInformationMessage` 提示初始化完成
  - 验证：在空工作区执行命令后，文档目录结构正确创建

- [x] T7: 实现 `DocTreeProvider` 和 `TaskTreeProvider`
  - DocTreeProvider：扫描 docs/ 目录，按 me2ai/ai2ai 分组展示文档树
  - TaskTreeProvider：解析 task 文件，展示任务列表和完成状态
  - 使用 `vscode.window.createTreeView()` 创建，支持 onDidChangeVisibility 自动刷新
  - 验证：F5 启动后侧边栏显示文档树和任务列表

- [x] T8: 配置 `.vscode/launch.json` 调试配置
  - 验证：F5 能启动 Extension Development Host，插件正常激活
