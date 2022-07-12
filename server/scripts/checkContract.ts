import { ethers, providers, Wallet } from "ethers";

const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const checkContract = async () => {
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  const provider = new providers.JsonRpcProvider("http://localhost:8545/");

  // Wallet that pays for contract deployment & execution
  const wallet = new Wallet(privateKey).connect(provider);

  const abi = ["function id()"];
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  try {
    const tx = await contract.connect(wallet).id();
    // const receipt = await tx.wait();
    console.log(tx);
  } catch (e) {
    console.log(e);
  }
};

checkContract().then(() => {
  console.log("end");
});
