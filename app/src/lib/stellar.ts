import * as StellarSdk from "@stellar/stellar-sdk";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { CONTRACT_ID, RPC_URL, NATIVE_XLM_SAC } from "./config";

const server = new StellarRpc.Server(RPC_URL);

export async function getBalance(address: string): Promise<string> {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(address);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      contract.call("get_balance", StellarSdk.Address.fromString(address).toScVal())
    )
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  if (StellarRpc.Api.isSimulationSuccess(result) && result.result) {
    const returnValue = result.result.retval;
    return StellarSdk.scValToNative(returnValue).toString();
  }

  return "0";
}

export async function buildInitializeTx(adminAddress: string): Promise<string> {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(adminAddress);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        "initialize",
        StellarSdk.Address.fromString(NATIVE_XLM_SAC).toScVal()
      )
    )
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  return preparedTx.toEnvelope().toXDR("base64");
}

export async function buildDepositTx(
  depositorAddress: string,
  amount: bigint
): Promise<string> {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(depositorAddress);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        "deposit",
        StellarSdk.Address.fromString(depositorAddress).toScVal(),
        StellarSdk.nativeToScVal(amount, { type: "i128" })
      )
    )
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  return preparedTx.toEnvelope().toXDR("base64");
}

export async function buildWithdrawTx(
  withdrawerAddress: string,
  amount: bigint
): Promise<string> {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(withdrawerAddress);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        "withdraw",
        StellarSdk.Address.fromString(withdrawerAddress).toScVal(),
        StellarSdk.nativeToScVal(amount, { type: "i128" })
      )
    )
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  return preparedTx.toEnvelope().toXDR("base64");
}

export async function submitTransaction(signedXdr: string): Promise<StellarRpc.Api.GetTransactionResponse> {
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    StellarSdk.Networks.TESTNET
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
