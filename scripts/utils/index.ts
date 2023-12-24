import { PublicKey, Connection, Keypair, Commitment } from "@solana/web3.js";
import { AnchorProvider, Wallet } from "@project-serum/anchor";
import {  PDA, ProgramContext } from "../../sdk/src";
import { env } from "../env";

export * from "./wallet";

export type ProgramFixture = { 
  ctx: ProgramContext,
  tokenMint: PublicKey
};

export const getFixture = async function (
  feePayerAuthority: Keypair
): Promise<ProgramFixture> {
  const commitment: Commitment = "confirmed";
  const connection = new Connection(env.RPC_END_POINT);

  const wallet = new Wallet(feePayerAuthority);
  const provider = new AnchorProvider(connection, wallet, { commitment });

  const ctx = ProgramContext.from(
    connection,
    wallet,
    new PublicKey(env.ESCROW_PROGRAM_ID),
    { commitment }
  );

  const tokenMint = new PublicKey(env.TOKEN_MINT);
  return {
    ctx,
    tokenMint,
  };
};

