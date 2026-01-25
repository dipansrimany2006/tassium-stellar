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

  console.log("[createDeployment] input:", { appName, githubRepo, branch, port, creator });
  console.log("[createDeployment] deployerUrl:", deployerUrl);

  // Insert pending record
  let project;
  try {
    const [inserted] = await db
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
    project = inserted;
    console.log("[createDeployment] inserted project:", project);
  } catch (dbErr: any) {
    console.error("[createDeployment] DB insert error:", dbErr.message);
    return { success: false, error: `DB error: ${dbErr.message}` };
  }

  // Update to processing
  await db
    .update(projects)
    .set({ status: "processing", updatedAt: new Date() })
    .where(eq(projects.id, project.id));

  // Call deployer
  const deployPayload: DeployRequest = { appName, githubRepo, branch, port };
  console.log("[createDeployment] calling deployer with:", deployPayload);
  const result = await callDeployer(deployerUrl, deployPayload);
  console.log("[createDeployment] deployer result:", result);

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

export async function updateReplicas(db: Database, appName: string, replicas: number) {
  const [updated] = await db
    .update(projects)
    .set({ replicas, updatedAt: new Date() })
    .where(eq(projects.appName, appName))
    .returning();
  return updated || null;
}
