/**
 * DocTreeProvider — 文档导航树
 *
 * 将工作区文档按 me2ai / ai2ai 分组展示在侧边栏 TreeView 中。
 * 使用 vscode.window.createTreeView() 创建，支持 onDidChangeVisibility 自动刷新。
 */

import * as vscode from 'vscode';
import { DocNode } from '../types';
import { scanDocs } from '../core/docScanner';

export class DocTreeProvider implements vscode.TreeDataProvider<DocNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<DocNode | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private rootNodes: DocNode[] = [];

  constructor(private readonly workspaceRoot: vscode.Uri) {}

  /** 触发树刷新 */
  refresh(): void {
    this.rootNodes = [];
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DocNode): vscode.TreeItem {
    const item = new vscode.TreeItem(
      element.label,
      element.isDirectory
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None
    );

    if (!element.isDirectory && element.uri) {
      item.command = {
        command: 'vscode.open',
        title: 'Open Document',
        arguments: [element.uri],
      };
      item.resourceUri = element.uri;
      item.contextValue = 'maestro-doc-file';
    } else {
      item.contextValue = 'maestro-doc-folder';
    }

    // 图标
    if (element.isDirectory) {
      if (element.label === 'me2ai') {
        item.iconPath = new vscode.ThemeIcon('person');
      } else if (element.label === 'ai2ai') {
        item.iconPath = new vscode.ThemeIcon('robot');
      } else {
        item.iconPath = new vscode.ThemeIcon('folder');
      }
    } else {
      item.iconPath = new vscode.ThemeIcon('file');
    }

    return item;
  }

  async getChildren(element?: DocNode): Promise<DocNode[]> {
    if (!element) {
      // 根节点：返回 me2ai 和 ai2ai 两个分组
      if (this.rootNodes.length === 0) {
        const { me2ai, ai2ai } = await scanDocs(this.workspaceRoot);
        this.rootNodes = [me2ai, ai2ai];
      }
      return this.rootNodes;
    }
    return element.children || [];
  }
}
