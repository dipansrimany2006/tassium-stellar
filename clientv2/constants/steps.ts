export const steps = [
  {
    step: 1,
    title: "Connect Repo",
    description: "Paste a GitHub URL, pick a branch, name your app.",
  },
  {
    step: 2,
    title: "Build Image",
    description:
      "Buildx creates multi-arch images and pushes to your private registry.",
  },
  {
    step: 3,
    title: "Deploy to Swarm",
    description:
      "A stack YAML is generated with Traefik labels and rolled out via Docker Swarm.",
  },
  {
    step: 4,
    title: "Live with SSL",
    description:
      "Traefik picks up the service, provisions a TLS cert, and your app is live.",
  },
] as const;
