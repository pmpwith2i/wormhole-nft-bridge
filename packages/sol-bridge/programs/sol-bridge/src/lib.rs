use anchor_lang::prelude::*;
use wormhole_anchor_sdk::wormhole::{self};

declare_id!("YourProgramPubkeyGeneratedAfterDeploy");

#[program]
pub mod solana_nft_bridge {
    use super::*;

    // Entry point: process incoming VAA
    pub fn receive_nft(ctx: Context<ReceiveNft>, vaa_data: Vec<u8>) -> Result<()> {
        let vaa = VaaAccount::parse(&vaa_data)?;

        // ✅ 1. Verify Wormhole signature
        wormhole::post_vaa(&ctx.accounts.wormhole_core, &vaa)?;

        // ✅ 2. Extract NFT data from payload
        let payload = vaa.payload;
        let nft_metadata = String::from_utf8(payload.clone())
            .map_err(|_| error!(ErrorCode::InvalidPayload))?;

        msg!("Received NFT metadata: {}", nft_metadata);

        // ✅ 3. Mint wrapped NFT on Solana
        // (simplified: you'd call Metaplex token metadata program here)
        // For demo: just log it
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ReceiveNft<'info> {
    /// Wormhole core contract account
    pub wormhole_core: AccountInfo<'info>,
    /// Payer of transaction fees
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid payload")]
    InvalidPayload,
}
