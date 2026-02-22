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
        "absolute hidden md:flex items-center gap-2 rounded-lg border border-border bg-bg-secondary/80 backdrop-blur-sm px-3 py-2 text-xs animate-float",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="text-accent">{icon}</span>
      <div className="flex flex-col">
        <span className="text-text font-medium">{label}</span>
        {value && (
          <span className="text-text-muted font-mono text-[10px]">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
