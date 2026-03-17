/**
 * docScanner — 文档扫描器
 *
 * 扫描工作区中的文档文件，按 me2ai / ai2ai 分组返回结构化的文档树。
 */

import * as vscode from 'vscode';
import { DocNode, DocGroup, DocCategory } from '../types';

/** 文档目录映射配置 */
interface ScanTarget {
  /** 相对于工作区根目录的路径 */
  relativePath: string;
  /** 显示名称 */
  label: string;
  /** 所属分组 */
  group: DocGroup;
  /** 文档子类型 */
  category: DocCategory;
}

const SCAN_TARGETS: ScanTarget[] = [
  { relativePath: 'docs/prds', label: 'PRDs', group: 'me2ai', category: 'prd' },
  { relativePath: 'docs/tech', label: 'Tech', group: 'me2ai', category: 'tech' },
  { relativePath: '.cursor/rules', label: 'Rules', group: 'me2ai', category: 'rules' },
  { relativePath: 'docs/ai2ai/tasks', label: 'Tasks', group: 'ai2ai', category: 'ai2ai-tasks' },
  { relativePath: 'docs/ai2ai/iterations', label: 'Iterations', group: 'ai2ai', category: 'ai2ai-iterations' },
];

/** 单独的文件（非目录） */
interface SingleFileTarget {
  relativePath: string;
  label: string;
  group: DocGroup;
  category: DocCategory;
}

const SINGLE_FILES: SingleFileTarget[] = [
  { relativePath: 'AGENTS.md', label: 'AGENTS.md', group: 'me2ai', category: 'agents' },
  { relativePath: 'docs/ai2ai/status.md', label: 'status.md', group: 'ai2ai', category: 'ai2ai-status' },
  { relativePath: 'docs/ai2ai/decisions.md', label: 'decisions.md', group: 'ai2ai', category: 'ai2ai-decisions' },
];

/**
 * 扫描工作区文档，返回按 me2ai / ai2ai 分组的文档树。
 */
export async function scanDocs(rootUri: vscode.Uri): Promise<{ me2ai: DocNode; ai2ai: DocNode }> {
  const me2aiChildren: DocNode[] = [];
  const ai2aiChildren: DocNode[] = [];

  // 扫描目录
  for (const target of SCAN_TARGETS) {
    const dirUri = vscode.Uri.joinPath(rootUri, target.relativePath);
    const node = await scanDirectory(dirUri, target.label, target.group, target.category);
    if (node) {
      if (target.group === 'me2ai') {
        me2aiChildren.push(node);
      } else {
        ai2aiChildren.push(node);
      }
    }
  }

  // 扫描单独文件
  for (const file of SINGLE_FILES) {
    const fileUri = vscode.Uri.joinPath(rootUri, file.relativePath);
    try {
      await vscode.workspace.fs.stat(fileUri);
      const node: DocNode = {
        label: file.label,
        uri: fileUri,
        group: file.group,
        category: file.category,
        isDirectory: false,
      };
      if (file.group === 'me2ai') {
        me2aiChildren.push(node);
      } else {
        ai2aiChildren.push(node);
      }
    } catch {
      // 文件不存在，跳过
    }
  }

  return {
    me2ai: {
      label: 'me2ai',
      group: 'me2ai',
      isDirectory: true,
      children: me2aiChildren,
    },
    ai2ai: {
      label: 'ai2ai',
      group: 'ai2ai',
      isDirectory: true,
      children: ai2aiChildren,
    },
  };
}

/**
 * 扫描单个目录，返回包含子文件的目录节点。
 * 如果目录不存在，返回 undefined。
 */
async function scanDirectory(
  dirUri: vscode.Uri,
  label: string,
  group: DocGroup,
  category: DocCategory
): Promise<DocNode | undefined> {
  try {
    const entries = await vscode.workspace.fs.readDirectory(dirUri);
    const children: DocNode[] = entries
      .filter(([name, type]) => type === vscode.FileType.File && (name.endsWith('.md') || name.endsWith('.mdc')))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name]) => ({
        label: name,
        uri: vscode.Uri.joinPath(dirUri, name),
        group,
        category,
        isDirectory: false,
      }));

    return {
      label,
      group,
      category,
      isDirectory: true,
      children,
    };
  } catch {
    // 目录不存在
    return undefined;
  }
}
