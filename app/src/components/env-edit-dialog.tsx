"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const API_URL = "https://api.silonelabs.workers.dev";

interface EnvEditDialogProps {
  children: React.ReactNode;
  appName: string;
  onSuccess?: () => void;
}

export function EnvEditDialog({ children, appName, onSuccess }: EnvEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [envText, setEnvText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("");

    const envVars: Record<string, string> = {};
    envText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && l.includes("="))
      .forEach((l) => {
        const idx = l.indexOf("=");
        envVars[l.slice(0, idx)] = l.slice(idx + 1);
      });

    try {
      const res = await fetch(`${API_URL}/api/v1/deployments/${appName}/env`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ envVars }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Update failed: ${res.status}`);
      }

      setStatus("Updated! Service redeploying...");
      onSuccess?.();
      setTimeout(() => { setOpen(false); setStatus(""); }, 1500);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-none bg-neutral-900">
        <DialogHeader>
          <DialogTitle>Environment Variables — {appName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-400">
            One per line: KEY=VALUE. This will redeploy the service.
          </p>
          <textarea
            placeholder="KEY=VALUE&#10;ANOTHER_KEY=VALUE"
            value={envText}
            onChange={(e) => setEnvText(e.target.value)}
            rows={8}
            className="w-full border bg-neutral-800 p-2 outline-none focus:ring-1 focus:ring-ring resize-none font-mono text-sm"
          />
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? "Saving..." : "Update Env Vars"}
          </Button>
          {status && (
            <p className={`text-sm text-center ${status.includes("Error") ? "text-red-400" : "text-green-400"}`}>
              {status}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
