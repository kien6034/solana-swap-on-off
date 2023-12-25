use anchor_lang::prelude::*;

declare_id!("3kRBwdLwVE8uE4S3V64tPFwLqLDrodjNbiLLgUgpEZZz");

pub const MARKET_PDA_SEED: &[u8] = b"market";
pub const MARKET_VAULT_PDA_SEED: &[u8] = b"market_vault";

pub mod instructions;
pub mod state;
pub mod util;

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

    pub fn unlock_token(ctx: Context<UnlockToken>, amount: u64) -> Result<(), ProgramError> {
        instructions::unlock_token::unlock_token(ctx, amount)
    }
}
