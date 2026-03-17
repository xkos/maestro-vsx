/**
 * TaskTreeProvider — 任务列表树
 *
 * 解析 docs/ai2ai/tasks/ 下的 task 文件，在侧边栏展示任务列表。
 * 支持点击跳转到 task 文件对应行。
 */

import * as vscode from 'vscode';
import { TaskFile, TaskItem } from '../types';
import { scanTaskFiles } from '../core/markdownParser';

/** 树节点类型：可以是 TaskFile（迭代）或 TaskItem（单个任务） */
type TaskTreeNode = TaskFile | TaskItem;

function isTaskFile(node: TaskTreeNode): node is TaskFile {
  return 'tasks' in node;
}

export class TaskTreeProvider implements vscode.TreeDataProvider<TaskTreeNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TaskTreeNode | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private taskFiles: TaskFile[] = [];

  constructor(private readonly workspaceRoot: vscode.Uri) {}

  /** 触发树刷新 */
  refresh(): void {
    this.taskFiles = [];
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TaskTreeNode): vscode.TreeItem {
    if (isTaskFile(element)) {
      // 迭代节点
      const completedCount = element.tasks.filter(t => t.completed).length;
      const totalCount = element.tasks.length;
      const label = `${element.name}`;
      const description = `${element.status} (${completedCount}/${totalCount})`;

      const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.Expanded);
      item.description = description;
      item.iconPath = element.status.includes('已关闭')
        ? new vscode.ThemeIcon('check-all')
        : new vscode.ThemeIcon('tasklist');
      item.contextValue = 'maestro-task-file';
      item.command = {
        command: 'vscode.open',
        title: 'Open Task File',
        arguments: [element.uri],
      };
      return item;
    } else {
      // 单个任务节点
      const item = new vscode.TreeItem(
        `${element.id}: ${element.description}`,
        vscode.TreeItemCollapsibleState.None
      );
      item.description = element.verification || '';
      item.iconPath = element.completed
        ? new vscode.ThemeIcon('pass-filled')
        : new vscode.ThemeIcon('circle-large-outline');
      item.contextValue = 'maestro-task-item';
      item.command = {
        command: 'vscode.open',
        title: 'Go to Task',
        arguments: [
          element.sourceUri,
          { selection: new vscode.Range(element.line - 1, 0, element.line - 1, 0) },
        ],
      };
      return item;
    }
  }

  async getChildren(element?: TaskTreeNode): Promise<TaskTreeNode[]> {
    if (!element) {
      // 根节点：返回所有 task 文件
      if (this.taskFiles.length === 0) {
        this.taskFiles = await scanTaskFiles(this.workspaceRoot);
      }
      return this.taskFiles;
    }
    if (isTaskFile(element)) {
      return element.tasks;
    }
    return [];
  }
}
