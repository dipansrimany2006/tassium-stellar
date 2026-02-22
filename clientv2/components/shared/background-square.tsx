import { cn } from "@/lib/utils";

interface BackgroundSquareProps {
  size?: number;
  angle?: number;
  x?: string;
  y?: string;
  className?: string;
}

const BackgroundSquare = ({
  size = 300,
  angle = 15,
  x = "50%",
  y = "50%",
  className,
}: BackgroundSquareProps) => {
  return (
    <div
      className={cn("absolute pointer-events-none -z-10", className)}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        background:
          "linear-gradient(135deg, #6b7f96 0%, #B4C9B6 50%, #6b7f96 100%)",
        filter: `blur(${Math.round(size * 0.25)}px)`
      }}
    />
  );
};

export default BackgroundSquare;
