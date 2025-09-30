import type { HardhatUserConfig } from 'hardhat/config';
// import "@nomicfoundation/hardhat-verify";

import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import hardhatVerify from '@nomicfoundation/hardhat-verify';

import * as dotenv from 'dotenv';
dotenv.config({
    debug: true,
});

const config = {
    plugins: [hardhatToolboxViemPlugin, hardhatVerify],
    chainDescriptors: {
        '44787': {
            name: 'alfajores',
            blockExplorers: {
                etherscan: {
                    name: 'Celo Alfajores Explorer',
                    url: 'https://alfajores.celoscan.io/',
                    apiUrl: 'https://api-alfajores.celoscan.io/api',
                },
            },
        },
    },
    verify: {
        etherscan: {
            apiKey: process.env.ETHERSCAN_API_KEY || '',
            enabled: true,
        },
        blockscout: {
            enabled: false,
        },
    },
    solidity: {
        profiles: {
            default: {
                version: '0.8.28',
            },
            production: {
                version: '0.8.28',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        },
    },
    networks: {
        alfajores: {
            type: 'http',
            url: process.env.ALFAJORES_RPC_URL || '',
            accounts: [process.env.PRIVATE_KEY || ''],
        },
        sepolia: {
            type: 'http',
            url: process.env.SEPOLIA_RPC_URL || '',
            accounts: [process.env.PRIVATE_KEY || ''],
        },
    },
} satisfies HardhatUserConfig;

export default config;
