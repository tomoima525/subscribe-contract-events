Showcase monitoring events using Alchemy's subscription API

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

# Monitoring

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