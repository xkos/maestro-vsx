# Maestro — 技术架构

> 定义 Maestro 插件的技术选型和架构。
> 最后更新：2026-03-12

---

## 定位

Maestro 是一个**轻量级的结构化视图插件**。它的核心工作是：

1. 读取 `docs/` 下的文档文件，按方法论结构展示
2. 解析 task/status markdown，提取关键信息展示
3. 提供少量便捷操作（初始化、复制上下文、刷新）

它不是一个"管理系统"，不需要实时监听、双向同步、复杂状态管理。用户的主要协作仍然在 Cursor 的 Agent/Plan 对话中完成，Maestro 只是让用户更方便地"看"和"导航"。

## 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 运行环境 | VS Code Extension Host (Node.js) | 插件主进程 |
| 语言 | TypeScript (Strict Mode) | 全项目统一 |
| 原生 UI | VS Code TreeView API | 文档导航、任务列表 |
| 富 UI | Webview + React（仅在需要时引入） | 预留给仪表盘等复杂视图 |
| 样式 | VS Code CSS 变量 + Codicon | 自动适配主题 |
| 构建 | esbuild | 打包 Extension |
| 包管理 | pnpm | |
| 测试 | vitest | 单元测试 |

## 架构

极简两层：

```
┌─────────────────────────────────────────┐
│            Presentation                  │
│  ┌─────────────────┐ ┌───────────────┐  │
│  │ DocTreeProvider  │ │ TaskTreeProvider│ │
│  │ (文档导航树)      │ │ (任务列表树)    │ │
│  └────────┬─────────┘ └───────┬───────┘  │
│           │                   │          │
├───────────┼───────────────────┼──────────┤
│           ▼                   ▼          │
│              Core (读取 + 解析)           │
│  ┌──────────────┐  ┌──────────────────┐  │
│  │ docScanner   │  │ markdownParser   │  │
│  │ (扫描文档目录  │  │ (解析 task/status │  │
│  │  按类型分组)   │  │  提取结构化数据)  │  │
│  └──────────────┘  └──────────────────┘  │
│  ┌──────────────┐  ┌──────────────────┐  │
│  │ contextBuilder│ │ projectBootstrap │  │
│  │ (组装上下文    │  │ (初始化文档目录)  │  │
│  │  文本)         │  │                  │  │
│  └──────────────┘  └──────────────────┘  │
│           │                              │
│           ▼                              │
│     vscode.workspace.fs (只读为主)        │
└─────────────────────────────────────────┘
```

没有 Service 层，没有 FileWatcher。Core 模块就是一组纯函数/简单类，被 Provider 直接调用。

## 刷新策略

不做实时监听（FileWatcher）。刷新时机：

1. 插件激活时：首次加载
2. 面板重新可见时：通过 `TreeView.onDidChangeVisibility` 监听，用户从 Cursor 对话切回 Maestro 面板时自动刷新
3. 执行命令后：比如初始化完成后自动刷新
4. 手动刷新：TreeView 标题栏的刷新按钮（兜底）

注意：必须使用 `vscode.window.createTreeView()` 创建视图（而非 `registerTreeDataProvider()`），才能获取 `onDidChangeVisibility` 事件。

这足够了——用户在 Cursor 对话里让 AI 改完文件后，切回 Maestro 面板点一下刷新就能看到最新状态。

## 核心模块职责

| 模块 | 职责 | 复杂度 |
|------|------|--------|
| docScanner | 扫描工作区 `docs/`、`AGENTS.md`、`.cursor/rules/`，按 me2ai/ai2ai 分组返回文件列表 | 低 |
| markdownParser | 从 task 文件提取任务列表（checkbox + 描述），从 status.md 提取模块就绪度表格 | 中 |
| contextBuilder | 根据用户选择，拼接文档路径和摘要为一段文本 | 低 |
| projectBootstrap | 创建 `docs/` 目录结构和骨架文件，可选生成 rules 声明 | 低 |
| DocTreeProvider | TreeView 数据提供者，调用 docScanner 获取数据 | 低 |
| TaskTreeProvider | TreeView 数据提供者，调用 markdownParser 获取任务数据 | 低 |

## 项目目录结构（预期）

```
maestro/
├── .vscode/              # 调试配置
├── src/
│   ├── extension.ts      # 插件入口，注册命令和视图
│   ├── core/
│   │   ├── docScanner.ts
│   │   ├── markdownParser.ts
│   │   ├── contextBuilder.ts
│   │   └── projectBootstrap.ts
│   ├── providers/
│   │   ├── docTreeProvider.ts
│   │   └── taskTreeProvider.ts
│   └── types/
│       └── index.ts      # 类型定义
├── docs/                 # 项目自身的文档
├── package.json          # 插件清单
├── tsconfig.json
└── esbuild.config.mjs
```

## 关键设计决策

### D1: 文件系统 API 选择

强制使用 `vscode.workspace.fs` 而非 Node.js `fs`，兼容远程开发场景。

### D2: TreeView 优先，Webview 后补

MVP 阶段全部使用 VS Code 原生 TreeView，不引入 React/Webview。原因：
- TreeView 足以展示文档树和任务列表
- 原生体验，零额外构建步骤
- 开发速度快，维护成本低

仅当需要仪表盘等复杂可视化时才引入 Webview。

### D3: 无实时监听

不使用 FileSystemWatcher。手动刷新足够满足使用场景，且避免了性能开销和复杂的状态同步问题。

### D4: Markdown 轻量解析

针对 task/status 文件的特定格式编写正则解析器，不引入 remark 等重型库。
