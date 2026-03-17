import * as vscode from 'vscode';

/**
 * 切换 markdown 任务文件中的 checkbox 状态
 * @param uri 文件的 Uri
 * @param lineNumber 1-based 行号
 */
export async function toggleCheckbox(uri: vscode.Uri, lineNumber: number): Promise<void> {
  const content = Buffer.from(await vscode.workspace.fs.readFile(uri)).toString('utf-8');
  const lines = content.split('\n');
  
  // lineNumber 是 1-based，转换为 0-based 数组索引
  const lineIndex = lineNumber - 1;
  if (lineIndex < 0 || lineIndex >= lines.length) {
    return;
  }
  
  const targetLine = lines[lineIndex];
  // 匹配 "- [ ]" 或 "- [x]" 并进行反转
  const match = targetLine.match(/^(- \[\s*)([ x])(\s*\] .*)$/);
  
  if (match) {
    const currentState = match[2];
    const newState = currentState === 'x' ? ' ' : 'x';
    lines[lineIndex] = match[1] + newState + match[3];
    
    // 写回文件
    const newContent = lines.join('\n');
    await vscode.workspace.fs.writeFile(uri, Buffer.from(newContent, 'utf-8'));
  }
}
