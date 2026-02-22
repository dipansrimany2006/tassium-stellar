import { Hono } from "hono";
import { Env } from "../types/env";
import { createDb } from "../db";
import { processHeartbeat } from "../services/heartbeat.service";
import { HeartbeatPayload, PingPayload } from "../types/heartbeat.types";

const app = new Hono<{ Bindings: Env }>();

// Lightweight 30s ping — KV only, no DB hit
app.post("/ping", async (c) => {
  const body = await c.req.json<PingPayload>();
  const { walletAddress, timestamp } = body;

  if (!walletAddress || !timestamp) {
    return c.json({ error: "walletAddress, timestamp required" }, 400);
  }

  await c.env.WORKER_HEARTBEATS.put(`${walletAddress}:lastPing`, timestamp);
  return c.json({ success: true });
});

// Full heartbeat with system + container metrics
app.post("/", async (c) => {
  const body = await c.req.json<HeartbeatPayload>();
  const { walletAddress, timestamp, containers, tailscaleIp, hostname, system } = body;

  if (!walletAddress || !timestamp) {
    return c.json({ error: "walletAddress, timestamp required" }, 400);
  }

  const db = createDb(c.env.DATABASE_URL);
  const result = await processHeartbeat(
    db,
    c.env.WORKER_HEARTBEATS,
    { walletAddress, timestamp, containers: containers || [], tailscaleIp, hostname, system }
  );

  return c.json(result);
});

export default app;
