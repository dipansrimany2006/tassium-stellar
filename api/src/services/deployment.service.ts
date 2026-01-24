import { eq } from "drizzle-orm";
import { Database, projects } from "../db";
import { callDeployer, deleteDeployment, DeployRequest } from "./deployer-client";

export interface CreateDeploymentInput {
  appName: string;
  githubRepo: string;
  branch?: string;
  port?: number;
  creator: string;
}

export async function createDeployment(
  db: Database,
  deployerUrl: string,
  input: CreateDeploymentInput
) {
  const { appName, githubRepo, branch = "main", port = 3000, creator } = input;

  // Insert pending record
  const [project] = await db
    .insert(projects)
    .values({
      appName,
      githubRepo,
      branch,
      port,
      creator,
      status: "pending",
    })
    .returning();

  // Update to processing
  await db
    .update(projects)
    .set({ status: "processing", updatedAt: new Date() })
    .where(eq(projects.id, project.id));

  // Call deployer
  const deployPayload: DeployRequest = { appName, githubRepo, branch, port };
  const result = await callDeployer(deployerUrl, deployPayload);

  if (result.success) {
    await db
      .update(projects)
      .set({
        status: "success",
        url: result.url,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, project.id));

    return { success: true, project: { ...project, status: "success", url: result.url } };
  } else {
    await db
      .update(projects)
      .set({
        status: "failed",
        errorMessage: result.error || result.message,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, project.id));

    return { success: false, error: result.error || result.message };
  }
}

export async function listDeployments(db: Database, creator: string) {
  return db.select().from(projects).where(eq(projects.creator, creator));
}

export async function getDeployment(db: Database, appName: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.appName, appName));
  return project || null;
}

export async function removeDeployment(
  db: Database,
  deployerUrl: string,
  appName: string
) {
  const result = await deleteDeployment(deployerUrl, appName);

  if (result.success) {
    await db.delete(projects).where(eq(projects.appName, appName));
  }

  return result;
}
