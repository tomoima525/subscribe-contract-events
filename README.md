Showcase meta-transaction(gasless transaction by EIP-712) & monitoring events using Alchemy's subscription API

![PXL_20220710_072147683](https://user-images.githubusercontent.com/6277118/178317013-c710b369-f0e0-423f-b151-91980e897370.jpg)

Based on this document https://docs.alchemy.com/alchemy/enhanced-apis/subscription-api-websockets/how-to-listen-to-nft-mints

# Contract

### Deploy

$ source .env
$ forge script script/Contract.s.sol:ContractScript --rpc-url $RINKEBY_RPC_URL --private-key $PRIVATE_KEY --broadcast -vvvv

```
forge script script/Contract.s.sol:ContractScript --rpc-url $RINKEBY_RPC_URL --private-key $PRIVATE_KEY --broadcast -vvvv
[⠑] Compiling...
[⠔] Compiling 2 files with 0.8.14
[⠒] Solc 0.8.14 finished in 734.86ms
Compiler run successful
Traces:
  [101665] ContractScript::run()
    ├─ [0] VM::broadcast()
    │   └─ ← ()
    ├─ [66117] → new Contract@"0x23db…7749"
    │   └─ ← 330 bytes of code
    ├─ [0] VM::stopBroadcast()
    │   └─ ← ()
    └─ ← ()


Script ran successfully.
==========================
Simulated On-chain Traces:

  [124597] → new Contract@"0x23db…7749"
    └─ ← 330 bytes of code


==========================

Estimated total gas used for script: 161976

Estimated amount required: 0.00048592800323952 ETH

==========================

###
Finding wallets for all the necessary addresses...
##
Sending transactions [0 - 0].
⠁ [00:00:00] [##############################################################################################################################################################] 1/1 txes (0.0s)
Transactions saved to: broadcast/Contract.s.sol/4/run-latest.json

##
Waiting for receipts.
⠉ [00:00:14] [##########################################################################################################################################################] 1/1 receipts (0.0s)
#####
✅ Hash: 0x2b99d746fb53d7268a17f6974acc6eea4fed36c7d851b542784aa8bc845bc508
Contract Address: 0x23dbe3b6aa3af3a4668d1a21519376d2a3a17749
Block: 10986634
Paid: 0.000373791001121373 ETH (124597 gas * 3.000000009 gwei)


Transactions saved to: broadcast/Contract.s.sol/4/run-latest.json



==========================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL. Transaction receipts written to "broadcast/Contract.s.sol/4/run-latest.json"

Transactions saved to: broadcast/Contract.s.sol/4/run-latest.json
```

### Verify

```
$ forge verify-contract --chain 4 0x23dbe3b6aa3af3a4668d1a21519376d2a3a17749 src/Contract.sol:Contract $ETHERSCAN_API_KEY

Submitting verification for [src/Contract.sol:Contract] 0x23dbe3b6aa3af3a4668d1a21519376d2a3a17749.
Submitted contract for verification:
        Response: `OK`
        GUID: `frs7qdrencjps8cpiyxcghughvdrmzalgjtfhqczlyxksy2dwj`
        URL: https://rinkeby.etherscan.io/address/0x23dbe3b6aa3af3a4668d1a21519376d2a3a17749
```

# Monitoring Events and Receipt

### Events

```
yarn ts-node watch-for-contract.ts
yarn run v1.22.15
$ /Users/tomoima525/workspace/solidity/hello_foundry/server/node_modules/.bin/ts-node watch-for-contract.ts
{ alchemyApiKey: 'xxx' }
// Verified
{
  address: '0x23Dbe3b6aA3af3A4668D1A21519376D2A3a17749',
  topics: [
    '0x18faa9381c0a647ee34f2fbc756af28348dc6f7a93534d47e26c19febc1d64a3',
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    '0x00000000000000000000000069d49390a5748454f28611ebc90d0f5a2d679556'
  ],
  data: '0x',
  blockNumber: 10986664,
  transactionHash: '0x08a77d45e2dbc6f074d0ad98b6db1c9aa3eced6d1c8693c189838fa47946ea31',
  transactionIndex: 19,
  blockHash: '0xd9d319a38a50e1805c7719edee4e4e8b981cc7df66cbf6f5d4dc8ce5acfb5340',
  logIndex: 40,
  removed: false,
  id: 'log_5a296d5c'
}
// Not verified
{
  address: '0x23Dbe3b6aA3af3A4668D1A21519376D2A3a17749',
  topics: [
    '0xc53f0fc255b9d16dc8964d7eca4354dcdaef83d32acfaff3409e5f18d00ca80a',
    '0x0000000000000000000000000000000000000000000000000000000000000002',
    '0x00000000000000000000000069d49390a5748454f28611ebc90d0f5a2d679556'
  ],
  data: '0x',
  blockNumber: 10986695,
  transactionHash: '0x3d4cff007974136d802e197459ffeac0f0df43bf73ad0d4c6a2897a96dab6cd3',
  transactionIndex: 17,
  blockHash: '0x764e98c4b86792cf5016b6c22afc4fab8606c3b003ad0a093f64d3dec4748420',
  logIndex: 433,
  removed: false,
  id: 'log_1658c266'
}
```

### txReceipt

```
$ yarn ts-node watch-for-contract-tx.ts
// success case
// monitoring...
{
  txHash: '0xdd944cfeebc9c891fb5ff0b8b9143c1b9e5a25a568ef03fb328768e678384afd',
  receipt: null,
  d: 1657311093827
}
//...
{
  isSuccess: true,
  receipt: {
    blockHash: '0xdd29559814a5b3488a8c366e737273446716926748da73c04343bb38851eec11',
    blockNumber: 10990227,
    contractAddress: null,
    cumulativeGasUsed: 2970884,
    effectiveGasPrice: 1000000009,
    from: '0x69d49390a5748454f28611ebc90d0f5a2d679556',
    gasUsed: 23480,
    logs: [ [Object] ],
    logsBloom: '0x00000000000000000000000000000000000000000000000000000020000000000200000000040000000000000000000000000000020000000000000040040000000000000000000004000000000008000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000040040000000000000000000000000000000000000000000000000000000000000000000',
    status: true,
    to: '0x3246d2625cd6224fad067731ccf5a65440a75433',
    transactionHash: '0xca76c8d29e8564cb9691ac8af04ea580bb500f1c3708236b3e7abce26e7b0701',
    transactionIndex: 16,
    type: '0x2'
  }
}

// failure case
// monitoring...
{
  txHash: '0xdd944cfeebc9c891fb5ff0b8b9143c1b9e5a25a568ef03fb328768e678384afd',
  receipt: null,
  d: 1657311274819
}
// ...
{
  isSuccess: false,
  receipt: {
    blockHash: '0xc269ba1ec250a03a0a7c93331b910fd8854eb847e10dbb138e7526dd2b7ec782',
    blockNumber: 10990257,
    contractAddress: null,
    cumulativeGasUsed: 201606,
    effectiveGasPrice: 3000000000,
    from: '0x69d49390a5748454f28611ebc90d0f5a2d679556',
    gasUsed: 21975,
    logs: [],
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    status: false,
    to: '0x3246d2625cd6224fad067731ccf5a65440a75433',
    transactionHash: '0xe59c359cc317eb904590c77a51ffc66fd5709f1c8eebefe9d02f538624adaa92',
    transactionIndex: 2,
    type: '0x2'
  }
}
// Parsing the error from call function
{
  error: Error: Returned error: execution reverted: Not Verified
      at Object.ErrorResponse (/Users/tomoima525/workspace/solidity/hello_foundry/server/node_modules/web3-core-helpers/lib/errors.js:28:19)
      at /Users/tomoima525/workspace/solidity/hello_foundry/server/node_modules/web3-core-requestmanager/lib/index.js:302:36
      at /Users/tomoima525/workspace/solidity/hello_foundry/server/node_modules/@alch/alchemy-web3/dist/cjs/util/promises.js:28:9
      at processTicksAndRejections (node:internal/process/task_queues:96:5) {
    data: '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c4e6f742056657269666965640000000000000000000000000000000000000000'
  }
}
4e6f742056657269666965640000000000000000000000000000000000000000
Not Verified
{ isSuccess: false, log: [] }
```

### Test Transaction with verified signature

- Update `to` and `verifyingContract` in `verifySignatureOnchain.ts`
- `to` is the contract that wants to be called
- `verifyingContract` is the forwarder contract

```
yarn ts-node scripts/verifySignatureOnChain.ts
yarn run v1.22.15
$ /Users/tomoima525/workspace/solidity/hello_foundry/server/node_modules/.bin/ts-node scripts/verifySignatureOnChain.ts
{
  walletPubKey: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  isSigner: true
}
RequestfromAddress:  0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
{ chainId: 31337 }
{
  r: '0x1ab4efca799040661967a39f4197b377c0eb22126850e2eaead9f005a6cba5b7',
  s: '0x1a92bb84b31698454fd4a473f5dc365fba34435efba21271b067fca5f4cbbc74',
  _vs: '0x1a92bb84b31698454fd4a473f5dc365fba34435efba21271b067fca5f4cbbc74',
  recoveryParam: 0,
  v: 27,
  yParityAndS: '0x1a92bb84b31698454fd4a473f5dc365fba34435efba21271b067fca5f4cbbc74',
  compact: '0x1ab4efca799040661967a39f4197b377c0eb22126850e2eaead9f005a6cba5b71a92bb84b31698454fd4a473f5dc365fba34435efba21271b067fca5f4cbbc74'
}
Receipt:  {
  to: '0x851356ae760d987E095750cCeb3bC6014560891C',
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  contractAddress: null,
  transactionIndex: 0,
  gasUsed: BigNumber { _hex: '0x015e45', _isBigNumber: true },
  logsBloom: '0x00000000000000000000000000000000000400000000000000000000000000000000000000040000000000000000000000000000020000000000000000140000000200000000000000000000000008000000000000040010000000000000000000000040000000000000000000800020000804010000000000000000000000000000000000000000000000080000000000000000000000000000000200000000000000000020200000000000000000400000000000000000000000000000000000000040000000000000000000000000000000000008000000000000000040000000000000000000000000000000000000000000000000001000000000000000',
  blockHash: '0x1f2dabc85441f2a25f7c593a7abd43062c4631c4f298e194b72d4d7aaaeaca6d',
  transactionHash: '0x56a01daab9958f98577697e380789257f1aa3aafbf93369569782ed67b76822d',
  logs: [
    {
      transactionIndex: 0,
      blockNumber: 38,
      transactionHash: '0x56a01daab9958f98577697e380789257f1aa3aafbf93369569782ed67b76822d',
      address: '0x851356ae760d987E095750cCeb3bC6014560891C',
      topics: [Array],
      data: '0x0000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc0000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001b1ab4efca799040661967a39f4197b377c0eb22126850e2eaead9f005a6cba5b71a92bb84b31698454fd4a473f5dc365fba34435efba21271b067fca5f4cbbc74000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      logIndex: 0,
      blockHash: '0x1f2dabc85441f2a25f7c593a7abd43062c4631c4f298e194b72d4d7aaaeaca6d'
    },
    {
      transactionIndex: 0,
      blockNumber: 38,
      transactionHash: '0x56a01daab9958f98577697e380789257f1aa3aafbf93369569782ed67b76822d',
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      topics: [Array],
      data: '0x',
      logIndex: 1,
      blockHash: '0x1f2dabc85441f2a25f7c593a7abd43062c4631c4f298e194b72d4d7aaaeaca6d'
    },
    {
      transactionIndex: 0,
      blockNumber: 38,
      transactionHash: '0x56a01daab9958f98577697e380789257f1aa3aafbf93369569782ed67b76822d',
      address: '0x851356ae760d987E095750cCeb3bC6014560891C',
      topics: [Array],
      data: '0x',
      logIndex: 2,
      blockHash: '0x1f2dabc85441f2a25f7c593a7abd43062c4631c4f298e194b72d4d7aaaeaca6d'
    }
  ],
  blockNumber: 38,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { _hex: '0x015e45', _isBigNumber: true },
  effectiveGasPrice: BigNumber { _hex: '0x59cea28e', _isBigNumber: true },
  status: 1,
  type: 0,
  byzantium: true,
  events: [
    {
      transactionIndex: 0,
      blockNumber: 38,
      transactionHash: '0x56a01daab9958f98577697e380789257f1aa3aafbf93369569782ed67b76822d',
      address: '0x851356ae760d987E095750cCeb3bC6014560891C',
      topics: [Array],
      data: '0x0000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc0000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001b1ab4efca799040661967a39f4197b377c0eb22126850e2eaead9f005a6cba5b71a92bb84b31698454fd4a473f5dc365fba34435efba21271b067fca5f4cbbc74000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      logIndex: 0,
      blockHash: '0x1f2dabc85441f2a25f7c593a7abd43062c4631c4f298e194b72d4d7aaaeaca6d',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'DebugVerify',
      eventSignature: 'DebugVerify((address,address,uint256,uint256),uint8,bytes32,bytes32,address)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    },
    {
      transactionIndex: 0,
      blockNumber: 38,
      transactionHash: '0x56a01daab9958f98577697e380789257f1aa3aafbf93369569782ed67b76822d',
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      topics: [Array],
      data: '0x',
      logIndex: 1,
      blockHash: '0x1f2dabc85441f2a25f7c593a7abd43062c4631c4f298e194b72d4d7aaaeaca6d',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    },
    {
      transactionIndex: 0,
      blockNumber: 38,
      transactionHash: '0x56a01daab9958f98577697e380789257f1aa3aafbf93369569782ed67b76822d',
      address: '0x851356ae760d987E095750cCeb3bC6014560891C',
      topics: [Array],
      data: '0x',
      logIndex: 2,
      blockHash: '0x1f2dabc85441f2a25f7c593a7abd43062c4631c4f298e194b72d4d7aaaeaca6d',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}
TransactionDescription {
  args: [
    [
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      [BigNumber],
      [BigNumber],
      from: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      nonce: [BigNumber],
      id: [BigNumber]
    ],
    '0x1ab4efca799040661967a39f4197b377c0eb22126850e2eaead9f005a6cba5b71a92bb84b31698454fd4a473f5dc365fba34435efba21271b067fca5f4cbbc741b',
    req: [
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      [BigNumber],
      [BigNumber],
      from: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      nonce: [BigNumber],
      id: [BigNumber]
    ],
    signature: '0x1ab4efca799040661967a39f4197b377c0eb22126850e2eaead9f005a6cba5b71a92bb84b31698454fd4a473f5dc365fba34435efba21271b067fca5f4cbbc741b'
  ],
  functionFragment: {
    type: 'function',
    name: 'executeWithSignature',
    constant: false,
    inputs: [ [Object], [ParamType] ],
    outputs: [ [ParamType], [ParamType] ],
    payable: true,
    stateMutability: 'payable',
    gas: null,
    _isFragment: true,
    constructor: [Function: FunctionFragment] {
      from: [Function (anonymous)],
      fromObject: [Function (anonymous)],
      fromString: [Function (anonymous)],
      isFunctionFragment: [Function (anonymous)]
    },
    format: [Function (anonymous)]
  },
  name: 'executeWithSignature',
  signature: 'executeWithSignature((address,address,uint256,uint256),bytes)',
  sighash: '0x41fa3999',
  value: BigNumber { _hex: '0x00', _isBigNumber: true }
}
```

# Deploying Contract locally

Run anvil in another terminal

```
anvil
```

Deploy 2 Contracts pointing to the localhost (private key is the one that anvil generates)

```
forge script script/Contract.s.sol:ContractScript --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545/ --broadcast
forge script script/Forwarder.s.sol:ContractScript --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545/ --broadcast
```
