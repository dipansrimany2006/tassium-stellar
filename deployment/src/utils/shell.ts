import { $ } from "bun";

export interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
}

export async function exec(command: string): Promise<ShellResult> {
  try {
    const result = await $`sh -c ${command}`.quiet();
    return {
      stdout: result.stdout.toString().trim(),
      stderr: result.stderr.toString().trim(),
      exitCode: result.exitCode,
      success: result.exitCode === 0,
    };
  } catch (err: any) {
    return {
      stdout: err.stdout?.toString().trim() || "",
      stderr: err.stderr?.toString().trim() || err.message,
      exitCode: err.exitCode ?? 1,
      success: false,
    };
  }
}
