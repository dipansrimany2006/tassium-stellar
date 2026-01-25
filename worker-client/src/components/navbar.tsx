"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWallet } from "@/context/wallet-context";
import { Terminal, Copy, Check } from "lucide-react";

const Navbar = () => {
  const { walletAddress, isConnecting, connectWallet, disconnectWallet } =
    useWallet();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const command = `curl -s ${origin}/api/setup?wallet=${walletAddress} | sh`;

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="h-20 md:h-[100px] text-white border-b border-white/20 flex items-center justify-between ">
      <div className="flex items-center gap-3">
        <Image
          src="/TASSIUM.png"
          alt="TASSIUM"
          width={40}
          height={40}
          className="md:w-12 md:h-12"
        />
        <span className="font-bold tracking-tight text-xl md:text-2xl">
          TASSIUM
        </span>
      </div>
      <div className="flex items-center gap-2">
        {walletAddress && (
          <Button
            variant="outline"
            onClick={() => setDialogOpen(true)}
            className="px-4 py-6 rounded-none border-white/20 text-white hover:bg-white/10"
          >
            <Terminal className="h-4 w-4 mr-2" />
            Setup
          </Button>
        )}
        {walletAddress ? (
          <Button
            onClick={disconnectWallet}
            className="bg-white uppercase text-black px-8 py-6 hover:bg-white/90 font-bold rounded-none"
          >
            {truncateAddress(walletAddress)}
          </Button>
        ) : (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-white uppercase text-black px-8 py-6 hover:bg-white/90 font-bold rounded-none"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700 text-white rounded-none">
          <DialogHeader>
            <DialogTitle>Worker Setup Command</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Run this command on your server to join the network
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 p-4">
            <code className="flex-1 text-sm text-white font-mono truncate">
              curl -s .../api/setup | sh
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyCommand}
              className="shrink-0 hover:bg-neutral-700"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
