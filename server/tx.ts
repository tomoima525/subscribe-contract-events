/**
 * Wait transactions to be mined.
 *
 */

import { AlchemyEth, AlchemyWeb3 } from "@alch/alchemy-web3";
import { TransactionReceipt, TransactionConfig } from "web3-eth";

const DEFAULT_INTERVAL = 1000;

interface Options {
  interval: number;
}

const sleep = async (interval: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, interval);
  });

/**
 * Wait for transaction to confirm.
 *
 * @param eth Alchemy eth
 * @param txHash A transaction hash
 * @param options Wait timers
 * @return Transaction receipt
 */
export const waitTransaction = async (
  eth: AlchemyEth,
  txHash: string,
  options?: Options
) => {
  const interval = options?.interval || DEFAULT_INTERVAL;
  let receipt = await eth.getTransactionReceipt(txHash);
  while (!receipt) {
    const d = Date.now();
    receipt = await eth.getTransactionReceipt(txHash);
    console.log(`waiting ${txHash}, time:${d.toString()}`);
    await sleep(interval);
  }
  return receipt;
};

/**
 * Check if the transaction was success based on the receipt.
 *
 * https://ethereum.stackexchange.com/a/45967/620
 *
 * @param receipt Transaction receipt
 */
export const isSuccessfulTransaction = (receipt: any): boolean => {
  if (receipt.status == "0x1" || receipt.status == 1) {
    return true;
  } else {
    return false;
  }
};

interface TxError {
  data: string;
}
export const parseError = async (
  web3: AlchemyWeb3,
  receipt: TransactionReceipt
) => {
  try {
    console.log("==== calling", receipt);
    const tx = (await web3.eth.getTransaction(
      receipt.transactionHash
    )) as TransactionConfig;
    await web3.eth.call(tx, receipt.blockNumber);
  } catch (error: any) {
    console.log({ error });
    console.log(error.data.substring(138));
    const reason = web3.utils.toAscii(
      `0x${(error as TxError).data.substring(138)}`
    );
    console.log(reason);
  }
};
