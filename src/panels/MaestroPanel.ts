import * as vscode from 'vscode';
import { scanTaskFiles } from '../core/markdownParser';
import { toggleCheckbox } from '../core/markdownWriter';
import { TaskFile } from '../types';

export class MaestroPanel {
  public static currentPanel: MaestroPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _watcher: vscode.FileSystemWatcher | undefined;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update();
    this._setupFileWatcher();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case 'READY':
            await this._updateStateOny();
            break;
          case 'TOGGLE_CHECKBOX':
            const { uriPath, line } = message.payload;
            const uri = vscode.Uri.file(uriPath);
            await toggleCheckbox(uri, line);
            // watcher 会自动捕获变化并广播刷新
            break;
        }
      },
      null,
      this._disposables
    );
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (MaestroPanel.currentPanel) {
      MaestroPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'maestroAcceptanceDesk',
      'Maestro 验收工作台',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
      }
    );

    MaestroPanel.currentPanel = new MaestroPanel(panel, extensionUri);
  }

  public dispose() {
    MaestroPanel.currentPanel = undefined;
    this._panel.dispose();
    this._watcher?.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _setupFileWatcher() {
    // 监听 workspace 所有的 ai2ai task 文件
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) return;

    const pattern = new vscode.RelativePattern(
      workspaceFolders[0],
      'docs/ai2ai/tasks/*.md'
    );
    this._watcher = vscode.workspace.createFileSystemWatcher(pattern);

    // 文件变化时，只推送新状态，不要重新加载整个 Webview HTML
    const refresh = () => this._updateStateOny();

    this._watcher.onDidChange(refresh);
    this._watcher.onDidCreate(refresh);
    this._watcher.onDidDelete(refresh);

    this._disposables.push(this._watcher);
  }

  private async _updateStateOny() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const taskFiles = await scanTaskFiles(workspaceFolders[0].uri);
      this._panel.webview.postMessage({ type: 'UPDATE_STATE', payload: taskFiles });
    }
  }

  private async _update() {
    const webview = this._panel.webview;
    webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js')
    );

    // 使用 vscode 的 CSS 变量
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Maestro Acceptance Desk</title>
        <style>
          body {
            padding: 20px;
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-editor-background);
            font-family: var(--vscode-font-family);
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}
