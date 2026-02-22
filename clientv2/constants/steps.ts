export const steps = [
  {
    step: 1,
    title: "Connect",
    description: "Link your GitHub repository and select a branch to deploy.",
  },
  {
    step: 2,
    title: "Detect",
    description:
      "Framework auto-detected. Dockerfile generated if one doesn't exist.",
  },
  {
    step: 3,
    title: "Build",
    description:
      "Multi-arch image built with Buildx and pushed to your private registry.",
  },
  {
    step: 4,
    title: "Deploy",
    description:
      "App goes live on your infrastructure with SSL and routing in seconds.",
  },
] as const;
