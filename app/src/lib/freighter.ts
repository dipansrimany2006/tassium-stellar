import {
  isConnected,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

export async function checkFreighterConnection(): Promise<boolean> {
  try {
    const connected = await isConnected();
    return connected;
  } catch {
    return false;
  }
}

export async function connectWallet(): Promise<string | null> {
  try {
    const connected = await isConnected();
    if (!connected) {
      throw new Error("Freighter is not installed");
    }

    const addressObj = await getAddress();
    return addressObj.address;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    return null;
  }
}

export async function signTx(xdr: string): Promise<string> {
  const result = await signTransaction(xdr, {
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });

  return result.signedTxXdr;
}
