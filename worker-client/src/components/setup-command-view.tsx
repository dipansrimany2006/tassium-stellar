"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import Image from "next/image";

export function SetupCommandView({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const command = `curl -s ${origin}/api/setup?wallet=${walletAddress} | sh`;

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 px-4">
      <Image src="/TASSIUM.png" alt="Tassium" width={120} height={120} />
      <p className="text-neutral-400 text-lg text-center">
        Run this command on your server to join the network
      </p>
      <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 p-4 max-w-2xl w-full">
        <code className="flex-1 text-sm text-white font-mono break-all">
          {command}
        </code>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyCommand}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
