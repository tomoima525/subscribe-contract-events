import "dotenv/config";
import { ethers, providers, Wallet } from "ethers";
import { abi as fowarderAbi } from "../../out/Forwarder.sol/Forwarder.json";

const alchemyApiKey = process.env.ALCHEMY_KEY;

const genNetworkSetups = async ({ isLocal }: { isLocal: boolean }) => {
  // Key is from anvil
  const privateKey = isLocal
    ? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    : (process.env.PRIVATE_KEY as string);
  const provider = isLocal
    ? new providers.JsonRpcProvider("http://localhost:8545/")
    : new providers.AlchemyProvider("rinkeby", alchemyApiKey);
  const chainId = (await provider.getNetwork()).chainId;
  console.log({ chainId });
  return { chainId, privateKey, provider };
};

export const verifySignatureOnChain = async () => {
  // Smart contract to execute
  const to = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  const verifyingContract = "0x851356ae760d987e095750cceb3bc6014560891c";

  const { chainId, privateKey, provider } = await genNetworkSetups({
    isLocal: true,
  });

  // Wallet that pays for contract deployment & execution
  const wallet = new Wallet(privateKey).connect(provider);
  console.log({
    walletPubKey: await wallet.getAddress(),
    isSigner: wallet._isSigner,
  });

  const requesterWallet = new Wallet(
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
  );
  console.log("RequestfromAddress: ", requesterWallet.address);

  const domain = {
    name: "TestForwarder",
    version: "1.0.0",
    chainId,
    // chainId: 4, // rinkeby
    verifyingContract,
  };

  const types = {
    ForwardRequest: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "nonce",
        type: "uint256",
      },
      {
        name: "id",
        type: "uint256",
      },
    ],
  };

  const from = requesterWallet.address;
  const value = {
    from,
    to,
    nonce: 0,
    id: 1,
  };
  const signature = await requesterWallet
    .connect(provider)
    ._signTypedData(domain, types, value);
  const sig = ethers.utils.splitSignature(signature);
  console.log(sig);

  const abi = [
    "function execute(tuple(address,address,uint256,uint256), uint8,bytes32,bytes32)",
    "function executeWithSignature((address,address,uint256,uint256),bytes)",
    "function _verify(tuple(address,address,uint256,uint256), uint8,bytes32,bytes32)",
    "function addSenderToWhitelist(address)",
    "event DebugVerify(tuple(address,address,uint256,uint256) req, uint8 v,bytes32 r,bytes32 s,address signer)",
    "event MetaTransactionExecuted(address from, address to,uint256 id)",
  ];

  // parsing tx data
  // @ts-ignore
  const inter = new ethers.utils.Interface(fowarderAbi);
  let data;
  // verify message on contract
  const contract = new ethers.Contract(verifyingContract, abi, wallet);
  try {
    const tx = await contract
      .connect(wallet)
      .executeWithSignature([from, to, "0", "1"], signature);
    //._verify([from, to, "0", "1"], sig.v, sig.r, sig.s); // https://ethereum.stackexchange.com/questions/109283/tuple-for-a-function-input-how-to-use-it
    const receipt = await tx.wait();
    console.log("Receipt: ", receipt);
    data = tx.data;
  } catch (error: any) {
    console.log(error);
    data = error?.tx.data || null;
  }
  if (data) {
    const decode = inter.parseTransaction({ data });
    console.log(decode);
  }
};

verifySignatureOnChain().then(() => {
  console.log("end");
});
