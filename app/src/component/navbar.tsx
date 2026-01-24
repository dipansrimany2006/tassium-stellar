"use client";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@/context/wallet-context";

const Navbar = () => {
  const { walletAddress, connectWallet, disconnectWallet, isConnected } = useWallet();

  const handleClick = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <nav>
      <Link href="/" className="logo flex items-center gap-2">
        <Image src="/TASSIUM.png" alt="Tassium Logo" width={38} height={38} />
        TASSIUM
      </Link>
      <div className="nav-links">
        <button
          onClick={handleClick}
          style={{
            background: "#ffffff",
            color: "#000000",
            border: "none",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "2px",
            cursor: "pointer",
          }}
        >
          {walletAddress
            ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
