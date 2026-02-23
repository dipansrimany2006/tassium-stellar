import * as StellarSdk from "@stellar/stellar-sdk";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { CONTRACT_ID, RPC_URL } from "./config";

const server = new StellarRpc.Server(RPC_URL);

/**
 * Build a subscription deposit transaction.
 * Calls the router contract's `deposit(wallet, amount, date)` which
 * transfers XLM to project wallet + records the deposit in one tx.
 */
export async function buildSubscriptionDepositTx(
  depositorAddress: string,
  amount: bigint,
  date: bigint
): Promise<string> {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(depositorAddress);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(
      contract.call(
        "deposit",
        StellarSdk.Address.fromString(depositorAddress).toScVal(),
        StellarSdk.nativeToScVal(amount, { type: "i128" }),
        StellarSdk.nativeToScVal(date, { type: "u64" })
      )
    )
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  return preparedTx.toEnvelope().toXDR("base64");
}

/**
 * Get deposit history for a wallet (read-only simulation).
 */
export async function getDeposits(
  callerAddress: string,
  walletAddress: string
) {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(callerAddress);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(
      contract.call(
        "get_deposits",
        StellarSdk.Address.fromString(walletAddress).toScVal()
      )
    )
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  if (StellarRpc.Api.isSimulationSuccess(result) && result.result) {
    return StellarSdk.scValToNative(result.result.retval);
  }

  return [];
}

/**
 * Get the last subscription date for a wallet (read-only simulation).
 */
export async function getLastSubscriptionDate(
  callerAddress: string,
  walletAddress: string
): Promise<number> {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(callerAddress);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(
      contract.call(
        "get_last_subscription_date",
        StellarSdk.Address.fromString(walletAddress).toScVal()
      )
    )
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  if (StellarRpc.Api.isSimulationSuccess(result) && result.result) {
    return StellarSdk.scValToNative(result.result.retval);
  }

  return 0;
}

/**
 * Submit a signed transaction and wait for confirmation.
 */
export async function submitTransaction(signedXdr: string): Promise<StellarRpc.Api.GetTransactionResponse> {
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    StellarSdk.Networks.PUBLIC
  );

  const txResult = await server.sendTransaction(signedTx);

  if (txResult.status !== "PENDING") {
    throw new Error(`Transaction failed: ${txResult.status}`);
  }

  let getResponse = await server.getTransaction(txResult.hash);

  while (getResponse.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    getResponse = await server.getTransaction(txResult.hash);
  }

  return getResponse;
}

// Helper to convert XLM to stroops (1 XLM = 10^7 stroops)
export function xlmToStroops(xlm: number): bigint {
  return BigInt(Math.floor(xlm * 10_000_000));
}

// Helper to convert stroops to XLM
export function stroopsToXlm(stroops: bigint | string): string {
  const stroopsNum = typeof stroops === 'string' ? BigInt(stroops) : stroops;
  return (Number(stroopsNum) / 10_000_000).toFixed(7);
}
