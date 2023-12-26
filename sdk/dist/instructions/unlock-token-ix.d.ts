/// <reference types="bn.js" />
import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { SwapOnOff } from "../artifacts/swap_on_off";
import { PDAInfo } from "../pda";
export type UnlockTokenParams = {
    txId: string;
    user: PublicKey;
    userTokenAccount: PublicKey;
    tokenMint: PublicKey;
    market: PDAInfo;
    tokenVault: PDAInfo;
    amount: BN;
    sig: Uint8Array;
};
export declare function unlockToken(program: Program<SwapOnOff>, params: UnlockTokenParams): Promise<Instruction>;
