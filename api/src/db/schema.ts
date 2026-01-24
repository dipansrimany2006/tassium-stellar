import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  appName: text("app_name").notNull().unique(),
  githubRepo: text("github_repo").notNull(),
  branch: text("branch").default("main"),
  port: integer("port").default(3000),
  creator: text("creator").notNull(), // wallet address
  status: text("status").notNull().default("pending"), // pending, processing, success, failed
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
  createdAt: timestamp("created_at").defaultNow(),
  lastSeen: timestamp("last_seen"),
});

export const workerUptimeRecords = pgTable("worker_uptime_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletAddress: text("wallet_address").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  durationMinutes: integer("duration_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
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
