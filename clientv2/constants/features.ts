export const features = [
  {
    icon: "Rocket",
    title: "Git Push to Production",
    description:
      "Point at a GitHub repo, pick a branch, and deploy. Tassium clones, builds, and ships your app to Docker Swarm automatically.",
  },
  {
    icon: "Cpu",
    title: "Multi-Arch Builds",
    description:
      "Docker Buildx builds amd64 and arm64 images in parallel. Deploy to any mix of x86 and ARM servers.",
  },
  {
    icon: "Network",
    title: "Tailscale Mesh",
    description:
      "Manager and worker nodes connect over WireGuard via Tailscale. Add any machine anywhere to your cluster.",
  },
  {
    icon: "ShieldCheck",
    title: "Auto SSL via Traefik",
    description:
      "Traefik v3 provisions Let's Encrypt certificates per app. Every deploy gets HTTPS with zero config.",
  },
  {
    icon: "Globe",
    title: "Subdomain Routing",
    description:
      "Each app gets a subdomain like myapp.tassium.roydevelops.tech. Traefik routes traffic and terminates TLS.",
  },
  {
    icon: "Search",
    title: "Framework Detection",
    description:
      "Auto-generates Dockerfiles for Next.js, Node.js, Python, and static sites. Just push your code.",
  },
] as const;
