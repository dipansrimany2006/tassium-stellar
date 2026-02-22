"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface BackgroundBeamProps {
  color?: string;
  delay?: number;
  x?: string;
  y?: string;
  length?: number;
  pathLength?: string;
  duration?: number;
  className?: string;
}

export function BackgroundBeam({
  color = "rgba(214, 239, 255, 0.6)",
  delay = 0,
  x = "50%",
  y = "0%",
  length = 120,
  pathLength = "100%",
  duration = 5,
  className,
}: BackgroundBeamProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none -z-10 overflow-hidden",
        className
      )}
    >
      {/* Static track line */}
      <div
        className="absolute w-px opacity-[0.05]"
        style={{
          left: x,
          top: y,
          height: pathLength,
          background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
        }}
      />

      {/* Animated beam */}
      <motion.div
        className="absolute w-px rounded-full"
        style={{
          left: x,
          height: length,
          background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
        }}
        initial={{ top: y, opacity: 0 }}
        animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay,
          repeatDelay: duration * 0.5,
        }}
      />
    </div>
  );
}
