use anchor_lang::prelude::*;

declare_id!("EdScsxAyfWg3f1aDWRqQeSPpYxj1wihfBoSkn38oGkwv");

pub const MARKET_PDA_SEED: &[u8] = b"market";
pub const MARKET_VAULT_PDA_SEED: &[u8] = b"market_vault";

pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod swap_on_off {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, id: String) -> Result<()> {
        instructions::init_market::initialize(ctx, id)
    }
}
