"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";

const Navbar = () => {
  const { walletAddress, isConnecting, connectWallet, disconnectWallet } =
    useWallet();

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
