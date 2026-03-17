# Maestro 🎬

[中文](#中文) | [English](#english)

<a name="english"></a>
## 🌟 The Doc-Centric Director's Chair for AI Coding

Maestro is a VS Code / Cursor extension that shifts the primary workspace of developers from the code editor to a documentation, task, and planning dashboard. It is designed specifically for the era of AI-assisted coding.

Using Maestro, you implement the **`me2ai / ai2ai`** methodology directly in your IDE: turning static markdown into an actionable, reactive dashboard.

### ✨ Key Features

- **Document-Driven Development**: Maintain a clean, structured documentation system (`docs/prds`, `docs/tech`, `docs/ai2ai`) directly in your workspace sidebar.
- **`me2ai` & `ai2ai` Separation**:
  - `me2ai` (Human maintained): Define *what it should be* (PRDs, architecture, global rules).
  - `ai2ai` (AI maintained): Document *what it actually is* (Current status, automated task breakdowns, iteration records).
- **Interactive Acceptance Desk (V2)**: 
  - A beautiful, immersive React Webview panel that parses `markdown` task files into interactive checklists.
  - **Unidirectional Data Flow**: Clicking a checkbox in the UI instantly and safely rewrites the `[ ]` into `[x]` in your raw markdown file.
  - Zero lock-in: All data is stored purely in standard Markdown (`.md`) files.

### 🚀 Usage

1. Open an empty/existing project folder in VS Code or Cursor.
2. Press `Cmd + Shift + P` (or `Ctrl + Shift + P`) and type **`Maestro: Initialize Project`** to generate the standard boilerplate methodology files.
3. Chat with your AI agent (like Cursor Composer or Antigravity) and instruct it to write specifications in `docs/prds` and break tasks down into `docs/ai2ai/tasks/`.
4. Press `Cmd + Shift + P` and type **`Maestro: Open Acceptance Desk`** to open the interactive tracking panel and verify your AI's work immersively!

---

<a name="中文"></a>
## 🌟 AI 编程时代的文档中心开发指挥台

Maestro 是一款专为 AI 辅助编程时代设计的 VS Code / Cursor 插件。它将开发者的主操作面从传统“代码编辑器”转移到了“文档、任务与计划”的看板上。

通过 Maestro，您可以直接在 IDE 中落地原生的 **`me2ai / ai2ai`** 方法论：将静态的 Markdown 文档转变为可执行的、响应式的控制面板。

### ✨ 核心特性

- **文档驱动开发 (DDD)**：在侧边栏原生管理结构化的文档体系（`docs/prds`, `docs/tech`, `docs/ai2ai`）。
- **`me2ai` 与 `ai2ai` 职能分离**：
  - `me2ai`（人类维护）：定义“应该是什么样”（需求 PRD、架构图、全局规则）。
  - `ai2ai`（AI 自动维护）：记录“现在实际是什么样”（项目快照状态、原子化任务拆解、迭代归档和经验踩坑录）。
- **沉浸式验收工作台 (V2 主打)**：
  - 基于 React 的精美 Webview 面板，自动解析 Markdown 任务文件中的 `## 验收清单`。
  - **单向数据流穿透**：在 UI 上点击勾选框，插件会在底层毫无侵入地精确定位并改写 Markdown 源码里的 `[ ]` 为 `[x]`。
  - 零绑定锁死：所有宏观状态永远只作为标准 Markdown（`.md`）文件保存在您的本地文件系统中。

### 🚀 如何使用

1. 在 VS Code 或 Cursor 中打开您的项目文件夹。
2. 按 `Cmd + Shift + P` (或 `Ctrl + Shift + P`) 输入 **`Maestro: Initialize Project`**，一键生成标准的方法论文档骨架。
3. 在 Composer 或 Agent 中，让 AI 根据脚手架要求在 `docs/prds` 编写需求，并在 `docs/ai2ai/tasks/` 中进行迭代任务拆分。
4. 按 `Cmd + Shift + P` 输入 **`Maestro: Open Acceptance Desk`** 呼出验收工作台，以浸入式体验来验收和 Check 您的 AI 产出！

---
*Built with ❤️ for the AI Coding Era.*
