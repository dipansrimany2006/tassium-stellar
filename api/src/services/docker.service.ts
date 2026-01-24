import { exec } from "../utils/shell";
import { REGISTRY } from "../config/constants";

export class DockerBuildError extends Error {
  constructor(public details: string) {
    super(`Build failed: ${details}`);
    this.name = "DockerBuildError";
  }
}

export class DockerPushError extends Error {
  constructor(public details: string) {
    super(`Push failed: ${details}`);
    this.name = "DockerPushError";
  }
}

export class DockerDeployError extends Error {
  constructor(public details: string) {
    super(`Deploy failed: ${details}`);
    this.name = "DockerDeployError";
  }
}

export async function buildImage(
  buildDir: string,
  appName: string,
  buildId: string
): Promise<string> {
  const imageName = `${REGISTRY}/${appName}:${buildId}`;
  const result = await exec(`docker build -t ${imageName} ${buildDir} 2>&1`);
  if (!result.success) {
    // Extract last meaningful error lines
    const lines = (result.stderr || result.stdout).split("\n");
    const errorLines = lines.slice(-10).join("\n");
    throw new DockerBuildError(errorLines || "Unknown build error");
  }
  return imageName;
}

export async function pushImage(imageName: string): Promise<void> {
  const result = await exec(`docker push ${imageName} 2>&1`);
  if (!result.success) {
    throw new DockerPushError(result.stderr || result.stdout || "Unknown push error");
  }
}

export async function deployStack(stackFile: string, appName: string): Promise<void> {
  const result = await exec(`docker stack deploy -c ${stackFile} ${appName} 2>&1`);
  if (!result.success) {
    throw new DockerDeployError(result.stderr || result.stdout || "Unknown deploy error");
  }
}

export async function appExists(appName: string): Promise<boolean> {
  const result = await exec(`docker stack ls --format '{{.Name}}' | grep -w ${appName}`);
  return result.success && result.stdout.includes(appName);
}

export async function removeStack(appName: string): Promise<void> {
  const result = await exec(`docker stack rm ${appName}`);
  if (!result.success) {
    throw new Error(`Remove failed: ${result.stderr}`);
  }
}
