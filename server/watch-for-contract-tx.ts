// watch-for-mints.js
import "dotenv/config";
// npm install @alch/alchemy-web3
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { waitTransaction, isSuccessfulTransaction, parseError } from "./tx";

const alchemyApiKey = process.env.ALCHEMY_KEY;
console.log({ alchemyApiKey });

// This is the NFT contract we want to watch.
const contractAddress = "0x8ED88E27521BeCBB3f70477da6b9eB4680548469";

// Initialize alchemy-web3 object.
// Docs: https://docs.alchemy.com/alchemy/documentation/subscription-api-websockets
const web3 = createAlchemyWeb3(
  `wss://eth-rinkeby.ws.alchemyapi.io/ws/${alchemyApiKey}`
);

const checkStatus = async (txn: any) => {
  const hash = txn.hash;
  console.log({ hash });
  const receipt = await waitTransaction(web3.eth, hash);
  const isSuccess = isSuccessfulTransaction(receipt);
  if (!isSuccess) {
    await parseError(web3, receipt);
  }
  console.log({ isSuccess, log: receipt.logs });
};

// subscribe pending events
const params = {
  address: contractAddress,
};
web3.eth
  .subscribe("alchemy_filteredFullPendingTransactions", params)
  .on("data", checkStatus);
