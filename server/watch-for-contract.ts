// watch-for-mints.js
import "dotenv/config";
// npm install @alch/alchemy-web3
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const alchemyApiKey = process.env.ALCHEMY_KEY;
console.log({ alchemyApiKey });

// This is the "event" topic we want to watch.
const verifyTopic =
  "0x18faa9381c0a647ee34f2fbc756af28348dc6f7a93534d47e26c19febc1d64a3";
const notVerifyTopic =
  "0xc53f0fc255b9d16dc8964d7eca4354dcdaef83d32acfaff3409e5f18d00ca80a";
// This is the NFT contract we want to watch.
const contractAddress = "0x23dbe3b6aa3af3a4668d1a21519376d2a3a17749";

// Initialize alchemy-web3 object.
// Docs: https://docs.alchemy.com/alchemy/documentation/subscription-api-websockets
const web3 = createAlchemyWeb3(
  `wss://eth-rinkeby.ws.alchemyapi.io/ws/${alchemyApiKey}`
);

// Create the log options object.
const verifyevents = {
  address: contractAddress,
  topics: [verifyTopic],
};
const nonVerifyevents = {
  address: contractAddress,
  topics: [notVerifyTopic],
};

const doSomethingWithTxn = (txn: any) => console.log(txn);

// Open the websocket and listen for events!
web3.eth
  .subscribe("logs", verifyevents, (e) => {
    if (e) {
      console.error(e);
    }
  })
  .on("data", doSomethingWithTxn);
web3.eth
  .subscribe("logs", nonVerifyevents, (e) => {
    if (e) {
      console.error(e);
    }
  })
  .on("data", doSomethingWithTxn);
