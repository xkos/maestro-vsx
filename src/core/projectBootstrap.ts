/**
 * projectBootstrap — 项目初始化
 *
 * 在当前工作区创建 Maestro 文档体系的目录结构和骨架文件。
 * 已存在的文件不会被覆盖，保证安全。
 */

import * as vscode from 'vscode';

/** 需要创建的目录列表 */
const DIRECTORIES = [
  'docs/prds',
  'docs/tech',
  'docs/ai2ai',
  'docs/ai2ai/tasks',
  'docs/ai2ai/iterations',
  '.cursor/rules',
];

/** 骨架文件：路径 → 内容 */
const SKELETON_FILES: Record<string, string> = {
  'AGENTS.md': `# {project}

（一句话项目描述）

## 项目结构

- \`docs/prds/\` — 产品需求文档（me2ai：人维护）
- \`docs/tech/\` — 技术文档（me2ai：人维护）
- \`docs/ai2ai/\` — 项目状态与迭代记录（ai2ai：AI 维护，人审核）

## 架构概览

（项目的架构简述）

## 全局规范

（项目的编码规范、依赖管理规则等）

## AI 决策边界

### Always do（直接执行）

- 遵循本文件和 rules/ 中的编码规范
- 更新 ai2ai 文档
- 运行已有的测试和 lint
- 按 task 文件中已审核的任务执行实现

### Ask first（说明意图，等确认）

- 新增 task 中未提及的外部依赖
- 改变已有 API 签名
- 删除或重命名已有文件
- 重构涉及超过 3 个文件的变更
- 偏离当前 task 文件中定义的任务范围

### Never do（禁止）

- 删除或覆盖 me2ai 文档的内容
`,

  'docs/ai2ai/status.md': `# 项目状态（AI 维护）

> 本文档由 AI 在每次迭代结束后更新，反映项目的实际状态。
> 最后更新：{date}

## 当前阶段

（待填写）

## 当前迭代

- 当前活跃：无（待规划第一个迭代）

## 模块就绪度

（待填写）

## 已知问题 / 技术债

（初始为空，随迭代积累）

## 下一步建议

（待填写）
`,

  'docs/ai2ai/decisions.md': `# AI 经验库（AI 维护）

> 记录实现过程中的技术微决策、踩坑经验和 Boundary 变更。
> 最后更新：{date}

## 记录

（随项目推进积累）
`,

  '.cursor/rules/ai-boundary-framework.mdc': `---
description: AI 决策边界框架 — 定义 AI 行为的三级决策体系
alwaysApply: true
---

# AI 决策边界框架

> 定义 AI 行为的三级决策体系和边界迭代机制。

## 三级决策体系

所有 AI 的行为决策分为三级：

| 级别 | 含义 | AI 行为 |
|------|------|---------|
| Always do | 确定安全的操作 | 直接执行，不需要确认 |
| Ask first | 有副作用或不确定的操作 | 说明意图和影响，等人确认后再执行 |
| Never do | 硬性禁止的操作 | 绝对不做，即使用户要求也应提醒风险 |

## 边界的来源

项目的具体 Boundary 规则定义在 \`AGENTS.md\` 的"AI 决策边界"章节中。

## 边界的迭代机制

Boundary 不是一次性定义的，而是随项目推进持续演化：

- AI 做了不该做的事 → 补充 Ask first 或 Never do
- AI 反复询问不需要问的事 → 提升为 Always do
- decisions.md 中的踩坑记录具有通用性 → 升级为 Boundary 规则

当 Boundary 规则变更时，在 \`docs/ai2ai/decisions.md\` 中记录变更原因。
`,

  '.cursor/rules/ai2ai-maintenance.mdc': `---
description: ai2ai 文档维护规则 — AI 在每次迭代中如何维护项目状态文档
alwaysApply: true
---

# ai2ai 文档维护规则

> AI 在每次迭代中如何维护项目状态文档。

## 什么是 ai2ai

\`docs/ai2ai/\` 是 AI 自维护的项目状态文档，与人维护的 me2ai 文档互补。

- me2ai = "应该是什么样"（需求、架构、规范）
- ai2ai = "现在实际是什么样"（状态、进度、经验）

## 文件结构

- \`docs/ai2ai/status.md\` — 全局状态快照（覆盖更新）
- \`docs/ai2ai/decisions.md\` — 经验库（只追加）
- \`docs/ai2ai/tasks/NNN-xxx.md\` — 迭代任务分解（事前计划）
- \`docs/ai2ai/iterations/NNN-xxx.md\` — 迭代归档（事后总结）

## 迭代工作流

1. 迭代开始前：创建 task 文件，分解任务，每个任务有验证标准
2. 迭代进行中：完成任务后将 \`[ ]\` 改为 \`[x]\`
3. 迭代结束后：task 标记已关闭，新建 iteration 归档，更新 status.md

## 安全护栏

- 连续 3 次尝试相同修复未成功时，停止并报告，等待人工介入
- 单次迭代修改文件超过 10 个时，暂停确认是否需要拆分

## 模块状态标记

| 标记 | 含义 |
|------|------|
| ✅ 可用 | 功能已实现且可正常使用 |
| 🔨 部分 | 部分功能已实现 |
| ❌ 未开始 | 尚未创建 |
`,

  '.cursor/rules/project-methodology.mdc': `---
description: 项目从零到一方法论 — 涵盖需求分析到实现的全流程指导
alwaysApply: false
---

# 项目从零到一方法论

> 适用于从想法阶段到可执行架构的全过程。按需引用。

## 总体流程

阶段一：需求分析 → 阶段二：设计决策 → 阶段三：技术调研 → 阶段四：UI 与交互设计 → 阶段五：架构设计 → 阶段六：文档体系与代码骨架 → 阶段七：开始实现

## 文档职责划分

| 类别 | 位置 | 维护者 | 内容 |
|------|------|--------|------|
| me2ai | docs/prds/, docs/tech/, AGENTS.md, rules/ | 人 | 需求、架构、编码规范 |
| ai2ai | docs/ai2ai/ | AI（人审核） | 项目状态、迭代记录、经验库 |

## 迭代原则

- 首次迭代必须解决：框架搭建、环境问题、从开发到测试的流程
- 每次迭代 AI 必须提供可测试的内容
- 人的角色：定规则 + 审任务 + 跑测试
- AI 的角色：写代码 + 维护 ai2ai + 执行已审核的 task
`,

  '.cursor/rules/session-context.mdc': `---
description: 新 Session 项目上下文模板 — 帮助新会话快速了解项目全貌
alwaysApply: false
---

# 新 Session 项目上下文模板

> 帮助新会话快速了解项目全貌。按需引用。

当需要在新 Session 中快速建立项目上下文时，使用以下模板。

## 模板

请先阅读以下项目文档建立上下文，然后完成我的需求。

### 产品需求（了解做什么）
- docs/prds/overview.md — 产品定位、需求域、演进路线、设计原则
- docs/prds/ui-design.md — UI 与交互设计（如存在）

### 技术实现（了解怎么做）
- docs/tech/architecture.md — 整体架构、分层、模块划分

### 编码规范（了解约束）
- AGENTS.md — 项目结构、模块职责、AI 决策边界

### 项目状态（了解现状）
- docs/ai2ai/status.md — 当前模块就绪度和迭代进度
- docs/ai2ai/decisions.md — 已有的技术决策和踩坑记录

读完后请简要确认你的理解，然后开始处理我的需求。
`,
};

