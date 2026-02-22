import { pgTable, text, timestamp, integer, uuid, real } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  appName: text("app_name").notNull().unique(),
  githubRepo: text("github_repo").notNull(),
  branch: text("branch").default("main"),
  port: integer("port").default(3000),
  creator: text("creator").notNull(), // wallet address
  status: text("status").notNull().default("pending"), // pending, processing, success, failed
  replicas: integer("replicas").default(2),
  url: text("url"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workers = pgTable("workers", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletAddress: text("wallet_address").notNull().unique(),
  tailscaleIp: text("tailscale_ip"),
  hostname: text("hostname"),
  credits: integer("credits").default(0),
  cpuCores: integer("cpu_cores"),
  ramTotalGb: real("ram_total_gb"),
  storageTotalGb: real("storage_total_gb"),
  status: text("status").default("UNKNOWN"),
  createdAt: timestamp("created_at").defaultNow(),
  lastSeen: timestamp("last_seen"),
  lastPing: timestamp("last_ping"),
});

export const workerUptimeRecords = pgTable("worker_uptime_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletAddress: text("wallet_address").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  durationMinutes: integer("duration_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workerMetrics = pgTable("worker_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletAddress: text("wallet_address").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  cpuCores: integer("cpu_cores"),
  cpuUsagePercent: real("cpu_usage_percent"),
  ramTotalGb: real("ram_total_gb"),
  ramUsedGb: real("ram_used_gb"),
  storageTotalGb: real("storage_total_gb"),
  storageUsedGb: real("storage_used_gb"),
  containerCount: integer("container_count"),
  creditsEarned: integer("credits_earned"),
});

export const containerMetrics = pgTable("container_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletAddress: text("wallet_address").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  containerName: text("container_name").notNull(),
  cpuPercent: real("cpu_percent"),
  memUsageMb: real("mem_usage_mb"),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletAddress: text("wallet_address").notNull(),
  amount: text("amount").notNull(), // store as string for precision
  txHash: text("tx_hash"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  createdAt: timestamp("created_at").defaultNow(),
});
