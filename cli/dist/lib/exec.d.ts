export interface RunResult {
    code: number;
    stdout: string;
    stderr: string;
}
/**
 * Spawns a command and streams stdio directly to the terminal.
 * Returns the exit code.
 */
export declare function runInherited(command: string, args: string[], cwd: string): Promise<number>;
/**
 * Spawns a command and captures stdout/stderr.
 * Use for commands where you want to suppress output on success
 * and surface it only on failure.
 */
export declare function runPiped(command: string, args: string[], cwd: string): Promise<RunResult>;
/**
 * Returns true if the given command exists on PATH.
 */
export declare function commandExists(cmd: string): Promise<boolean>;
//# sourceMappingURL=exec.d.ts.map