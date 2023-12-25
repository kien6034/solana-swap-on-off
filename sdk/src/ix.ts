import { TransactionBuilder, Instruction } from "@orca-so/common-sdk";
import { ProgramContext } from "./context";
import * as ixs from "./instructions";

export class ProgramIx {
  private ctx: ProgramContext;
  public ix: Instruction | null | undefined;

  constructor(ctx: ProgramContext) {
    this.ctx = ctx;
  }

  public async initializeConfig(
    params: ixs.InitializeConfigParams
  ){
    this.ix = await ixs.initializeConfig(this.ctx.program, params);
    return this;;
  }

  public async lockToken(
    params: ixs.LockTokenParams
  ){
    this.ix = await ixs.lockToken(this.ctx.program, params);
    return this;
  }

  public async unlockToken(
    params: ixs.UnlockTokenParams
  ){
    this.ix = await ixs.unlockToken(this.ctx.program, params);
    return this;
  }

  public toTx(): TransactionBuilder {
    const tx = new TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet);
    return this.ix ? tx.addInstruction(this.ix) : tx;
  }
}