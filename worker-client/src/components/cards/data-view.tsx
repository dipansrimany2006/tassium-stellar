import Image from "next/image";
import { Button } from "../ui/button";

const DataView = ({
  credits,
  ipAddress,
  status,
}: {
  credits: number;
  ipAddress: string;
  status: "up" | "down";
}) => {
  return (
    <div className="border border-neutral-700 h-full bg-neutral-800 p-6 flex flex-col">
      {/* Status banner */}
      <div
        className={`-mx-6 -mt-6 px-6 py-4 mb-6 flex items-center justify-between ${
          status === "up"
            ? "bg-green-500/10 border-b border-green-500/30"
            : "bg-red-500/10 border-b border-red-500/30"
        }`}
      >
        <span className="text-neutral-300 text-xs font-semibold uppercase tracking-widest">
          Worker Status
        </span>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status === "up" ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          />
          <span
            className={`text-sm font-bold uppercase tracking-wide ${
              status === "up" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status === "up" ? "Online" : "Offline"}
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
