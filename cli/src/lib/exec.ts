import { spawn, SpawnOptions } from 'child_process';

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

/**
 * Spawns a command and streams stdio directly to the terminal.
 * Returns the exit code.
 */
export function runInherited(command: string, args: string[], cwd: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const opts: SpawnOptions = {
      cwd,
      stdio: 'inherit',
      shell: true,
    };
    const child = spawn(command, args, opts);
    child.on('error', reject);
    child.on('close', (code) => resolve(code ?? 1));
  });
}

/**
 * Spawns a command and captures stdout/stderr.
 * Use for commands where you want to suppress output on success
 * and surface it only on failure.
 */
export function runPiped(command: string, args: string[], cwd: string): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const opts: SpawnOptions = {
      cwd,
      shell: true,
    };
    const child = spawn(command, args, opts);
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d: Buffer) => { stdout += d.toString(); });
    child.stderr?.on('data', (d: Buffer) => { stderr += d.toString(); });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

/**
 * Returns true if the given command exists on PATH.
 */
export function commandExists(cmd: string): Promise<boolean> {
  return new Promise((resolve) => {
    const whichCmd = process.platform === 'win32' ? 'where' : 'which';
    const child = spawn(whichCmd, [cmd], { stdio: 'ignore', shell: true });
    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}
