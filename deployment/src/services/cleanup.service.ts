import { exec } from "../utils/shell";

export async function cleanupBuildDir(buildDir: string): Promise<void> {
  await exec(`rm -rf ${buildDir}`);
}
