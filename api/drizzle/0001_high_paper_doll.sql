CREATE TABLE "container_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"container_name" text NOT NULL,
	"cpu_percent" real,
	"mem_usage_mb" real
);
--> statement-breakpoint
CREATE TABLE "worker_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"cpu_cores" integer,
	"cpu_usage_percent" real,
	"ram_total_gb" real,
	"ram_used_gb" real,
	"storage_total_gb" real,
	"storage_used_gb" real,
	"container_count" integer,
	"credits_earned" integer
);
--> statement-breakpoint
ALTER TABLE "workers" ADD COLUMN "cpu_cores" integer;--> statement-breakpoint
ALTER TABLE "workers" ADD COLUMN "ram_total_gb" real;--> statement-breakpoint
ALTER TABLE "workers" ADD COLUMN "storage_total_gb" real;--> statement-breakpoint
ALTER TABLE "workers" ADD COLUMN "status" text DEFAULT 'UNKNOWN';--> statement-breakpoint
ALTER TABLE "workers" ADD COLUMN "last_ping" timestamp;