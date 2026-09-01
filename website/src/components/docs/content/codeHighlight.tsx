'use client';

import React from 'react';

const SHELL_COMMANDS = new Set([
  'git', 'npm', 'pnpm', 'npx', 'node', 'zenth', 'docker', 'winget', 'brew',
  'curl', 'sudo', 'cd', 'mkdir', 'cat', 'echo', 'chmod', 'export', 'cp',
  'mv', 'rm', 'yarn', 'tsx', 'bun', 'psql', 'ssh', 'sh', 'bash', 'apt'
]);

const KEYWORDS = new Set([
  'install', 'add', 'run', 'start', 'build', 'test', 'compose', 'up', 'down',
  'clone', 'push', 'pull', 'status', 'commit', 'checkout', 'branch', 'merge',
  'init', 'exec', 'select', 'from', 'where', 'insert', 'into', 'create',
  'table', 'update', 'delete', 'join', 'on', 'and', 'or', 'not', 'primary',
  'key', 'text', 'integer', 'boolean', 'default', 'cascade', 'references',
  'timestamptz', 'uuid', 'numeric', 'null', 'true', 'false', 'const', 'let',
  'var', 'function', 'return', 'import', 'type', 'interface', 'exists'
]);

export function renderHighlightedCode(code: string): React.ReactNode {
  const lines = code.split('\n');

  return lines.map((line, lineIdx) => {
    const trimmed = line.trimStart();

    // 1. Whole line comment
    if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('--')) {
      return (
        <div key={lineIdx} className="leading-relaxed">
          <span style={{ color: 'var(--syntax-comment)', fontStyle: 'italic' }}>
            {line}
          </span>
        </div>
      );
    }

    // 2. Tokenize line
    const tokenRegex = /(https?:\/\/[^\s]+|"[^"]*"|'[^']*'|(?:\s|^)(?:#|\/\/|--).*$|-[a-zA-Z0-9_.-]+|\b\d+(?:\.\d+)?\b|[a-zA-Z0-9_$-]+|[^\s\w]+|\s+)/g;
    const tokens: React.ReactNode[] = [];
    let match: RegExpExecArray | null;
    let tokenKey = 0;

    while ((match = tokenRegex.exec(line)) !== null) {
      const token = match[0];
      const trimmedToken = token.trim();
      const lower = trimmedToken.toLowerCase();

      if (!trimmedToken) {
        tokens.push(<span key={tokenKey++}>{token}</span>);
      } else if (trimmedToken.startsWith('#') || trimmedToken.startsWith('//') || trimmedToken.startsWith('--')) {
        tokens.push(
          <span key={tokenKey++} style={{ color: 'var(--syntax-comment)', fontStyle: 'italic' }}>
            {token}
          </span>
        );
      } else if (token.startsWith('http://') || token.startsWith('https://') || token.startsWith('"') || token.startsWith("'")) {
        tokens.push(
          <span key={tokenKey++} style={{ color: 'var(--syntax-string)' }}>
            {token}
          </span>
        );
      } else if (token.startsWith('-')) {
        tokens.push(
          <span key={tokenKey++} style={{ color: 'var(--syntax-flag)' }}>
            {token}
          </span>
        );
      } else if (SHELL_COMMANDS.has(lower)) {
        tokens.push(
          <span key={tokenKey++} style={{ color: 'var(--syntax-command)', fontWeight: 600 }}>
            {token}
          </span>
        );
      } else if (KEYWORDS.has(lower)) {
        tokens.push(
          <span key={tokenKey++} style={{ color: 'var(--syntax-keyword)' }}>
            {token}
          </span>
        );
      } else if (/^\d+(?:\.\d+)?$/.test(trimmedToken)) {
        tokens.push(
          <span key={tokenKey++} style={{ color: 'var(--syntax-number)' }}>
            {token}
          </span>
        );
      } else if (/^[{}()[\];:,.<>|=+*&/%^!~`?]+$/.test(trimmedToken)) {
        tokens.push(
          <span key={tokenKey++} style={{ color: 'var(--syntax-punctuation)' }}>
            {token}
          </span>
        );
      } else {
        tokens.push(
          <span key={tokenKey++} style={{ color: 'var(--docs-code-text)' }}>
            {token}
          </span>
        );
      }
    }

    return (
      <div key={lineIdx} className="leading-relaxed">
        {tokens.length > 0 ? tokens : <span>&nbsp;</span>}
      </div>
    );
  });
}
