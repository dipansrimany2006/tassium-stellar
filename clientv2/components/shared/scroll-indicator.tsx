import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span className="text-text text-xs font-mono uppercase tracking-wider">
        Scroll
      </span>
      <ChevronDown className="w-4 h-4 text-text animate-bounce-subtle" />
    </div>
  );
}
