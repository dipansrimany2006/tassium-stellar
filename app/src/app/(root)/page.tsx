"use client";
import { useState } from "react";
import { useWallet } from "@/context/wallet-context";
import { Button } from "@/component/ui/button";
import { DeployDialog, DeployFormData } from "@/component/deploy-dialog";

export default function Home() {
  const { isConnected } = useWallet();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeploy = async (data: DeployFormData) => {
    // TODO: implement API call
    console.log("Deploy data:", data);
    await new Promise((r) => setTimeout(r, 1000)); // simulate API
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {isConnected && (
        <div className="flex items-center gap-4 mb-8">
          <p className="text-xl font-semibold">Your Applications</p>
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Deploy
          </Button>
        </div>
      )}

      <DeployDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDeploy}
      />
    </div>
  );
}
