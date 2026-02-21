import type { Context } from "hono";
import type {
  DeployRequest,
  DeployResponse,
  BuildContext,
} from "../types/deploy.types";
import { validateAppName, validateGithubRepo } from "../utils/validation";
import { generateBuildId } from "../utils/id";
import {
  cloneRepo,
  hasDockerfile,
  GitCloneError,
} from "../services/git.service";
import {
  buildAndPushImage,
  deployStack,
  appExists,
  DockerBuildError,
  DockerDeployError,
} from "../services/docker.service";
import {
  generateStackYaml,
  writeStackFile,
  getAppUrl,
} from "../services/stack.service";
import { REGISTRY } from "../config/constants";
import { cleanupBuildDir } from "../services/cleanup.service";

const BUILDS_DIR = "/tmp/builds";

export const createNewDeployment = async (c: Context) => {
  let buildDir: string | null = null;

  try {
    const body = await c.req.json<DeployRequest>();
    const {
      github_repo,
      app_name,
      branch = "main",
      port = 3000,
      env_vars = {},
    } = body;

    const repoCheck = validateGithubRepo(github_repo);
    if (!repoCheck.valid) {
      return c.json<DeployResponse>(
        { status: "error", message: repoCheck.error },
        400,
      );
    }

    const nameCheck = validateAppName(app_name);
    if (!nameCheck.valid) {
      return c.json<DeployResponse>(
        { status: "error", message: nameCheck.error },
        400,
      );
    }

    if (await appExists(app_name)) {
      return c.json<DeployResponse>(
        { status: "error", message: `App '${app_name}' already exists` },
        409,
      );
    }

    const buildId = generateBuildId();
    buildDir = `${BUILDS_DIR}/${app_name}-${buildId}`;
    const imageName = `${REGISTRY}/${app_name}:${buildId}`;

    const ctx: BuildContext = {
      appName: app_name,
      buildId,
      buildDir,
      imageName,
      port,
      envVars: env_vars,
    };

    await cloneRepo(github_repo, branch, buildDir);

    if (!(await hasDockerfile(buildDir))) {
      await cleanupBuildDir(buildDir).catch(() => {});
      return c.json<DeployResponse>(
        { status: "error", message: "No Dockerfile found in repository" },
        400,
      );
    }

    await buildAndPushImage(buildDir, app_name, buildId);

    const yaml = generateStackYaml(ctx);
    const stackFile = await writeStackFile(app_name, yaml);

    await deployStack(stackFile, app_name);

    await cleanupBuildDir(buildDir);

    return c.json<DeployResponse>({
      status: "success",
      url: getAppUrl(app_name),
      app_name,
      build_id: buildId,
    });
  } catch (err: any) {
    if (buildDir) {
      await cleanupBuildDir(buildDir).catch(() => {});
    }

    if (err instanceof DockerBuildError) {
      console.log(err);

      return c.json<DeployResponse>(
        { status: "error", message: `Build failed: ${err.details}` },
        422,
      );
    }
    if (err instanceof DockerDeployError) {
      return c.json<DeployResponse>(
        { status: "error", message: `Stack deploy failed: ${err.details}` },
        500,
      );
    }
    if (err instanceof GitCloneError) {
      return c.json<DeployResponse>(
        { status: "error", message: err.details },
        404,
      );
    }

    return c.json<DeployResponse>(
      { status: "error", message: err.message || "Unknown error" },
      500,
    );
  }
};
