/**
 * markdownParser — Markdown 轻量解析器
 *
 * 针对 task 文件的特定格式，提取任务列表和元信息。
 * 不引入重型 AST 库，使用正则匹配。
 */

import * as vscode from 'vscode';
import { TaskFile, TaskItem } from '../types';

/**
 * 解析 task 文件，提取元信息和任务列表。
 */
export async function parseTaskFile(uri: vscode.Uri): Promise<TaskFile> {
  const content = Buffer.from(await vscode.workspace.fs.readFile(uri)).toString('utf-8');
  const lines = content.split('\n');

  // 提取文件名（不含扩展名）
  const fileName = uri.path.split('/').pop()?.replace('.md', '') || '';

  // 提取标题（第一个 # 开头的行）
  const titleLine = lines.find(l => /^# /.test(l));
  const title = titleLine?.replace(/^# /, '').trim() || fileName;

  // 提取状态
  const statusLine = lines.find(l => /^> 状态：/.test(l));
  const status = statusLine?.replace(/^> 状态：/, '').trim() || '未知';

  // 提取任务列表
  const tasks: TaskItem[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 匹配 "- [ ] (可选ID:) 描述" 或 "- [x] 描述"
    const match = line.match(/^\s*- \[([ x])\]\s+(?:([A-Za-z0-9-]+):\s+)?(.+)$/);
    if (match) {
      const completed = match[1] === 'x';
      const id = match[2] || `C-${i}`; // 如果没有 ID 就生成个临时的，方便列表渲染
      const description = match[3];

      // 查找下一行的验证标准
      let verification: string | undefined;
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const verMatch = nextLine.match(/^\s+- 验证：(.+)$/);
        if (verMatch) {
          verification = verMatch[1];
        }
      }

      tasks.push({
        id,
        description,
        completed,
        verification,
        sourceUri: uri,
        line: i + 1, // 1-based
      });
    }
  }

  return { name: fileName, title, status, tasks, uri };
}

/**
 * 扫描 tasks 目录，解析所有 task 文件。
 */
export async function scanTaskFiles(rootUri: vscode.Uri): Promise<TaskFile[]> {
  const tasksDir = vscode.Uri.joinPath(rootUri, 'docs/ai2ai/tasks');
  try {
    const entries = await vscode.workspace.fs.readDirectory(tasksDir);
    const mdFiles = entries
      .filter(([name, type]) => type === vscode.FileType.File && name.endsWith('.md'))
      .sort(([a], [b]) => a.localeCompare(b));

    const taskFiles: TaskFile[] = [];
    for (const [name] of mdFiles) {
      const fileUri = vscode.Uri.joinPath(tasksDir, name);
      const taskFile = await parseTaskFile(fileUri);
      taskFiles.push(taskFile);
    }
    return taskFiles;
  } catch {
    return [];
  }
}
