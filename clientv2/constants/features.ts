export const features = [
  {
    icon: "Rocket",
    title: "One-Click Deploy",
    description:
      "Push to GitHub, deploy instantly. Automatic Dockerfile detection and builds with zero config.",
  },
  {
    icon: "Cpu",
    title: "Multi-Arch Builds",
    description:
      "Buildx-powered amd64 and arm64 images built automatically. Run on any hardware.",
  },
  {
    icon: "Network",
    title: "Tailscale Mesh",
    description:
      "Secure node-to-node networking via WireGuard tunnels. Add any machine to your cluster.",
  },
  {
    icon: "ShieldCheck",
    title: "Auto SSL",
    description:
      "Traefik v3 handles TLS certificates automatically. Every app gets HTTPS out of the box.",
  },
  {
    icon: "Globe",
    title: "Custom Domains",
    description:
      "Map any domain to your deployed services. Automatic DNS and routing configuration.",
  },
  {
    icon: "Search",
    title: "Auto-Detect Frameworks",
    description:
      "Dockerfile generation for Node.js, Python, Go, Bun, and more. Just push your code.",
  },
] as const;
