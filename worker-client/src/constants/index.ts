export interface SingleProject {
  name: string;
  url: string;
  port: number;
  status: "success" | "failed" | "processing" | "pending";
  createdAt: Date;
  github: string;
  replicas: number;
}

export const deployments: SingleProject[] = [
  {
    name: "Simple Hello",
    url: "hello.example.com",
    port: 3000,
    status: "success",
    createdAt: new Date("2024-01-15"),
    github: "user/simple-hello",
    replicas: 3,
  },
  {
    name: "API Server",
    url: "api.example.com",
    port: 8080,
    status: "failed",
    createdAt: new Date("2024-01-18"),
    github: "user/api-server",
    replicas: 1,
  },
  {
    name: "Dashboard",
    url: "dash.example.com",
    port: 3001,
    status: "processing",
    createdAt: new Date("2024-01-20"),
    github: "user/dashboard",
    replicas: 2,
  },
  {
    name: "Auth Service",
    url: "auth.example.com",
    port: 4000,
    status: "success",
    createdAt: new Date("2024-01-22"),
    github: "user/auth-service",
    replicas: 4,
  },
];
