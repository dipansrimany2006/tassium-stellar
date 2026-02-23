import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-secondary p-6 transition-colors hover:border-border-hover",
        className
      )}
      {...props}
    />
  );
}
