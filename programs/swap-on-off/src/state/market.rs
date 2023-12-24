use anchor_lang::prelude::*;

#[account]
pub struct Market {
    pub id: String,
    pub initializer: Pubkey,
    pub token_mint: Pubkey,
    pub token_vault: Pubkey,
    pub signer: Pubkey,
}

impl Market {
    pub const LEN: usize = 8 + 100 + 32 * 4;
}
