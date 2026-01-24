import { Database, workerUptimeRecords, workers } from "../db";
import { HeartbeatPayload, UptimeRecord } from "../types/heartbeat.types";
import { eq } from "drizzle-orm";

const STALENESS_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

export async function processHeartbeat(
  db: Database,
  kv: KVNamespace,
  payload: HeartbeatPayload
) {
  const { walletAddress, timestamp, containers } = payload;
  const now = new Date(timestamp);

  // Get existing uptime record from KV
  const timeKey = `${walletAddress}:time`;
  const containersKey = `${walletAddress}:containers`;

  const existingRecord = await kv.get<UptimeRecord>(timeKey, "json");

  if (!existingRecord) {
    // First heartbeat - create new record
    const newRecord: UptimeRecord = {
      startTime: timestamp,
      endTime: timestamp,
    };
    await kv.put(timeKey, JSON.stringify(newRecord));
  } else {
    const lastEnd = new Date(existingRecord.endTime);
    const gap = now.getTime() - lastEnd.getTime();

    if (gap > STALENESS_THRESHOLD_MS) {
      // Gap too large - flush old record to DB and start new
      await flushUptimeRecord(db, walletAddress, existingRecord);

      const newRecord: UptimeRecord = {
        startTime: timestamp,
        endTime: timestamp,
      };
      await kv.put(timeKey, JSON.stringify(newRecord));
    } else {
      // Update endTime
      existingRecord.endTime = timestamp;
      await kv.put(timeKey, JSON.stringify(existingRecord));
    }
  }

  // Update containers
  await kv.put(containersKey, JSON.stringify(containers));

  // Update worker last seen
  await db
    .insert(workers)
    .values({ walletAddress, lastSeen: now })
    .onConflictDoUpdate({
      target: workers.walletAddress,
      set: { lastSeen: now },
    });

  return { success: true };
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
