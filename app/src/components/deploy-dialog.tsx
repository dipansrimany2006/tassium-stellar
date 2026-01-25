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
import { parseGitHubUrl, validateAppName } from "@/lib/utils";
import type { DeployRequest } from "@/types/api";

const API_URL = "https://api.silonelabs.workers.dev";

interface DeployDialogProps {
  children: React.ReactNode;
  walletAddress: string | null;
  onDeploySuccess?: () => void;
}

export function DeployDialog({ children, walletAddress, onDeploySuccess }: DeployDialogProps) {
  const [open, setOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [envVars, setEnvVars] = useState("");
  const [port, setPort] = useState("3000");
  const [branch, setBranch] = useState("main");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appNameError = appName ? validateAppName(appName) : null;
  const isDisabled = !walletAddress || isDeploying || !appName || !repoUrl || !!appNameError;

  const handleDeploy = async () => {
    if (!walletAddress) return;

    const nameErr = validateAppName(appName);
    if (nameErr) {
      setError(nameErr);
      return;
    }

    setIsDeploying(true);
    setError(null);

    try {
      const payload: DeployRequest = {
        appName: appName.toLowerCase(),
        githubRepo: parseGitHubUrl(repoUrl),
        creator: walletAddress,
        branch: branch || "main",
        port: parseInt(port) || 3000,
      };

      console.log("[deploy] sending payload:", payload);
      const res = await fetch(`${API_URL}/api/v1/deployments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[deploy] response status:", res.status);
      const data = await res.json().catch(() => ({}));
      console.log("[deploy] response data:", data);

      if (!res.ok) {
        throw new Error(data.error || `Deploy failed: ${res.status}`);
      }

      setOpen(false);
      setAppName("");
      setRepoUrl("");
      setEnvVars("");
      setPort("3000");
      setBranch("main");
      onDeploySuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deploy failed");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-none bg-neutral-900">
        <DialogHeader>
          <DialogTitle>Deploy Application</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {!walletAddress && (
            <p className="text-sm text-yellow-500">Connect wallet to deploy</p>
          )}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">App Name</label>
            <input
              type="text"
              placeholder="my-app"
              value={appName}
              onChange={(e) => setAppName(e.target.value.toLowerCase())}
              maxLength={20}
              className="w-full border bg-neutral-800 p-2 outline-none focus:ring-1 focus:ring-ring"
            />
            {appNameError && (
              <p className="text-xs text-red-400">{appNameError}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">GitHub Repository URL</label>
            <input
              type="text"
              placeholder="https://github.com/user/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full border bg-neutral-800 p-2 outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Branch</label>
            <input
              type="text"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border bg-neutral-800 p-2 outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Environment Variables</label>
            <textarea
              placeholder="KEY=VALUE&#10;ANOTHER_KEY=VALUE"
              value={envVars}
              onChange={(e) => setEnvVars(e.target.value)}
              rows={4}
              className="w-full border bg-neutral-800 p-2 outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Port</label>
            <input
              type="number"
              placeholder="3000"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full border bg-neutral-800 p-2 outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <Button onClick={handleDeploy} disabled={isDisabled} className="w-full">
            {isDeploying ? "Deploying..." : "Deploy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
