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

export function DeployDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [envVars, setEnvVars] = useState("");
  const [port, setPort] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpen(false);
    setIsDeploying(false);
    setRepoUrl("");
    setEnvVars("");
    setPort("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-none bg-neutral-900">
        <DialogHeader>
          <DialogTitle>Deploy Application</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">GitHub Repository URL</label>
            <input
              type="url"
              placeholder="https://github.com/user/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
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
          <Button onClick={handleDeploy} disabled={isDeploying} className="w-full">
            {isDeploying ? "Deploying..." : "Deploy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
