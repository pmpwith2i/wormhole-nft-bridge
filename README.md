# Cross-Chain NFT Bridge
An implementation of a cross-chain NFT bridge leveraging Wormhole's messaging protocol to enable secure NFT transfers between EVM chains and Solana. This project demonstrates advanced blockchain interoperability, smart contract security patterns, and full-stack Web3 development.

**Built with** ❤️ **to demonstrate expertise in:**
- Cross-chain bridge architecture
- Solidity smart contract development
- Solana program development
- Web3 security best practices
- Wormhole protocol integration

**Note**: This project is intended for educational and portfolio demonstration purposes. Deploy on mainnet at your own risk and ensure proper security audits before handling real assets.

## 🏗️ Architecture Overview
This bridge implements a **lock-and-mint** mechanism for cross-chain NFT transfers:

1. **Lock Phase**: NFTs are locked in an escrow contract on the source chain
2. **Message Relay**: Wormhole relayers propagate cryptographically verified messages (VAAs)
3. **Mint/Unlock Phase**: Target chain mints wrapped NFTs or unlocks native assets

### Key Components

```
nftbridge/
├── packages/
│   ├── evm-bridge/          # Solidity contracts for EVM chains
│   │   ├── contracts/
│   │   │   ├── CrossChainBridge.sol    # Core bridge logic & NFT escrow
│   │   │   ├── MessageSender.sol       # Wormhole message emission
│   │   │   ├── MessageReceiver.sol     # Wormhole message consumption
│   │   │   └── CustomNFT.sol          # ERC721 implementation
│   │   └── ignition/                   # Deployment modules
│   │
│   └── sol-bridge/           # Anchor program for Solana
│       └── programs/
│           └── sol-bridge/src/lib.rs   # VAA processing & NFT minting (TBD)
```

## 🔑 Technical Highlights

### Smart Contract Features
- **ERC721 Management**: Secure NFT custody with approval checks
- **Wormhole Integration**: Native integration with Wormhole's relayer network
- **Access Control**: OpenZeppelin's `Ownable` pattern for privileged operations
- **Sender Authentication**: Whitelist-based source chain validation
- **Gas Optimization**: Dynamic cross-chain cost quotation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Solana CLI and Anchor 0.31.1
- Rust 1.70+
- Hardhat development environment

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nftbridge.git
cd nftbridge

# Install dependencies
pnpm install
```

### EVM Contracts Deployment

```bash
cd packages/evm-bridge

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet (example: Celo Alfajores)
npx hardhat ignition deploy ignition/modules/SourceChain.ts --network alfajores

# Verify on block explorer
npx hardhat verify --network alfajores <CONTRACT_ADDRESS>
```

**Environment Variables Required:**
```env
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=your_api_key
```

### Solana Program Deployment

```bash
cd packages/sol-bridge

# Build program
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

**Post-Deployment:** Update the program ID in `lib.rs` and `Anchor.toml` after initial deployment.

## 🔧 Contract Interfaces

### CrossChainBridge.sol

```solidity
function lockNFT(uint256 tokenId) public
```
Locks an NFT in the bridge contract and initiates a cross-chain transfer.

**Requirements:**
- Caller must own the NFT
- Bridge must have approval (via `approve()` or `setApprovalForAll()`)

### MessageSender.sol

```solidity
function sendMessage(
    uint16 targetChain,
    address targetAddress,
    string memory message
) external payable
```
Sends arbitrary messages via Wormhole relayer.

```solidity
function quoteCrossChainCost(uint16 targetChain) public view returns (uint256)
```
Returns the cost in native currency for cross-chain message delivery.

### MessageReceiver.sol

```solidity
function receiveWormholeMessages(
    bytes memory payload,
    bytes[] memory,
    bytes32 sourceAddress,
    uint16 sourceChain,
    bytes32
) public payable override
```
IWormholeReceiver implementation. Validates sender authorization and processes incoming messages.

```solidity
function setRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) public onlyOwner
```
Registers authorized message senders per source chain.

## 🧪 Testing

### EVM Tests
```bash
cd packages/evm-bridge
npx hardhat test
```

### Solana Tests
```bash
cd packages/sol-bridge
anchor test
```

## 🌐 Supported Networks

### EVM Chains
- **Celo Alfajores** (Testnet)
- **Ethereum Sepolia** (Testnet)
- Easily extensible to other EVM chains (Polygon, Avalanche, BSC, etc.)

### Solana (TBD)
- **Devnet**
- **Localnet** (development)
- **Mainnet** (production-ready)

## 📊 Project Status

| Feature | Status |
|---------|--------|
| EVM → EVM Messaging | 🚧 In Progress |
| NFT Locking Mechanism | 🚧 In Progress |
| Wormhole Integration | 🚧 In Progress |
| Solana VAA Processing |🚧 In Progress |
| Metaplex NFT Minting | 🚧 In Progress |
| End-to-End Bridge Flow | 🚧 In Progress |
| Frontend Interface | 📋 Planned |

## 🔐 Security Considerations

- **Reentrancy Protection**: ERC721's `safeTransferFrom` includes reentrancy guards
- **Access Control**: Owner-only functions for critical operations
- **Sender Validation**: Whitelist pattern prevents unauthorized cross-chain calls
- **Gas Limits**: Hardcoded gas limits prevent DoS via gas manipulation
- **Audit Status**: ⚠️ Not audited - for educational/portfolio purposes

## 🛠️ Development Tools

- **Hardhat**: Ethereum development environment
- **Anchor**: Solana smart contract framework
- **OpenZeppelin**: Battle-tested smart contract libraries
- **Wormhole SDK**: Official cross-chain messaging SDK
- **TypeScript**: Type-safe scripting and testing

## 📚 Resources

- [Wormhole Documentation](https://docs.wormhole.com/)
- [Anchor Book](https://book.anchor-lang.com/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to open issues or submit PRs.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

---