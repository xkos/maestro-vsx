import React, { useEffect, useState } from 'react';

// VS Code API
declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

export default function App() {
  const [taskFiles, setTaskFiles] = useState<any[]>([]);

  useEffect(() => {
    // 监听来自 extension 的消息
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'UPDATE_STATE') {
        setTaskFiles(message.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // 通知 Extension 前端已经挂载，请求最新数据
    vscode.postMessage({ type: 'READY' });
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleToggle = (uriPath: string, line: number) => {
    vscode.postMessage({
      type: 'TOGGLE_CHECKBOX',
      payload: { uriPath, line },
    });
    // Optimistic UI Update can be added here if needed, but since we have a fast file watcher, 
    // it will re-render automatically shortly after writing to disk.
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ marginBottom: '4px', color: 'var(--vscode-editor-foreground)' }}>验收工作台 (Acceptance Desk)</h2>
        <p style={{ marginTop: 0, fontSize: '13px', opacity: 0.7 }}>点击 Checkbox 将自动同步更改至 Markdown 源码</p>
      </header>

      {taskFiles.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.6, background: 'var(--vscode-editorWidget-background)', borderRadius: '6px' }}>
          <h3>暂无任务数据或解析中...</h3>
          <p>请确保 <code>docs/ai2ai/tasks/</code> 目录下有 Markdown 任务文件。</p>
        </div>
      ) : (
        taskFiles.map((file) => (
        <section 
          key={file.uri.path} 
          style={{ 
            background: 'var(--vscode-editorWidget-background)', 
            border: '1px solid var(--vscode-widget-border)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            padding: '12px 16px', 
            background: 'var(--vscode-editorGroupHeader-tabsBackground)',
            borderBottom: '1px solid var(--vscode-widget-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '14px' }}>{file.title}</h3>
            <span style={{ 
              fontSize: '12px', 
              padding: '2px 8px', 
              background: 'var(--vscode-badge-background)',
              color: 'var(--vscode-badge-foreground)',
              borderRadius: '12px'
            }}>
              {file.status}
            </span>
          </div>
          
          <div style={{ padding: '8px 16px' }}>
            {file.tasks.length === 0 ? (
              <p style={{ fontSize: '13px', opacity: 0.6 }}>暂无任务项</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {file.tasks.map((task: any) => (
                  <li 
                    key={task.line} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      padding: '8px 0',
                      borderBottom: '1px solid var(--vscode-editorGroupHeader-tabsBackground)',
                      gap: '12px'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => handleToggle(file.uri.path, task.line)}
                      style={{ marginTop: '4px', cursor: 'pointer', accentColor: 'var(--vscode-button-background)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '13px', 
                        lineHeight: 1.5,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        opacity: task.completed ? 0.6 : 1
                      }}>
                        <strong>{task.id}:</strong> {task.description}
                      </div>
                      {task.verification && (
                        <div style={{ 
                          fontSize: '12px', 
                          marginTop: '4px', 
                          opacity: 0.7,
                          padding: '4px 8px',
                          background: 'var(--vscode-textCodeBlock-background)',
                          borderRadius: '4px'
                        }}>
                          🎯 验证: {task.verification}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        ))
      )}
    </div>
  );
}
