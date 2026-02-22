export interface SystemMetrics {
  cpuCores: number;
  cpuUsagePercent: number;
  ramTotalGb: number;
  ramUsedGb: number;
  storageTotalGb: number;
  storageUsedGb: number;
}

export interface ContainerInfo {
  name: string;
  cpuPercent?: number;
  memUsageMb?: number;
}

export interface HeartbeatPayload {
  walletAddress: string;
  timestamp: string;
  containers: ContainerInfo[];
  tailscaleIp?: string;
  hostname?: string;
  system?: SystemMetrics;
}

export interface PingPayload {
  walletAddress: string;
  timestamp: string;
}

export interface UptimeRecord {
  startTime: string;
  endTime: string;
}
