import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingNode } from "@/components/shared/floating-node";
import { GlowEffect } from "@/components/shared/glow-effect";
import { ScrollIndicator } from "@/components/shared/scroll-indicator";
import {
  Container,
  GitBranch,
  Globe,
  ShieldCheck,
  Server,
  Activity,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
      {/* Glow */}
      <GlowEffect
        size="lg"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Floating nodes */}
      <FloatingNode
        icon={<Container className="w-3.5 h-3.5" />}
        label="Docker"
        value="3 replicas"
        className="top-[18%] left-[8%]"
        delay={0}
      />
      <FloatingNode
        icon={<GitBranch className="w-3.5 h-3.5" />}
        label="main"
        value="deployed"
        className="top-[25%] right-[10%]"
        delay={1.2}
      />
      <FloatingNode
        icon={<Globe className="w-3.5 h-3.5" />}
        label="us-east"
        value="healthy"
        className="bottom-[30%] left-[12%]"
        delay={2.4}
      />
      <FloatingNode
        icon={<ShieldCheck className="w-3.5 h-3.5" />}
        label="SSL Active"
        className="top-[15%] right-[25%]"
        delay={0.8}
      />
      <FloatingNode
        icon={<Server className="w-3.5 h-3.5" />}
        label="Worker-01"
        value="4 apps"
        className="bottom-[25%] right-[8%]"
        delay={1.8}
      />
      <FloatingNode
        icon={<Activity className="w-3.5 h-3.5" />}
        label="Uptime"
        value="99.9%"
        className="top-[40%] left-[5%]"
        delay={3}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        <Badge className="mb-6">Open Source Container Platform</Badge>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
          Deploy to Your{" "}
          <span className="text-accent">Infrastructure</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-text-muted leading-relaxed">
          One-click deploys from GitHub to your own servers. Multi-arch builds,
          Tailscale mesh, auto SSL. No vendor lock-in.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <Button size="lg" href="https://app.tassium.io">
            Start Deploying
          </Button>
          <Button
            size="lg"
            variant="outline"
            href="https://github.com/silonelabs/tassium"
          >
            View on GitHub
          </Button>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
