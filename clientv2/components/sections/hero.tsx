"use client";

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
  ArrowUpRight,
} from "lucide-react";
import BackgroundSquare from "../shared/background-square";
import { BackgroundBeam } from "../shared/background-beam";
import { motion } from "motion/react";

const fadeUp = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-200px)] mt-25 flex-col items-center justify-center max-w-8xl overflow-hidden px-6 mx-16 rounded-4xl backdrop-blur-xs">
      {/* Glow */}
      <GlowEffect
        size="lg"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Floating nodes */}
      <FloatingNode
        icon={<Container className="w-4 h-4" />}
        label="Docker"
        className="top-[20%] left-[20%]"
        delay={0}
      />
      <FloatingNode
        icon={<GitBranch className="w-4 h-4" />}
        label="main"
        className="top-[70%] right-[10%]"
        delay={1.2}
      />
      <FloatingNode
        icon={<ShieldCheck className="w-4 h-4" />}
        label="SSL Active"
        className="top-[20%] right-[20%]"
        delay={0.8}
      />
      <FloatingNode
        icon={<Activity className="w-4 h-4" />}
        label="Uptime"
        className="top-[70%] left-[10%]"
        delay={3}
      />

      <BackgroundSquare size={700} angle={30} x="90%" y="20%" />
      <BackgroundSquare size={500} angle={-45} x="10%" y="90%" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-8xl">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Badge className="mb-6 text-text border-text-muted/20 text-sm bg-text/5">Turn Idle Servers Into Income</Badge>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tighter leading-[1.05] max-w-6xl"
        >
          Make Your Hardware Work For You
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-xl text-text/50 leading-relaxed max-w-3xl"
        >
          Turn unused server capacity into a deploy platform. Your hardware, your uptime, your revenue. Tassium handles the rest.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex items-center gap-4"
        >
          <Button size="lg" variant="outline" href="https://app.tassium.io">
            <ArrowUpRight className="mr-2" /> Launch Dashboard
          </Button>
          <Button size="lg" href="https://github.com/silonelabs/tassium">
            View on GitHub
          </Button>
        </motion.div>
      </div>

      <ScrollIndicator />

    </section>
  );
}
