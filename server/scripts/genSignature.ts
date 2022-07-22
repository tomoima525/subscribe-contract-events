import { ethers, providers, Wallet } from "ethers";
const alchemyApiKey = process.env.ALCHEMY_KEY;

export const genSignature = async ({
  from,
  to,
  verifyingContract,
}: {
  from: string;
  to: string;
  verifyingContract: string;
}) => {
  const wallet = Wallet.createRandom();
  const provider = new providers.AlchemyProvider("rinkeby", alchemyApiKey);
  console.log({ walletPubKey: wallet.publicKey });

  const domain = {
    name: "TestForwarder",
    version: "1.0.0",
    chainId: 4, // rinkeby
    verifyingContract,
  };

  const types = {
    ForwardRequest: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
  };

  const value = {
    from,
    to,
    nonce: 0,
    id: 1,
  };
  const signature = await wallet
    .connect(provider)
    ._signTypedData(domain, types, value);
  console.log(signature);
  // split signature
  const r = signature.slice(0, 66);
  const s = "0x" + signature.slice(66, 130);
  const v = parseInt(signature.slice(130, 132), 16);
  console.log({ r, s, v });
  const sig = ethers.utils.splitSignature(signature);
  console.log(sig);
  return true;
};

// to: "0x7e9b5d6cf742b8707ba88d6b78f22d0f0d9fecbb", // Contract to execute
console.log(
  `from ${process.argv[2]}, to: ${process.argv[3]}, ForwarderContract: ${process.argv[4]}`
);

genSignature({
  from: process.argv[2],
  to: process.argv[3],
  verifyingContract: process.argv[4],
}).then(() => {
  console.log("end");
});
