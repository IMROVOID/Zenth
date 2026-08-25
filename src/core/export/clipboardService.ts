import { spawn } from 'node:child_process';

export class ClipboardService {
  static async copy(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (process.platform === 'win32') {
        try {
          const ps = spawn('powershell', ['-NoProfile', '-Command', '$input | Set-Clipboard'], {
            stdio: ['pipe', 'ignore', 'ignore']
          });

          ps.on('error', () => {
            try {
              const clipChild = spawn('clip', [], { stdio: ['pipe', 'ignore', 'ignore'] });
              clipChild.on('error', () => resolve(false));
              clipChild.on('close', (code) => resolve(code === 0));
              clipChild.stdin.write(Buffer.from(text, 'utf-8'));
              clipChild.stdin.end();
            } catch {
              resolve(false);
            }
          });

          ps.on('close', (code) => {
            if (code === 0) resolve(true);
            else {
              try {
                const clipChild = spawn('clip', [], { stdio: ['pipe', 'ignore', 'ignore'] });
                clipChild.on('error', () => resolve(false));
                clipChild.on('close', (c) => resolve(c === 0));
                clipChild.stdin.write(Buffer.from(text, 'utf-8'));
                clipChild.stdin.end();
              } catch {
                resolve(false);
              }
            }
          });

          ps.stdin.write(text);
          ps.stdin.end();
          return;
        } catch {
          // fallback below
        }
      }

      let command = 'clip';
      let args: string[] = [];

      if (process.platform === 'darwin') {
        command = 'pbcopy';
      } else if (process.platform !== 'win32') {
        command = 'xclip';
        args = ['-selection', 'clipboard'];
      }

      try {
        const child = spawn(command, args, { stdio: ['pipe', 'ignore', 'ignore'] });
        child.on('error', () => {
          if (process.platform !== 'win32' && process.platform !== 'darwin') {
            try {
              const wlChild = spawn('wl-copy', [], { stdio: ['pipe', 'ignore', 'ignore'] });
              wlChild.on('error', () => resolve(false));
              wlChild.on('close', (code) => resolve(code === 0));
              wlChild.stdin.write(text);
              wlChild.stdin.end();
              return;
            } catch {
              resolve(false);
              return;
            }
          }
          resolve(false);
        });

        child.on('close', (code) => resolve(code === 0));
        child.stdin.write(text);
        child.stdin.end();
      } catch {
        resolve(false);
      }
    });
  }

  static async read(): Promise<string> {
    return new Promise((resolve) => {
      let command = 'powershell';
      let args = ['-NoProfile', '-Command', 'Get-Clipboard'];

      if (process.platform === 'darwin') {
        command = 'pbpaste';
        args = [];
      } else if (process.platform !== 'win32') {
        command = 'xclip';
        args = ['-selection', 'clipboard', '-o'];
      }

      try {
        const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'ignore'] });
        const chunks: Buffer[] = [];

        child.stdout.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        child.on('error', () => {
          if (process.platform !== 'win32' && process.platform !== 'darwin') {
            try {
              const wlChild = spawn('wl-paste', [], { stdio: ['ignore', 'pipe', 'ignore'] });
              const wlChunks: Buffer[] = [];
              wlChild.stdout.on('data', (c) => wlChunks.push(Buffer.from(c)));
              wlChild.on('error', () => resolve(''));
              wlChild.on('close', () => resolve(Buffer.concat(wlChunks).toString('utf-8').trim()));
              return;
            } catch {
              resolve('');
              return;
            }
          }
          resolve('');
        });

        child.on('close', (code) => {
          if (code === 0) {
            resolve(Buffer.concat(chunks).toString('utf-8').trim());
          } else {
            resolve('');
          }
        });
      } catch {
        resolve('');
      }
    });
  }
}
