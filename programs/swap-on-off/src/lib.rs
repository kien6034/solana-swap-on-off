use anchor_lang::prelude::*;

declare_id!("AwSAKJKjFCVyQ9YXinJu5gcw2auxqaCcRLdjaNLQnMoe");

pub const MARKET_PDA_SEED: &[u8] = b"market";
pub const MARKET_VAULT_PDA_SEED: &[u8] = b"market_vault";

pub mod instructions;
pub mod state;
pub mod util;
pub mod errors;
pub mod events;

use instructions::*;

#[program]
pub mod swap_on_off {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, market_bump: u8) -> Result<(), ProgramError> {
        instructions::init_market::initialize(ctx, market_bump)
    }

    pub fn lock_token(ctx: Context<LockToken>, amount: u64) -> Result<(), ProgramError> {
        instructions::lock_token::lock_token(ctx, amount)
    }

    pub fn unlock_token(
        ctx: Context<UnlockToken>,
        tx_id: String,
        amount: u64,
        sig: [u8; 64]
    ) -> Result<(), ProgramError> {
        instructions::unlock_token::unlock_token(ctx, tx_id, amount, sig)
    }
}
