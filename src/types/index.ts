/**
 * Maestro 类型定义
 *
 * 定义文档树节点、任务等核心数据结构。
 */

import * as vscode from 'vscode';

/** 文档分组类型：me2ai（人维护）或 ai2ai（AI 维护） */
export type DocGroup = 'me2ai' | 'ai2ai';

/** 文档子类型 */
export type DocCategory = 'prd' | 'tech' | 'rules' | 'agents' | 'ai2ai-status' | 'ai2ai-tasks' | 'ai2ai-iterations' | 'ai2ai-decisions';

/** 文档树节点 */
export interface DocNode {
  /** 显示名称 */
  label: string;
  /** 文件的 URI（目录节点为 undefined） */
  uri?: vscode.Uri;
  /** 所属分组 */
  group: DocGroup;
  /** 文档子类型 */
  category?: DocCategory;
  /** 子节点（目录节点） */
  children?: DocNode[];
  /** 是否为目录 */
  isDirectory: boolean;
}

/** task 文件中解析出的单个任务 */
export interface TaskItem {
  /** 任务 ID，如 "T1" */
  id: string;
  /** 任务描述 */
  description: string;
  /** 是否已完成 */
  completed: boolean;
  /** 验证标准 */
  verification?: string;
  /** 所在 task 文件的 URI */
  sourceUri: vscode.Uri;
  /** 在文件中的行号（用于跳转） */
  line: number;
}

/** task 文件的元信息 */
export interface TaskFile {
  /** 文件名，如 "001-skeleton" */
  name: string;
  /** 标题 */
  title: string;
  /** 状态标记 */
  status: '🔨 进行中' | '✅ 已关闭' | string;
  /** 任务列表 */
  tasks: TaskItem[];
  /** 文件 URI */
  uri: vscode.Uri;
}
