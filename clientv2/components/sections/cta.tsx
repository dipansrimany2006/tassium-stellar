"use client";

import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/shared/glow-effect";
import { motion } from "motion/react";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-32 px-6">
      <GlowEffect
        size="md"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-6xl text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Start Earning From What You Already Own
        </h2>
        <p className="mt-4 text-text/50 text-lg">
          Five minutes to set up. Zero monthly fees. Unlimited deploys on your own iron.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button size="lg" href="https://app.tassium.io">
            Start Deploying
          </Button>
          <Button
            size="lg"
            variant="outline"
            href="/docs"
          >
            Read the Docs
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
