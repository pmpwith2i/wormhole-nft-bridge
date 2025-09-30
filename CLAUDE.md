# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Wormhole-based cross-chain NFT bridge implementation connecting EVM chains and Solana. It allows NFTs to be locked on one chain and minted/unlocked on another using Wormhole's messaging protocol with EVM-deployed relayers.

## Monorepo Structure

This is a pnpm workspace with two main packages:

- **packages/sol-bridge**: Anchor program for Solana side of the bridge
- **packages/evm-bridge**: Hardhat project for EVM contracts (Solidity)

## Common Commands

### Workspace Level

```bash
# Install dependencies for all packages
pnpm install
```

### Solana Bridge (packages/sol-bridge)

```bash
cd packages/sol-bridge

# Build the Anchor program
anchor build

# Run tests
anchor test
# Or using the package.json script:
yarn test

# Lint
yarn lint
yarn lint:fix

# Deploy to localnet
anchor deploy --provider.cluster localnet

# Deploy to other clusters
anchor deploy --provider.cluster devnet
anchor deploy --provider.cluster mainnet
```

**Important**: The program ID is defined in `Anchor.toml` and must be updated in `programs/sol-bridge/src/lib.rs` after initial deployment.

### EVM Bridge (packages/evm-bridge)

```bash
cd packages/evm-bridge

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to networks (using Hardhat Ignition modules)
npx hardhat ignition deploy ignition/modules/SourceChain.ts --network alfajores
npx hardhat ignition deploy ignition/modules/TargetChain.ts --network sepolia

# Verify contracts
npx hardhat verify --network <network> <contract-address>
```

**Networks configured**:
- alfajores (Celo testnet)
- sepolia (Ethereum testnet)

Network configuration requires environment variables in `.env`:
- `ALFAJORES_RPC_URL`
- `SEPOLIA_RPC_URL`
- `PRIVATE_KEY`
- `ETHERSCAN_API_KEY` (for verification)

## Architecture

### Solana Program (Anchor)

- **Program ID**: Configured in `Anchor.toml` (currently `3CK9ZHwYXATN7v7jXprmxqKPrikrNEqpXpTz6ajPVQ2M` for localnet)
- **Main instruction**: `receive_nft` - processes incoming Wormhole VAAs (Verified Action Approvals)
- **Dependencies**:
  - `anchor-lang 0.31.1`
  - `wormhole-anchor-sdk 0.30.1-alpha.3`
- **Key accounts**: Requires wormhole_core account for VAA verification

### EVM Contracts

Core contracts in `packages/evm-bridge/contracts/`:

1. **CrossChainBridge.sol**: Main bridge contract that locks NFTs and initiates cross-chain messages
   - Uses OpenZeppelin ERC721 and Ownable
   - Holds locked NFTs in custody
   - Coordinates with MessageSender for Wormhole messages

2. **CustomNFT.sol**: ERC721 NFT implementation

3. **MessageSender.sol**: Handles outbound Wormhole messages

4. **MessageReceiver.sol**: Handles inbound Wormhole messages

Dependencies:
- OpenZeppelin Contracts 5.4.0
- Wormhole Foundation SDK 3.8.3 (EVM and Solana variants)
- Wormhole Solidity SDK (in lib/wormhole-solidity-sdk)

### Cross-Chain Flow

1. User locks NFT on source chain via `CrossChainBridge.lockNFT()`
2. MessageSender emits Wormhole message
3. Off-chain relayers observe and relay the message
4. Target chain receives VAA
5. On Solana: `receive_nft` instruction processes VAA and mints wrapped NFT
6. On EVM: MessageReceiver processes message (implementation varies)

## Development Notes

### Solana Development

- The program uses Anchor framework with workspace resolver = "2"
- Tests use ts-mocha with TypeScript support
- Build artifacts go to `target/` directory
- IDL is generated automatically by Anchor

### EVM Development

- Hardhat configuration uses TypeScript and Viem
- Deployment uses Hardhat Ignition for deterministic deployments
- Solidity version: 0.8.28
- Production profile enables optimizer with 200 runs
- Also includes Foundry/Forge dependencies (forge-std) but no foundry.toml at package root

### Testing

Both packages have independent test suites:
- Solana: Anchor test framework with TypeScript
- EVM: Hardhat test framework with Viem

Run tests from within each package directory.