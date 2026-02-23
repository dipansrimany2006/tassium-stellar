"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  checkFreighterConnection,
  connectWallet,
  signTx,
} from "@/lib/freighter";
import {
  buildSubscriptionDepositTx,
  submitTransaction,
  xlmToStroops,
} from "@/lib/stellar";

const API_URL = "https://api.silonelabs.workers.dev";

interface ScaleDialogProps {
  children: React.ReactNode;
  appName: string;
  currentScale?: number;
  onScale?: (scale: number) => Promise<void>;
  onScaleSuccess?: () => void;
}

export function ScaleDialog({
  children,
  appName,
  currentScale = 1,
  onScale,
  onScaleSuccess,
}: ScaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedScale, setSelectedScale] = useState(currentScale);
  const [isScaling, setIsScaling] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [freighterInstalled, setFreighterInstalled] = useState<boolean>(false);

  const isPaid = selectedScale >= 3;
  const xlmCost = (selectedScale * 0.1).toFixed(3);

  useEffect(() => {
    checkFreighterConnection().then(setFreighterInstalled);
  }, []);

  const handleScale = async () => {
    setIsScaling(true);
    setStatus("");

    try {
      if (isPaid) {
        // Connect wallet if not connected
        let address = walletAddress;
        if (!address) {
          setStatus("Connecting wallet...");
          address = await connectWallet();
          if (!address) {
            setStatus("Failed to connect wallet");
            setIsScaling(false);
            return;
          }
          setWalletAddress(address);
        }

        // Single transaction: XLM transfer + deposit record via contract
        setStatus("Building transaction...");
        const amountInStroops = xlmToStroops(selectedScale * 0.1);
        const now = BigInt(Math.floor(Date.now() / 1000));
        const xdr = await buildSubscriptionDepositTx(address, amountInStroops, now);

        setStatus("Please sign the transaction in Freighter...");
        const signedXdr = await signTx(xdr);

        setStatus("Submitting transaction...");
        const result = await submitTransaction(signedXdr);

        if (result.status !== "SUCCESS") {
          setStatus(`Transaction failed: ${result.status}`);
          setIsScaling(false);
          return;
        }

        setStatus(`Paid ${xlmCost} XLM successfully!`);
      }

      // Persist replicas to DB
      await fetch(`${API_URL}/api/v1/deployments/${appName}/replicas`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replicas: selectedScale }),
      });

      if (onScale) {
        await onScale(selectedScale);
      }

      if (onScaleSuccess) {
        onScaleSuccess();
      }

      if (!isPaid) {
        setStatus("Scaled successfully!");
      }

      setTimeout(() => {
        setOpen(false);
        setStatus("");
      }, 1500);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }

    setIsScaling(false);
  };

  const scaleBoxes = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-none bg-neutral-900 min-h-[300px] py-10">
        <DialogHeader>
          <DialogTitle>Scale</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 mt-6">
          {isPaid && !freighterInstalled && (
            <div className="bg-yellow-900/50 border border-yellow-600 p-3 text-sm">
              <p className="text-yellow-200">
                Freighter wallet is not installed.{" "}
                <a
                  href="https://www.freighter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Install Freighter
                </a>
              </p>
            </div>
          )}

          <div className="flex h-10 w-full border border-neutral-600">
            {scaleBoxes.map((scale) => (
              <button
                key={scale}
                onClick={() => setSelectedScale(scale)}
                className={`flex-1 border-r border-neutral-600 last:border-r-0 transition-colors ${
                  scale <= selectedScale
                    ? "bg-white"
                    : "bg-transparent hover:bg-neutral-800"
                }`}
                aria-label={`Scale to ${scale}`}
              />
            ))}
          </div>

          {/* <p className="text-sm text-neutral-400 text-center">
            Deposit {selectedScale} XLM to scale {appName}
          </p> */}

          <Button
            onClick={handleScale}
            disabled={isScaling || (isPaid && !freighterInstalled)}
            className="w-full"
          >
            {isScaling
              ? "Processing..."
              : isPaid
                ? `${selectedScale}X Scale (${xlmCost} XLM)`
                : `${selectedScale}X Scale (Free)`}
          </Button>

          {status && (
            <p className={`text-sm text-center ${
              status.includes("Error") || status.includes("failed")
                ? "text-red-400"
                : status.includes("successfully")
                ? "text-green-400"
                : "text-white"
            }`}>
              {status}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
