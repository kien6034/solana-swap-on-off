use anchor_lang::prelude::*;
use serde::{ Deserialize, Serialize };

#[event]
#[derive(Serialize, Deserialize, Debug)]
pub struct UnlockEvent {
    pub txId: String,
    pub user: Pubkey,
    pub amount: u64,
}
