"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { isConnected, requestAccess, getNetwork } from "@stellar/freighter-api";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Restore address from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("walletAddress");
    if (saved) {
      setWalletAddress(saved);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const connected = await isConnected();
      if (!connected.isConnected) {
        alert("Please install Freighter wallet extension");
        return;
      }

      // Always request access - returns address if already permitted
      const accessResult = await requestAccess();
      if (accessResult.error) {
        console.error("Access denied:", accessResult.error);
        return;
      }

      const { network } = await getNetwork();
      if (network !== "TESTNET") {
        alert("Please switch Freighter to Testnet");
        return;
      }

      const address = accessResult.address;
      setWalletAddress(address);
      localStorage.setItem("walletAddress", address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
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
    </nav>
  );
};

export default Navbar;
