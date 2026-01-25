"use client";

import { useState, useEffect, useCallback } from "react";
import DataView from "@/components/cards/data-view";
import { ChartArea } from "@/components/charts/page";
import { ContainerArea } from "@/components/container/containerArea";
import { SetupCommandView } from "@/components/setup-command-view";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";
import Image from "next/image";

interface WorkerData {
  exists: boolean;
  credits: number;
  tailscaleIp: string | null;
  isActive: boolean;
  lastSeen: string | null;
}

interface Container {
  name: string;
  port: string;
}

// Extract port number from Docker format "3000/tcp" or "0.0.0.0:3000->3000/tcp"
const parsePort = (port: string): string => {
  if (!port) return "—";
  const match = port.match(/(\d+)/);
  return match ? match[1] : port;
};

const API_URL =
  process.env.NEXT_PUBLIC_TASSIUM_API_URL ||
  "https://api.silonelabs.workers.dev";

const Page = () => {
  const { walletAddress, connectWallet, isConnecting } = useWallet();
  const [workerData, setWorkerData] = useState<WorkerData | null>(null);
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkerData = useCallback(async () => {
    if (!walletAddress) return;

    setLoading(true);
    try {
      const [workerRes, containersRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/workers/${walletAddress}`),
        fetch(`${API_URL}/api/v1/workers/${walletAddress}/containers`),
      ]);

      const worker = await workerRes.json();
      const containerData = await containersRes.json();

      setWorkerData(worker);
      const mapped = (containerData || []).map((c: any) => ({
        name: c.containerName || c.name,
        port: parsePort(c.port),
      }));
      setContainers(mapped);
    } catch (error) {
      console.error("Failed to fetch worker data:", error);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchWorkerData();
      const interval = setInterval(fetchWorkerData, 30000);
      return () => clearInterval(interval);
    }
  }, [walletAddress, fetchWorkerData]);

  if (!walletAddress) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <Image
          src="/TASSIUM.png"
          className="mt-6"
          alt="Tassium"
          width={120}
          height={120}
        />
        <p className="text-neutral-400 text-lg">
          Connect wallet to view your worker
        </p>
        <Button
          className="p-6 px-8 rounded-none"
          variant="outline"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    );
  }

  if (loading && !workerData) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
        <Image src="/TASSIUM.png" alt="Tassium" width={120} height={120} />
        <p className="text-neutral-400 text-lg">Loading...</p>
      </div>
    );
  }

  // No worker exists - show setup command
  if (!workerData?.exists) {
    return <SetupCommandView walletAddress={walletAddress} />;
  }

  // Worker exists - show dashboard
  return (
    <div className="w-full h-full grid grid-cols-9 gap-5">
      <div className="col-span-3 h-full">
        <DataView
          credits={workerData.credits}
          ipAddress={workerData.tailscaleIp || "---"}
          status={workerData.isActive ? "up" : "down"}
          onRefetch={fetchWorkerData}
          isRefetching={loading}
        />
      </div>

      <div className="col-span-6 flex flex-col gap-5 max-h-screen overflow-hidden">
        <ChartArea />
      </div>
      <div className="w-full col-span-9">
        <ContainerArea containers={containers} />
      </div>
    </div>
  );
};

export default Page;
