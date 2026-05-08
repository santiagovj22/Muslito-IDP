"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInherited = runInherited;
exports.runPiped = runPiped;
exports.commandExists = commandExists;
const child_process_1 = require("child_process");
/**
 * Spawns a command and streams stdio directly to the terminal.
 * Returns the exit code.
 */
function runInherited(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const opts = {
            cwd,
            stdio: 'inherit',
            shell: true,
        };
        const child = (0, child_process_1.spawn)(command, args, opts);
        child.on('error', reject);
        child.on('close', (code) => resolve(code ?? 1));
    });
}
/**
 * Spawns a command and captures stdout/stderr.
 * Use for commands where you want to suppress output on success
 * and surface it only on failure.
 */
function runPiped(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const opts = {
            cwd,
            shell: true,
        };
        const child = (0, child_process_1.spawn)(command, args, opts);
        let stdout = '';
        let stderr = '';
        child.stdout?.on('data', (d) => { stdout += d.toString(); });
        child.stderr?.on('data', (d) => { stderr += d.toString(); });
        child.on('error', reject);
        child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
    });
}
/**
 * Returns true if the given command exists on PATH.
 */
function commandExists(cmd) {
    return new Promise((resolve) => {
        const whichCmd = process.platform === 'win32' ? 'where' : 'which';
        const child = (0, child_process_1.spawn)(whichCmd, [cmd], { stdio: 'ignore', shell: true });
        child.on('close', (code) => resolve(code === 0));
        child.on('error', () => resolve(false));
    });
}
//# sourceMappingURL=exec.js.map