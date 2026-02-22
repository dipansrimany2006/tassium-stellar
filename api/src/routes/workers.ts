import { Hono } from "hono";
import { Env } from "../types/env";
import { createDb } from "../db";
import {
  listWorkers,
  getWorkerUptime,
  getWorkerContainers,
  getWorkerByWallet,
  getWorkerMetrics,
} from "../services/heartbeat.service";

const app = new Hono<{ Bindings: Env }>();

// List all workers
app.get("/", async (c) => {
  const db = createDb(c.env.DATABASE_URL);
  const workersList = await listWorkers(db);
  return c.json(workersList);
});

// Get single worker by wallet — extended with resource info
app.get("/:wallet", async (c) => {
  const wallet = c.req.param("wallet");
  const db = createDb(c.env.DATABASE_URL);
  const worker = await getWorkerByWallet(db, wallet);

  if (!worker) {
    return c.json({ exists: false });
  }

  const now = Date.now();
  const lastSeen = worker.lastSeen ? new Date(worker.lastSeen).getTime() : 0;
  const fiveMinutes = 5 * 60 * 1000;
  const isActive = now - lastSeen < fiveMinutes;

  return c.json({
    exists: true,
    credits: worker.credits || 0,
    tailscaleIp: isActive ? worker.tailscaleIp : null,
    isActive,
    lastSeen: worker.lastSeen,
    cpuCores: worker.cpuCores,
    ramTotalGb: worker.ramTotalGb,
    storageTotalGb: worker.storageTotalGb,
    status: worker.status || "UNKNOWN",
    lastPing: worker.lastPing,
  });
});

// KV-based liveness status from lastPing age
app.get("/:wallet/status", async (c) => {
  const wallet = c.req.param("wallet");
  const lastPingStr = await c.env.WORKER_HEARTBEATS.get(`${wallet}:lastPing`);

  if (!lastPingStr) {
    return c.json({ status: "UNKNOWN" });
  }

  const lastPing = new Date(lastPingStr).getTime();
  const age = Date.now() - lastPing;

  let status: string;
  if (age < 60_000) status = "HEALTHY";
  else if (age < 90_000) status = "WARNING";
  else status = "DEAD";

  return c.json({ status, lastPing: lastPingStr });
});

// Time-series metrics
app.get("/:wallet/metrics", async (c) => {
  const wallet = c.req.param("wallet");
  const hours = parseInt(c.req.query("hours") || "1");
  const db = createDb(c.env.DATABASE_URL);
  const metrics = await getWorkerMetrics(db, wallet, hours);
  return c.json(metrics);
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
