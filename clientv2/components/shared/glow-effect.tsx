import { cn } from "@/lib/utils";

interface GlowEffectProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function GlowEffect({ className, size = "md" }: GlowEffectProps) {
  const sizeClasses = {
    sm: "w-[400px] h-[400px]",
    md: "w-[600px] h-[600px]",
    lg: "w-[900px] h-[900px]",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-full bg-accent-glow blur-3xl animate-pulse-glow",
        sizeClasses[size],
        className
      )}
      aria-hidden
    />
  );
}
