/// <reference types="bn.js" />
import { ProgramContext } from "../context";
import { PublicKey, Keypair } from "@solana/web3.js";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { PDA } from "../pda";
import { BN } from "@project-serum/anchor";
export declare class Client {
    ctx: ProgramContext;
    pda: PDA;
    tokenMint: PublicKey;
    constructor(ctx: ProgramContext, tokenMint: PublicKey);
    initMarket(signer: PublicKey): Promise<TransactionBuilder>;
    lockToken(amount: BN): Promise<TransactionBuilder>;
    getUnlockSignatureMsg(internalId: string, user: PublicKey, amount: BN, signer: Keypair): Promise<SignatureResponse>;
    unlockToken(txId: string, amount: BN, signatureResponse: SignatureResponse): Promise<TransactionBuilder>;
}
export declare const getSignature: (signer: Keypair, msg: Uint8Array) => Promise<Uint8Array>;
export type SignatureResponse = {
    msg: Uint8Array;
    signature: Uint8Array;
    publicKey: PublicKey;
};
