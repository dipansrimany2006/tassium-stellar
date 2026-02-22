"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DeployDialog } from "@/components/deploy-dialog";
import { SingleDeploymentCard } from "@/components/cards/single-deployment-card";
import { useWallet } from "@/context/wallet-context";
import type { SingleProject } from "@/constants";
import type { DeploymentResponse } from "@/types/api";

const API_URL = "https://api.silonelabs.workers.dev";

export default function Home() {
  const { walletAddress } = useWallet();
  const [deployments, setDeployments] = useState<SingleProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeployments = useCallback(async (creator: string) => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/deployments?creator=${encodeURIComponent(creator)}`,
      );
      if (!res.ok) return;
      const data: DeploymentResponse[] = await res.json();

      console.log(data);

      setDeployments(
        data
          .map((d) => ({
            name: d.appName,
            url: d.url || "",
            port: d.port,
            status: d.status,
            createdAt: new Date(d.createdAt),
            github: d.githubRepo,
            replicas: d.replicas ?? 2,
          }))
          .filter((item) => item.url != ""),
      );
    } catch {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      setIsLoading(true);
      fetchDeployments(walletAddress);
    } else {
      setIsLoading(false);
      setDeployments([]);
    }
  }, [walletAddress, fetchDeployments]);

  const handleDeploySuccess = () => {
    if (walletAddress) {
      fetchDeployments(walletAddress);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between">
        <p className="text-xl font-semibold uppercase">Your Apps</p>
        <DeployDialog
          walletAddress={walletAddress}
          onDeploySuccess={handleDeploySuccess}
        >
          <Button className="p-6 px-8" variant={"outline"}>
            Deploy
          </Button>
        </DeployDialog>
      </div>
      <div className="mt-5 w-full grid grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-neutral-400">Loading...</p>
        ) : !walletAddress ? (
          <p className="text-neutral-400">Connect wallet to view apps</p>
        ) : deployments.length === 0 ? (
          <p className="text-neutral-400">No apps deployed yet</p>
        ) : (
          deployments.map((deployment, i) => (
            <SingleDeploymentCard
              key={i}
              deployment={deployment}
              onScaleSuccess={handleDeploySuccess}
              onMutate={handleDeploySuccess}
            />
          ))
        )}
      </div>
    </div>
  );
}
