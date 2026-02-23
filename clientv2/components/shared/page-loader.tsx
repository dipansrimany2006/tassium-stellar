"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hasLoaded");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 20);

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("hasLoaded", "true");
    }, 600);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-bg"
        >
          <div className="flex flex-col items-center gap-10">
            {/* Rotating square */}
            <motion.div
              animate={{ rotate: [0, 180, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              className="relative h-20 w-20 border-2 border-accent md:h-20 md:w-20"
            >
              <motion.div
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 origin-top bg-accent"
              />
            </motion.div>

            {/* Text */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl font-black tracking-[8px] text-text md:text-5xl">
                TASSIUM
              </span>
              <span className="min-w-[60px] text-center text-sm font-bold tracking-[4px] text-text-muted tabular-nums">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
