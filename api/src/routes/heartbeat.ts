import { Hono } from "hono";
import { Env } from "../types/env";
import { createDb } from "../db";
import { processHeartbeat } from "../services/heartbeat.service";
import { HeartbeatPayload } from "../types/heartbeat.types";

const app = new Hono<{ Bindings: Env }>();

app.post("/", async (c) => {
  const body = await c.req.json<HeartbeatPayload>();
  const { walletAddress, timestamp, containers, tailscaleIp, hostname } = body;

  if (!walletAddress || !timestamp) {
    return c.json({ error: "walletAddress, timestamp required" }, 400);
  }

  const db = createDb(c.env.DATABASE_URL);
  const result = await processHeartbeat(
    db,
    c.env.WORKER_HEARTBEATS,
    { walletAddress, timestamp, containers: containers || [], tailscaleIp, hostname }
  );

  return c.json(result);
});

export default app;
