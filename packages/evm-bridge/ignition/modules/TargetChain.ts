import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import * as dotenv from 'dotenv';

dotenv.config({
    debug: true,
});

const TARGET_CHAIN_RELAYER = process.env.TARGET_CHAIN_RELAYER;

if(!TARGET_CHAIN_RELAYER) {
    throw new Error(
        'TARGET_CHAIN_RELAYER is not defined in the environment variables'
    );
}

export default buildModule('TargetChain', (m) => {
    const messageReceiver = m.contract('MessageReceiver', [TARGET_CHAIN_RELAYER]);

    return { messageReceiver };
});
