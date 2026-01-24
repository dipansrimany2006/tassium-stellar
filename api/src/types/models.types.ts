export interface SingleProject {
  name: string;
  url: string;
  port: number;
  status: "success" | "failed" | "processing" | "pending";
  createdAt: Date;
  github: string;
  replicas: number;
  creator: string;
}

export interface Payment {
  name: string;
  amount: string;
  createdAt: string;
  creator: string;
}

export interface Worker {
  walletAddress: string;
  uptime: WorkerUptimeRecord[];
}

export interface WorkerUptimeRecord {
  creator: Worker;
  timeFrom: Date;
  timeTo: Date;
}
