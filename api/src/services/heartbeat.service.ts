import { Database, workerUptimeRecords, workers, workerMetrics, containerMetrics } from "../db";
import { HeartbeatPayload, SystemMetrics, UptimeRecord } from "../types/heartbeat.types";
import { eq, sql } from "drizzle-orm";

const STALENESS_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

export function calculateCredits(system: SystemMetrics, containerCount: number): number {
  const base = 10
    + system.cpuCores * 5
    + system.ramTotalGb * 3
    + system.storageTotalGb / 10
    + containerCount * 15;
  const multiplier = system.cpuUsagePercent > 5 ? 1.2 : 1.0;
  return Math.floor(base * multiplier);
}

export async function processHeartbeat(
  db: Database,
  kv: KVNamespace,
  payload: HeartbeatPayload
) {
  const { walletAddress, timestamp, containers, tailscaleIp, hostname, system } = payload;
  const now = new Date(timestamp);

  // Uptime tracking in KV
  const timeKey = `${walletAddress}:time`;
  const containersKey = `${walletAddress}:containers`;

  const existingRecord = await kv.get<UptimeRecord>(timeKey, "json");

  if (!existingRecord) {
    const newRecord: UptimeRecord = { startTime: timestamp, endTime: timestamp };
    await kv.put(timeKey, JSON.stringify(newRecord));
  } else {
    const lastEnd = new Date(existingRecord.endTime);
    const gap = now.getTime() - lastEnd.getTime();

    if (gap > STALENESS_THRESHOLD_MS) {
      await flushUptimeRecord(db, walletAddress, existingRecord);
      const newRecord: UptimeRecord = { startTime: timestamp, endTime: timestamp };
      await kv.put(timeKey, JSON.stringify(newRecord));
    } else {
      existingRecord.endTime = timestamp;
      await kv.put(timeKey, JSON.stringify(existingRecord));
    }
  }

  // Update containers in KV
  await kv.put(containersKey, JSON.stringify(containers));

  // Calculate credits — resource-aware if system metrics present, else flat 100
  let creditsEarned = 100;
  if (system) {
    creditsEarned = calculateCredits(system, containers.length);
  }

  // Insert metrics if system data present
  if (system) {
    await db.insert(workerMetrics).values({
      walletAddress,
      timestamp: now,
      cpuCores: system.cpuCores,
      cpuUsagePercent: system.cpuUsagePercent,
      ramTotalGb: system.ramTotalGb,
      ramUsedGb: system.ramUsedGb,
      storageTotalGb: system.storageTotalGb,
      storageUsedGb: system.storageUsedGb,
      containerCount: containers.length,
      creditsEarned,
    });

    // Insert per-container metrics
    if (containers.length > 0) {
      await db.insert(containerMetrics).values(
        containers.map((c) => ({
          walletAddress,
          timestamp: now,
          containerName: c.name,
          cpuPercent: c.cpuPercent ?? null,
          memUsageMb: c.memUsageMb ?? null,
        }))
      );
    }
  }

  // Upsert worker row
  const workerUpdate: Record<string, any> = {
    lastSeen: now,
    tailscaleIp,
    hostname,
    credits: sql`${workers.credits} + ${creditsEarned}`,
    status: "HEALTHY",
  };
  if (system) {
    workerUpdate.cpuCores = system.cpuCores;
    workerUpdate.ramTotalGb = system.ramTotalGb;
    workerUpdate.storageTotalGb = system.storageTotalGb;
  }

  await db
    .insert(workers)
    .values({
      walletAddress,
      lastSeen: now,
      tailscaleIp,
      hostname,
      credits: creditsEarned,
      status: "HEALTHY",
      cpuCores: system?.cpuCores,
      ramTotalGb: system?.ramTotalGb,
      storageTotalGb: system?.storageTotalGb,
    })
    .onConflictDoUpdate({
      target: workers.walletAddress,
      set: workerUpdate,
    });

  return { success: true, creditsEarned };
}

async function flushUptimeRecord(
  db: Database,
  walletAddress: string,
  record: UptimeRecord
) {
  const start = new Date(record.startTime);
  const end = new Date(record.endTime);
  const durationMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);

  await db.insert(workerUptimeRecords).values({
    walletAddress,
    startTime: start,
    endTime: end,
    durationMinutes,
  });
}

export async function getWorkerContainers(kv: KVNamespace, walletAddress: string) {
  const containersKey = `${walletAddress}:containers`;
  return kv.get(containersKey, "json");
}

export async function listWorkers(db: Database) {
  return db.select().from(workers);
}

export async function getWorkerUptime(db: Database, walletAddress: string) {
  return db
    .select()
    .from(workerUptimeRecords)
    .where(eq(workerUptimeRecords.walletAddress, walletAddress));
}

export async function getWorkerByWallet(db: Database, walletAddress: string) {
  const result = await db
    .select()
    .from(workers)
    .where(eq(workers.walletAddress, walletAddress));
  return result[0] || null;
}

export async function getWorkerMetrics(db: Database, walletAddress: string, hours: number = 1) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return db
    .select()
    .from(workerMetrics)
    .where(
      sql`${workerMetrics.walletAddress} = ${walletAddress} AND ${workerMetrics.timestamp} >= ${since}`
    )
    .orderBy(workerMetrics.timestamp);
}
