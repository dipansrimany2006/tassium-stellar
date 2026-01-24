import { exec } from "../utils/shell";
import { REGISTRY } from "../config/constants";

export class DockerBuildError extends Error {
  constructor(public details: string) {
    super(`Build failed: ${details}`);
    this.name = "DockerBuildError";
  }
}

export class DockerDeployError extends Error {
  constructor(public details: string) {
    super(`Deploy failed: ${details}`);
    this.name = "DockerDeployError";
  }
}

export async function buildAndPushImage(
  buildDir: string,
  appName: string,
  buildId: string,
): Promise<string> {
  const imageName = `${REGISTRY}/${appName}:${buildId}`;

  // Ensure builder exists
  await exec(
    `docker buildx create --name multiarch --config /etc/buildkitd.toml --use 2>/dev/null || docker buildx use multiarch`,
  );

  const result = await exec(
    `docker buildx build --platform linux/amd64,linux/arm64 -t ${imageName} --push ${buildDir} 2>&1`,
  );

  if (!result.success) {
    const lines = (result.stderr || result.stdout).split("\n");
    const errorLines = lines.slice(-10).join("\n");
    throw new DockerBuildError(errorLines || "Unknown build error");
  }
  return imageName;
}
export async function deployStack(
  stackFile: string,
  appName: string,
): Promise<void> {
  const result = await exec(
    `docker stack deploy -c ${stackFile} ${appName} 2>&1`,
  );
  if (!result.success) {
    throw new DockerDeployError(
      result.stderr || result.stdout || "Unknown deploy error",
    );
  }
}

export async function appExists(appName: string): Promise<boolean> {
  const result = await exec(
    `docker stack ls --format '{{.Name}}' | grep -w ${appName}`,
  );
  return result.success && result.stdout.includes(appName);
}

export async function removeStack(appName: string): Promise<void> {
  const result = await exec(`docker stack rm ${appName}`);
  if (!result.success) {
    throw new Error(`Remove failed: ${result.stderr}`);
  }
}
