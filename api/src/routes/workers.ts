import { Hono } from "hono";
import { Env } from "../types/env";
import { createDb } from "../db";
import {
  listWorkers,
  getWorkerUptime,
  getWorkerContainers,
} from "../services/heartbeat.service";

const app = new Hono<{ Bindings: Env }>();

// List all workers
app.get("/", async (c) => {
  const db = createDb(c.env.DATABASE_URL);
  const workersList = await listWorkers(db);
  return c.json(workersList);
});

// Get worker uptime records
app.get("/:wallet/uptime", async (c) => {
  const wallet = c.req.param("wallet");
  const db = createDb(c.env.DATABASE_URL);
  const records = await getWorkerUptime(db, wallet);
  return c.json(records);
});

// Get worker containers
app.get("/:wallet/containers", async (c) => {
  const wallet = c.req.param("wallet");
  const containers = await getWorkerContainers(c.env.WORKER_HEARTBEATS, wallet);
  return c.json(containers || []);
});

export default app;
