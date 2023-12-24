import { ProgramContext } from "../context";
import { PublicKey } from "@solana/web3.js";
import { TransactionBuilder, resolveOrCreateATA } from "@orca-so/common-sdk";
import { PDA } from "../pda";


export class Client {
  ctx: ProgramContext;
  public pda: PDA;
  public id: string;
  public tokenMint: PublicKey;

  constructor(ctx: ProgramContext, id: string, tokenMint: PublicKey) {
    this.ctx = ctx;
    this.pda = new PDA(ctx.program.programId, id, tokenMint);
    this.id = id;
    this.tokenMint = tokenMint;
  }

  public async initMarket(signer: PublicKey) : Promise<TransactionBuilder> {
    const market = this.pda.getMarketPDA();
    const tokenVault = this.pda.getMarketVaultPDA();
    const ix = await this.ctx.ixs.initializeConfig({
      id: this.id,
      initializer: this.ctx.wallet.publicKey,
      signer: signer,
      tokenMint: this.tokenMint,
      market: market,
      tokenVault: tokenVault,
    });

    return ix.toTx();
  }
}