import { ProgramContext } from "../context";
import { PublicKey, Connection } from "@solana/web3.js";
import { TransactionBuilder, resolveOrCreateATA, deriveATA } from "@orca-so/common-sdk";
import { PDA } from "../pda";
import {BN} from "@project-serum/anchor";
import { AccountLayout } from "@solana/spl-token";

const  getTokenAccountRentExempt = async(connection: Connection, refresh: boolean = false)=>{
  // This value should be relatively static or at least not break according to spec
  // https://docs.solana.com/developing/programming-model/accounts#rent-exemption
  let rentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );
  return rentExempt;
}

export class Client {
  ctx: ProgramContext;
  public pda: PDA;
  public tokenMint: PublicKey;

  constructor(ctx: ProgramContext, tokenMint: PublicKey) {
    this.ctx = ctx;
    this.pda = new PDA(ctx.program.programId, tokenMint);
    this.tokenMint = tokenMint;
  }

  public async initMarket(signer: PublicKey) : Promise<TransactionBuilder> {
    const market = this.pda.getMarketPDA();
    const tokenVault = this.pda.getMarketVaultPDA();

    const ix = await this.ctx.ixs.initializeConfig({
      initializer: this.ctx.wallet.publicKey,
      signer: signer,
      tokenMint: this.tokenMint,
      market: market,
      tokenVault: tokenVault,
    });

    return ix.toTx();
  }

  public async lockToken(amount: BN) : Promise<TransactionBuilder> {
    const market = this.pda.getMarketPDA();
    const tokenVault = this.pda.getMarketVaultPDA();
    const userTokenAccount = await deriveATA(this.ctx.wallet.publicKey, this.tokenMint);

    const ix = await this.ctx.ixs.lockToken({
      user: this.ctx.wallet.publicKey,
      userTokenAccount: userTokenAccount,
      tokenMint: this.tokenMint,
      market: market,
      tokenVault: tokenVault,
      amount: amount,
    });

    return ix.toTx();
  }

  public async unlockToken(amount: BN) : Promise<TransactionBuilder> {
    const market = this.pda.getMarketPDA();
    const tokenVault = this.pda.getMarketVaultPDA();
    const { address: userTokenAccount, ...createuserTokenAccountInstruction } =
    await resolveOrCreateATA(
      this.ctx.connection,
      this.ctx.wallet.publicKey,
      this.tokenMint,
      () => getTokenAccountRentExempt(this.ctx.connection),
      undefined,
      this.ctx.wallet.publicKey
    );

    const ix = await this.ctx.ixs.unlockToken({
      user: this.ctx.wallet.publicKey,
      userTokenAccount: userTokenAccount,
      tokenMint: this.tokenMint,
      market: market,
      tokenVault: tokenVault,
      amount: amount,
    });

    return ix.toTx().prependInstruction(createuserTokenAccountInstruction);
  }
}