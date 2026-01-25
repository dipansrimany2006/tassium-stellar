import { Hono } from "hono";
import { Env } from "../types/env";
import { createDb } from "../db";
import {
  createDeployment,
  listDeployments,
  getDeployment,
  removeDeployment,
  updateReplicas,
} from "../services/deployment.service";

const app = new Hono<{ Bindings: Env }>();

// Create deployment
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    console.log("[POST /deployments] body:", body);
    const { appName, githubRepo, branch, port, creator } = body;

    if (!appName || !githubRepo || !creator) {
      console.log("[POST /deployments] missing fields");
      return c.json({ error: "appName, githubRepo, creator required" }, 400);
    }

    console.log("[POST /deployments] DEPLOYER_URL:", c.env.DEPLOYER_URL);
    const db = createDb(c.env.DATABASE_URL);
    const result = await createDeployment(db, c.env.DEPLOYER_URL, {
      appName,
      githubRepo,
      branch,
      port,
      creator,
    });

    console.log("[POST /deployments] result:", result);
    if (result.success) {
      return c.json(result.project, 201);
    }
    return c.json({ error: result.error }, 500);
  } catch (err: any) {
    console.error("[POST /deployments] error:", err.message, err.stack);
    return c.json({ error: err.message }, 500);
  }
});

// List deployments by creator (required query param)
app.get("/", async (c) => {
  const creator = c.req.query("creator");
  if (!creator) {
    return c.json({ error: "creator query param required" }, 400);
  }

  const db = createDb(c.env.DATABASE_URL);
  const deployments = await listDeployments(db, creator);
  return c.json(deployments);
});

// Get single deployment
app.get("/:name", async (c) => {
  const name = c.req.param("name");
  const db = createDb(c.env.DATABASE_URL);
  const deployment = await getDeployment(db, name);

  if (!deployment) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json(deployment);
});

// Delete deployment
app.delete("/:name", async (c) => {
  const name = c.req.param("name");
  const db = createDb(c.env.DATABASE_URL);
  const result = await removeDeployment(db, c.env.DEPLOYER_URL, name);

  if (result.success) {
    return c.json({ success: true });
  }
  return c.json({ error: result.error }, 500);
});

// Update replicas
app.patch("/:name/replicas", async (c) => {
  const name = c.req.param("name");
  const { replicas } = await c.req.json();

  if (typeof replicas !== "number" || replicas < 1 || replicas > 10) {
    return c.json({ error: "replicas must be 1-10" }, 400);
  }

  const db = createDb(c.env.DATABASE_URL);
  const updated = await updateReplicas(db, name, replicas);

  if (!updated) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json(updated);
});

export default app;
