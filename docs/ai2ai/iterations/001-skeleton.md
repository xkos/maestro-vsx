# 迭代 001: 插件骨架 + 项目初始化命令

> 配对任务：[tasks/001-skeleton.md](../tasks/001-skeleton.md)
> 完成日期：2026-03-12

## 目标

搭建 Maestro 插件的最小可运行骨架。

## 完成内容

- 插件项目骨架：package.json、tsconfig.json、esbuild 构建
- 目录结构：src/core/、src/providers/、src/types/
- 侧边栏注册：Activity Bar 图标（自定义 SVG）+ maestro-docs 和 maestro-tasks 两个视图
- 项目初始化命令：`maestro.initializeProject`，创建文档目录和骨架文件
- DocTreeProvider：扫描 docs/ 目录，按 me2ai/ai2ai 分组展示，支持点击打开文件
- TaskTreeProvider：解析 task 文件，展示任务列表、完成状态、验证标准，支持点击跳转
- 刷新机制：onDidChangeVisibility 自动刷新 + 手动刷新按钮 + 命令刷新
- 调试配置：.vscode/launch.json + tasks.json

## 未完成 / 遗留

无

## 回归影响

首次迭代，无回归风险。

## 可测试项

1. **F5 启动调试**
   - 操作：按 F5 启动 Extension Development Host
   - 预期：新窗口打开，Activity Bar 出现 Maestro 图标

2. **侧边栏视图**
   - 操作：点击 Activity Bar 的 Maestro 图标
   - 预期：侧边栏显示 "Docs" 和 "Tasks" 两个视图，Docs 视图按 me2ai/ai2ai 分组展示文档

3. **任务列表**
   - 操作：查看 Tasks 视图
   - 预期：显示 001-skeleton 迭代，展开后显示 T1-T8 任务及其完成状态

4. **点击打开文件**
   - 操作：在 Docs 视图中点击任意文档
   - 预期：在编辑器中打开该文件

5. **点击跳转任务**
   - 操作：在 Tasks 视图中点击某个任务
   - 预期：打开对应 task 文件并跳转到该任务所在行

6. **初始化命令**
   - 操作：打开一个空工作区，Ctrl+Shift+P 执行 "Maestro: Initialize Project"
   - 预期：创建 docs/ 目录结构和骨架文件，弹出成功提示

7. **刷新**
   - 操作：在 Cursor 对话中让 AI 修改某个 task 文件，然后切回 Maestro 面板
   - 预期：视图自动刷新，显示最新内容

## 测试结果

（由人工填写）
