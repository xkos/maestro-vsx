/**
 * Maestro 插件入口
 *
 * 注册命令、视图，初始化核心功能。
 */

import * as vscode from 'vscode';
import { DocTreeProvider } from './providers/docTreeProvider';
import { TaskTreeProvider } from './providers/taskTreeProvider';
import { bootstrapProject } from './core/projectBootstrap';

export function activate(context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return;
  }

  const rootUri = workspaceFolders[0].uri;

  // --- 注册 TreeView Providers ---

  const docTreeProvider = new DocTreeProvider(rootUri);
  const taskTreeProvider = new TaskTreeProvider(rootUri);

  const docTreeView = vscode.window.createTreeView('maestro-docs', {
    treeDataProvider: docTreeProvider,
    showCollapseAll: true,
  });

  const taskTreeView = vscode.window.createTreeView('maestro-tasks', {
    treeDataProvider: taskTreeProvider,
    showCollapseAll: true,
  });

  // 切回面板时自动刷新
  docTreeView.onDidChangeVisibility(e => {
    if (e.visible) {
      docTreeProvider.refresh();
    }
  });

  taskTreeView.onDidChangeVisibility(e => {
    if (e.visible) {
      taskTreeProvider.refresh();
    }
  });

  // --- 注册命令 ---

  const initCmd = vscode.commands.registerCommand('maestro.initializeProject', async () => {
    try {
      const { created, skipped } = await bootstrapProject();
      if (created.length === 0) {
        vscode.window.showInformationMessage('Maestro: 所有文件已就绪，无需补充。');
      } else {
        const msg = created.length <= 3
          ? `Maestro: 已补充 ${created.join(', ')}`
          : `Maestro: 已补充 ${created.length} 个文件（${created.slice(0, 2).join(', ')} 等）`;
        vscode.window.showInformationMessage(msg);
      }
      docTreeProvider.refresh();
      taskTreeProvider.refresh();
    } catch (err) {
      vscode.window.showErrorMessage(`Maestro: 初始化失败 — ${err}`);
    }
  });

  const refreshCmd = vscode.commands.registerCommand('maestro.refresh', () => {
    docTreeProvider.refresh();
    taskTreeProvider.refresh();
  });

  // --- 推入 subscriptions ---

  context.subscriptions.push(docTreeView, taskTreeView, initCmd, refreshCmd);
}

export function deactivate() {}
