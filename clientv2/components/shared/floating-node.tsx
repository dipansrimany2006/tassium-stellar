"use client";

import { cn } from "@/lib/utils";

interface FloatingNodeProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  className?: string;
  delay?: number;
}

export function FloatingNode({
  icon,
  label,
  value,
  className,
  delay = 0,
}: FloatingNodeProps) {
  return (
    <div
      className={cn(
        "absolute hidden md:flex items-center gap-2 rounded-3xl border border-accent/30 bg-bg-secondary/50 backdrop-blur-sm px-3 py-2",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="text-accent">{icon}</span>
      <div className="flex flex-col">
        <span className="text-text/80 font-medium text-lg">{label}</span>
        {value && (
          <span className="text-text-muted font-mono text-xs">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
