import Image from "next/image";
import { Button } from "../ui/button";
import { RefreshCw, Cpu, MemoryStick, HardDrive } from "lucide-react";

const STATUS_CONFIG: Record<string, { bg: string; border: string; dot: string; text: string; label: string }> = {
  HEALTHY: { bg: "bg-green-500/10", border: "border-green-500/30", dot: "bg-green-400 animate-pulse", text: "text-green-400", label: "Online" },
  WARNING: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", dot: "bg-yellow-400 animate-pulse", text: "text-yellow-400", label: "Warning" },
  DEAD: { bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-400", text: "text-red-400", label: "Offline" },
  UNKNOWN: { bg: "bg-neutral-500/10", border: "border-neutral-500/30", dot: "bg-neutral-400", text: "text-neutral-400", label: "Unknown" },
};

const DataView = ({
  credits,
  ipAddress,
  status,
  cpuCores,
  ramTotalGb,
  storageTotalGb,
  onRefetch,
  isRefetching,
}: {
  credits: number;
  ipAddress: string;
  status: string;
  cpuCores?: number;
  ramTotalGb?: number;
  storageTotalGb?: number;
  onRefetch?: () => void;
  isRefetching?: boolean;
}) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.UNKNOWN;

  return (
    <div className="border border-neutral-700 h-full bg-neutral-800 p-6 flex flex-col">
      {/* Status banner */}
      <div
        className={`-mx-6 -mt-6 px-6 py-4 mb-6 flex items-center justify-between ${s.bg} border-b ${s.border}`}
      >
        <span className="text-neutral-300 text-xs font-semibold uppercase tracking-widest">
          Worker Status
        </span>
        <div className="flex items-center gap-2">
          {onRefetch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefetch}
              disabled={isRefetching}
              className="h-6 w-6"
            >
              <RefreshCw
                className={`h-3 w-3 ${isRefetching ? "animate-spin" : ""}`}
              />
            </Button>
          )}
          <div className={`w-2 h-2 rounded-full ${s.dot}`} />
          <span className={`text-sm font-bold uppercase tracking-wide ${s.text}`}>
            {s.label}
          </span>
        </div>
      </div>

      {/* Credits - hero section */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="flex items-center gap-3 mb-2">
          <Image src="/TASSIUM.png" height={28} width={28} alt="credits" />
          <span className="text-neutral-500 text-xs uppercase tracking-widest">
            Available Credits
          </span>
        </div>
        <span className="text-5xl font-bold text-white tabular-nums">
          {credits.toLocaleString()}
        </span>
      </div>

      {/* Resource capacity cards */}
      {(cpuCores || ramTotalGb || storageTotalGb) && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-neutral-700/50 p-3 flex flex-col items-center">
            <Cpu className="h-4 w-4 text-neutral-400 mb-1" />
            <span className="text-white text-sm font-bold">{cpuCores ?? "—"}</span>
            <span className="text-neutral-500 text-[10px] uppercase">Cores</span>
          </div>
          <div className="bg-neutral-700/50 p-3 flex flex-col items-center">
            <MemoryStick className="h-4 w-4 text-neutral-400 mb-1" />
            <span className="text-white text-sm font-bold">{ramTotalGb?.toFixed(1) ?? "—"}</span>
            <span className="text-neutral-500 text-[10px] uppercase">GB RAM</span>
          </div>
          <div className="bg-neutral-700/50 p-3 flex flex-col items-center">
            <HardDrive className="h-4 w-4 text-neutral-400 mb-1" />
            <span className="text-white text-sm font-bold">{storageTotalGb?.toFixed(0) ?? "—"}</span>
            <span className="text-neutral-500 text-[10px] uppercase">GB Disk</span>
          </div>
        </div>
      )}

      {/* IP Address */}
      <div className="border-t border-neutral-700 pt-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-neutral-500 text-xs uppercase tracking-widest">
            IP Address
          </span>
          <code className="bg-neutral-700 border border-neutral-700 px-4 py-2 text-sm font-mono text-white">
            {ipAddress}
          </code>
        </div>
      </div>

      {/* Claim button */}
      <Button
        className="w-full rounded-none py-6 mt-2 text-sm font-semibold uppercase tracking-wider"
        variant="outline"
        disabled={true}
      >
        Claim Rewards
      </Button>
    </div>
  );
};

export default DataView;
