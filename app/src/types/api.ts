export interface DeploymentResponse {
  id: string;
  appName: string;
  githubRepo: string;
  branch: string;
  port: number;
  creator: string;
  status: "pending" | "processing" | "success" | "failed";
  url: string | null;
  errorMessage: string | null;
  replicas: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeployRequest {
  appName: string;
  githubRepo: string;
  creator: string;
  branch: string;
  port: number;
}
