# 迭代 002: 验收工作台与 Checklist 双向绑定 (Acceptance Desk)

## 迭代目标
实现沉浸式的验收工作台（Webview 面板），将散落的任务 Checklist 转换为可交互的、与 Markdown 文件底层实时双向同步的 React UI 组件。

## 完成内容
- 构建了 `MaestroPanel.ts` 来承载 VSCode Webview 面板。
- 配置了 esbuild 支持了 `react` 打包管线。
- 增加了 `markdownWriter.ts` 完成对 Task Markdown 绝对行的回写。
- 建立了基于 `FileSystemWatcher` 和 IPC `READY`/`UPDATE_STATE` 的完美单向响应式数据流。

## 未完成/遗留
- 面板上的 ❌(Fail) 失败反馈循环和文案自动注入暂未实现（规划进后续迭代）。
- PRD 规划中的“智能合并上个迭代继承清单”需配合整体上下文构建，留待后续结合 ContextBuilder 功能一起完成。

## 影响范围（回归影响）
- 修改了 `package.json` 的 contribute 项（增加了打开验收面板的命令和图标菜单）。
- 修改了 `extension.ts` 添加了命令绑定。
- （未破坏 V1 的 DocTreeProvider 与 TaskTreeProvider 功能，彼此隔离）。

## 可测试项
1. **测试单向文件反写**
   - 步骤：在 Maestro 面板中点击任意具有状态的任务项，勾选 Checkbox。
   - 预期结果：对应任务源 `*.md` 文件的对应行中的 `[ ]` 瞬间变为 `[x]`，无延迟。
2. **测试外部修改响应 (单向数据流)**
   - 步骤：在 VS Code 内手动修改源 `*.md` 文件的 Checklist 状态为 `[x]` 或 `[ ]`，随后保存。
   - 预期结果：右侧 Maestro 验收面板的 Checkbox 在毫秒级自动重绘、反映真实文件状态。
3. **测试 Tab 切换生命周期（READY 测试）**
   - 步骤：打开验收面板后，切换到另外的文件 Tab 编辑，再切换回验收面板 Tab。
   - 预期结果：面板不应该显示“暂无数据”，而是立刻刷新回当前最新渲染结果。

## 测试结果
- [x] 测试单向文件反写：通过
- [x] 测试外部修改响应：通过 
- [x] 测试 Tab 切换生命周期：通过
