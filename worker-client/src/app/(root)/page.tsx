"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  cpuCores?: number;
  ramTotalGb?: number;
  storageTotalGb?: number;
  status?: string;
}

interface Container {
  name: string;
  cpuPercent?: number;
  memUsageMb?: number;
}

export interface MetricsPoint {
  timestamp: string;
  cpuUsagePercent: number;
  ramUsedGb: number;
  ramTotalGb: number;
  creditsEarned: number;
  containerCount: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_TASSIUM_API_URL ||
  "https://api.silonelabs.workers.dev";

const Page = () => {
  const { walletAddress, connectWallet, isConnecting } = useWallet();
  const [workerData, setWorkerData] = useState<WorkerData | null>(null);
  const [containers, setContainers] = useState<Container[]>([]);
  const [metrics, setMetrics] = useState<MetricsPoint[]>([]);
  const [liveStatus, setLiveStatus] = useState<string>("UNKNOWN");
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
        name: c.name || c.containerName,
        cpuPercent: c.cpuPercent,
        memUsageMb: c.memUsageMb,
      }));
      setContainers(mapped);
    } catch (error) {
      console.error("Failed to fetch worker data:", error);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  const fetchStatus = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/workers/${walletAddress}/status`);
      const data = await res.json();
      setLiveStatus(data.status || "UNKNOWN");
    } catch {}
  }, [walletAddress]);

  const fetchMetrics = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/workers/${walletAddress}/metrics?hours=1`);
      const data = await res.json();
      setMetrics(data || []);
    } catch {}
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;

    fetchWorkerData();
    fetchStatus();
    fetchMetrics();

    // 15s status poll, 30s worker data, 60s metrics
    const statusInterval = setInterval(fetchStatus, 15000);
    const dataInterval = setInterval(fetchWorkerData, 30000);
    const metricsInterval = setInterval(fetchMetrics, 60000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(dataInterval);
      clearInterval(metricsInterval);
    };
  }, [walletAddress, fetchWorkerData, fetchStatus, fetchMetrics]);

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

  if (!workerData?.exists) {
    return <SetupCommandView walletAddress={walletAddress} />;
  }

  return (
    <div className="w-full h-full grid grid-cols-9 gap-5">
      <div className="col-span-3 h-full">
        <DataView
          credits={workerData.credits}
          ipAddress={workerData.tailscaleIp || "---"}
          status={liveStatus}
          cpuCores={workerData.cpuCores}
          ramTotalGb={workerData.ramTotalGb}
          storageTotalGb={workerData.storageTotalGb}
          onRefetch={fetchWorkerData}
          isRefetching={loading}
        />
      </div>

      <div className="col-span-6 flex flex-col gap-5 max-h-screen overflow-hidden">
        <ChartArea metrics={metrics} />
      </div>
      <div className="w-full col-span-9">
        <ContainerArea containers={containers} />
      </div>
    </div>
  );
};

export default Page;
