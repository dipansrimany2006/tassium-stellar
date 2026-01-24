export interface DeployRequest {
  github_repo: string;
  app_name: string;
  branch?: string;
  port?: number;
  env_vars?: Record<string, string>;
}

export interface DeployResponse {
  status: "success" | "error";
  url?: string;
  app_name?: string;
  build_id?: string;
  message?: string;
}

export interface BuildContext {
  appName: string;
  buildId: string;
  buildDir: string;
  imageName: string;
  port: number;
  envVars: Record<string, string>;
}