/**
 * 在工作区根目录下初始化 Maestro 文档体系。
 * 已存在的文件不会被覆盖。
 */
export async function bootstrapProject(): Promise<{ created: string[]; skipped: string[] }> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error('请先打开一个工作区文件夹');
  }

  const rootUri = workspaceFolders[0].uri;
  const created: string[] = [];
  const skipped: string[] = [];
  const today = new Date().toISOString().split('T')[0];

  // 创建目录
  for (const dir of DIRECTORIES) {
    const dirUri = vscode.Uri.joinPath(rootUri, dir);
    try {
      await vscode.workspace.fs.createDirectory(dirUri);
    } catch {
      // 目录已存在，忽略
    }
  }

  // 创建骨架文件（不覆盖已有文件）
  for (const [filePath, template] of Object.entries(SKELETON_FILES)) {
    const fileUri = vscode.Uri.joinPath(rootUri, filePath);
    try {
      await vscode.workspace.fs.stat(fileUri);
      // 文件已存在
      skipped.push(filePath);
    } catch {
      // 文件不存在，创建
      const content = template
        .replace(/\{date\}/g, today)
        .replace(/\{project\}/g, vscode.workspace.name || 'project');
      await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf-8'));
      created.push(filePath);
    }
  }

  return { created, skipped };
}
