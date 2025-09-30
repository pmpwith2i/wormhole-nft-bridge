import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import * as dotenv from 'dotenv';

dotenv.config({
    debug: true,
});

const SOURCE_CHAIN_RELAYER = process.env.SOURCE_CHAIN_RELAYER;
const COLLECTOR_ADDRESS = process.env.COLLECTOR_ADDRESS;

if (!SOURCE_CHAIN_RELAYER) {
    throw new Error(
        'SOURCE_CHAIN_RELAYER is not defined in the environment variables'
    );
}

if (!COLLECTOR_ADDRESS) {
    throw new Error(
        'COLLECTOR_ADDRESS is not defined in the environment variables'
    );
}

export default buildModule('SourceChain', (m) => {
    const customNft = m.contract('CustomNFT');
    const messageSender = m.contract('MessageSender', [
        SOURCE_CHAIN_RELAYER,
    ]);
    const crossChainBridge = m.contract('CrossChainBridge', [
        customNft,
        messageSender,
        '0xA2a8aE5f7bFF1750D88B0959F1201C819859eF88', // Replace with actual target address
        1, // Solana testnet wormhole chain ID
    ]);

    m.call(customNft, 'mintCollectionNFT', [COLLECTOR_ADDRESS, 10]);

    return { messageSender, customNft, crossChainBridge };
});
