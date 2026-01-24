CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"amount" text NOT NULL,
	"tx_hash" text,
	"period_start" timestamp,
	"period_end" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_name" text NOT NULL,
	"github_repo" text NOT NULL,
	"branch" text DEFAULT 'main',
	"port" integer DEFAULT 3000,
	"creator" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"url" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "projects_app_name_unique" UNIQUE("app_name")
);
--> statement-breakpoint
CREATE TABLE "worker_uptime_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"duration_minutes" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"tailscale_ip" text,
	"hostname" text,
	"created_at" timestamp DEFAULT now(),
	"last_seen" timestamp,
	CONSTRAINT "workers_wallet_address_unique" UNIQUE("wallet_address")
);
