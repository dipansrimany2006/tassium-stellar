import { spawn, type Subprocess } from "bun";

const DEBOUNCE_MS = 5_000;
const RELEVANT_ACTIONS = new Set(["ready", "down"]);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let eventProcess: Subprocess | null = null;

async function rebalanceServices(): Promise<void> {
  console.log("[rebalancer] node change detected — rebalancing services");

  const ls = spawn(["docker", "service", "ls", "--format", "{{.Name}}"]);
  const output = await new Response(ls.stdout).text();
  const services = output.trim().split("\n").filter(Boolean);

  if (!services.length) {
    console.log("[rebalancer] no services to rebalance");
    return;
  }

  for (const svc of services) {
    console.log(`[rebalancer] force-updating ${svc}`);
    const update = spawn([
      "docker",
      "service",
      "update",
      "--force",
      "--update-order",
      "start-first",
      "--update-parallelism",
      "1",
      "--update-delay",
      "10s",
      svc,
    ]);
    await update.exited;
  }

  console.log(`[rebalancer] rebalanced ${services.length} service(s)`);
}

function scheduleRebalance(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    rebalanceServices().catch((err) =>
      console.error("[rebalancer] rebalance failed:", err)
    );
  }, DEBOUNCE_MS);
}

function watchNodeEvents(): void {
  eventProcess = spawn(
    ["docker", "events", "--filter", "type=node", "--format", "{{.Action}}"],
    { stdout: "pipe", stderr: "pipe" }
  );

  const stdout = eventProcess.stdout;
  if (!stdout || typeof stdout === "number") {
    console.error("[rebalancer] failed to get stdout stream");
    setTimeout(watchNodeEvents, 3_000);
    return;
  }

  const reader = stdout.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const read = async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const action = line.trim();
          if (!action) continue;
          console.log(`[rebalancer] node event: ${action}`);
          if (RELEVANT_ACTIONS.has(action)) scheduleRebalance();
        }
      }
    } catch (err) {
      console.error("[rebalancer] event stream error:", err);
    }

    // restart stream after unexpected exit
    console.log("[rebalancer] event stream ended — restarting in 3s");
    setTimeout(watchNodeEvents, 3_000);
  };

  read();
}

export function startRebalancer(): void {
  console.log("[rebalancer] starting node event watcher");
  watchNodeEvents();
}
