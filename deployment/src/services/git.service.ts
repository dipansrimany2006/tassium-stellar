import { exec } from "../utils/shell";

export class GitCloneError extends Error {
  constructor(public details: string) {
    super(`Clone failed: ${details}`);
    this.name = "GitCloneError";
  }
}

export async function cloneRepo(
  repo: string,
  branch: string,
  destDir: string
): Promise<void> {
  const url = `https://github.com/${repo}.git`;
  const result = await exec(
    `git clone --depth 1 --branch ${branch} ${url} ${destDir} 2>&1`
  );
  if (!result.success) {
    const err = result.stderr || result.stdout;
    if (err.includes("not found") || err.includes("Repository not found")) {
      throw new GitCloneError("Repository not found");
    }
    if (err.includes("Could not find remote branch")) {
      throw new GitCloneError(`Branch '${branch}' not found`);
    }
    throw new GitCloneError(err || "Unknown git error");
  }
}

export async function hasDockerfile(dir: string): Promise<boolean> {
  const result = await exec(`test -f ${dir}/Dockerfile && echo "yes" || echo "no"`);
  return result.stdout === "yes";
}
