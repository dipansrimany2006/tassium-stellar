"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { isConnected, requestAccess, getNetwork } from "@stellar/freighter-api";

interface WalletContextType {
  walletAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

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

  return (
    <WalletContext.Provider
      value={{ walletAddress, isConnecting, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
