"use client";

import { techLogos } from "@/constants/logos";
import { motion } from "motion/react";

export function Logos() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="border-y border-border py-10 overflow-hidden"
    >
      <p className="text-center text-xs font-mono uppercase tracking-widest text-text-muted mb-8">
        Works with
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg to-transparent z-10" />

        <div className="flex animate-marquee w-max">
          {[...techLogos, ...techLogos].map((logo, i) => (
            <div
              key={`${logo}-${i}`}
              className="flex items-center justify-center px-8 text-text-muted/40 hover:text-text-muted transition-colors"
            >
              <span className="text-sm font-mono whitespace-nowrap">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
