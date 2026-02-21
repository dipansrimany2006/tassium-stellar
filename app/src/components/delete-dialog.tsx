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

interface DeleteDialogProps {
  children: React.ReactNode;
  appName: string;
  onDeleteSuccess?: () => void;
}

export function DeleteDialog({ children, appName, onDeleteSuccess }: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/deployments/${appName}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Delete failed: ${res.status}`);
      }

      setOpen(false);
      setConfirmName("");
      onDeleteSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setConfirmName(""); setError(null); } }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-none bg-neutral-900">
        <DialogHeader>
          <DialogTitle>Delete {appName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-400">
            Type <span className="text-white font-mono">{appName}</span> to confirm deletion.
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <input
            type="text"
            placeholder={appName}
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            className="w-full border bg-neutral-800 p-2 outline-none focus:ring-1 focus:ring-ring"
          />
          <Button
            onClick={handleDelete}
            disabled={isDeleting || confirmName !== appName}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
