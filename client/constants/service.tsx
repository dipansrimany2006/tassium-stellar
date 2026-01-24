export const servicesData: serviceData[] = [
  {
    number: "01",
    title: "One-Click Deploy",
    description: "Push to GitHub, deploy instantly. Automatic builds, zero config.",
    details: [
      "GitHub integration",
      "Auto-detection of frameworks",
      "Environment variable management",
      "Custom domain support"
    ]
  },
  {
    number: "02",
    title: "Distributed Workers",
    description: "Run containers on your own machines or community nodes. You control the infrastructure.",
    details: [
      "Add any machine as worker",
      "Tailscale mesh networking",
      "Auto-scaling replicas",
      "Geographic distribution"
    ]
  },
  {
    number: "03",
    title: "Stellar Payments",
    description: "Pay for compute with crypto. Earn by sharing idle resources.",
    details: [
      "Freighter wallet integration",
      "Pay-per-use pricing",
      "Earn as node operator",
      "No credit card required"
    ]
  },
  {
    number: "04",
    title: "Self-Hosted",
    description: "Your data, your servers, your rules. No vendor lock-in.",
    details: [
      "Run manager on your infra",
      "Full data sovereignty",
      "Open source",
      "Docker-based architecture"
    ]
  }
]

export interface serviceData {
  number: string,
  title: string,
  description: string,
  details: string[]
}