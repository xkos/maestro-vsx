# AI 经验库（AI 维护）

> 记录实现过程中的技术微决策、踩坑经验和 Boundary 变更。
> 避免跨 session 重复讨论或重复踩坑。
> 最后更新：2026-03-12

---

## 记录类型

| 前缀 | 类型 | 记录什么 |
|------|------|---------|
| D | 技术微决策 | 设计文档未覆盖的实现选型（选了什么、为什么） |
| L | 踩坑记录 | 技术限制、意外行为、绕过方案（坑是什么、怎么绕的） |
| B | Boundary 变更 | AI 决策边界规则的新增/调整（改了什么、为什么改） |

---

## 记录

### D001: 文档即指令，不运行时修改 IDE 配置
- 日期：2026-03-12
- 决策：Maestro 不在运行时动态修改 `.cursorrules` 或其他 IDE 配置文件来"控制" AI。取而代之的是：(1) 初始化时一次性帮用户生成 rules 声明，引导 AI 按文档体系工作；(2) 运行时只管理 `docs/` 下的文档和任务。
- 原因：直接改写 `.cursorrules` 会造成 git diff 污染、与用户手动编辑冲突、且耦合特定 IDE。文档本身就是 AI 的指令，把文档维护好比"注入意图"更本质。
- 替代方案（已否决）：Gemini 方案的 IntentInjector——动态向 `.cursorrules` 追加/覆盖 Maestro 指令段落。

### D002: 极简架构——只读视图 + 少量操作
- 日期：2026-03-12
- 决策：Maestro 定位为轻量级结构化视图插件，不做实时监听（FileWatcher）、不做双向同步、不做复杂状态管理。用户的主要协作在 Cursor Agent/Plan 对话中完成，Maestro 只负责"看"和"导航"。
- 原因：用户实际工作流是在 Cursor 对话里让 AI 改文件，然后切回 Maestro 看结果。手动刷新完全够用，过度设计反而增加维护成本和 bug 风险。
- 架构变更：从三层（Infrastructure → Service → Presentation）简化为两层（Core + Providers），去掉 Service 层和 FileWatcher。

### D003: TreeView 优先，Webview 后补
- 日期：2026-03-12
- 决策：MVP 阶段全部使用 VS Code 原生 TreeView，不引入 React/Webview。仅当需要仪表盘等复杂可视化时才引入。
- 原因：TreeView 足以展示文档树和任务列表，原生体验好，零额外构建步骤，开发快。

### D004: 引入 React 与 esbuild 构建 Webview
- 日期：2026-03-17
- 决策：在插件端使用 esbuild 多入口，将 React 及其依赖打包成独立浏览器端 `webview.js`。引入 Webview 面板支持复杂交互。
- 原因：原生 JS 拼接复杂交互页面（如交互式 Checkbox 数据流联动）可维护性极差。

### L001: Webview 的 retainContextWhenHidden 会导致数据死锁
- 日期：2026-03-17
- 避坑：不依赖 Webview 宿主的强制驻留（该方案容易使 React 在隐藏期间错失数据，导致重新渲染为“暂无数据”）。改用每次 Tab 重新聚焦时，React 挂载并主动发出 `READY` 通信信号来强制同步最新后端层 JSON 数据的单向数据流。

### L002: vsce 打包对 @types peer 依赖过度审查报错
- 日期：2026-03-17
- 避坑：由于插件构建阶段使用的是 `esbuild --bundle`，运行时根本不需要外置 `node_modules`。因此面对严苛的 `@types` 等 peer dependency 缺失报错时，无需处理包问题，直接使用 `vsce package --no-dependencies` 指令极速打包。
