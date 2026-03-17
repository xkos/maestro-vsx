# 任务 002: 验收工作台与 Checklist 双向绑定 (Acceptance Desk)

> 状态：✅ 已关闭
> 配对迭代：[iterations/002-acceptance-desk.md](../iterations/002-acceptance-desk.md)

## 迭代目标
将测试验证工作流（打勾 Checklist）实现成沉浸式、双向绑定的 Webview 界面。彻底解决非专业开发者的验收痛点，实现从“看代码找勾选框”到在 UI 面板上一键验收。

## 任务分解

- [x] T1: 升级 Markdown Parser 支持抽象的验收清单
  - 验证：能够正确匹配 `## 验收清单` 格式及 `[ ]`。
- [x] T2: 实现 Markdown Writer (`src/core/markdownWriter.ts`)
  - 验证：能根据文件 URI 与绝对行号，反写替换文件里的 `[ ]` 与 `[x]` 并落盘。
- [x] T3: 创建 React Webview 应用 (`src/webview/App.tsx`)
  - 验证：成功引入 React、执行 esbuild 多入口构建，渲染漂亮的工作台 UI。
- [x] T4: 搭建 Webview Panel 的宿主管理与 IPC 链路 (`src/panels/MaestroPanel.ts`)
  - 验证：发送 `TOGGLE_CHECKBOX` 能调用后端的 writer 写文件。
- [x] T5: 实现基于 `vscode.workspace.createFileSystemWatcher` 的单向数据流
  - 验证：无论后端文件怎么修改，保存瞬间能够触发 watch 推送最新 JSON 状态给 React 重绘。
- [x] T6: 解决生命周期重新挂载导致的数据清空问题
  - 验证：不使用 VSCode 的强制驻留，而由 React 组件通过 `READY` signal 请求最新数据。
