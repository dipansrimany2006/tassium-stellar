export interface ContainerInfo {
  containerName: string;
  port: string;
}

export interface HeartbeatPayload {
  walletAddress: string;
  timestamp: string;
  containers: ContainerInfo[];
}

export interface UptimeRecord {
  startTime: string;
  endTime: string;
}
