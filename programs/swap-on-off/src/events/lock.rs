use anchor_lang::prelude::*;
use serde::{ Deserialize, Serialize };

#[event]
#[derive(Serialize, Deserialize, Debug)]
pub struct LockEvent {
    pub user: Pubkey,
    pub amount: u64,
}
