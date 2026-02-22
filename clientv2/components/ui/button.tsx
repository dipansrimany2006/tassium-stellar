import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-accent text-bg hover:bg-accent-hover",
        outline:
          "border border-border bg-transparent text-text hover:border-border-hover hover:bg-bg-secondary",
        ghost: "text-text-muted hover:text-text hover:bg-bg-secondary",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export function Button({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <a
        href={href}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
