import { AnchorProvider, Idl, Program } from "@project-serum/anchor";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
import { SwapOnOff } from "./artifacts/swap_on_off";
import SwapOnOffIDL from "./artifacts/swap_on_off.json";
import { ProgramIx } from "./ix";
/**
 * @category Core
 */
export class ProgramContext {
  readonly connection: Connection;
  readonly wallet: Wallet;
  readonly opts: ConfirmOptions;
  readonly program: Program<SwapOnOff>;
  readonly provider: AnchorProvider;
  ixs: ProgramIx;

  public static from(
    connection: Connection,
    wallet: Wallet,
    programId: PublicKey,
    opts: ConfirmOptions = AnchorProvider.defaultOptions()
  ): ProgramContext {
    const anchorProvider = new AnchorProvider(connection, wallet, opts);
    const program = new Program(SwapOnOffIDL as Idl, programId, anchorProvider);
    return new ProgramContext(anchorProvider, anchorProvider.wallet, program, opts);
  }

  public constructor(
    provider: AnchorProvider,
    wallet: Wallet,
    program: Program,
    opts: ConfirmOptions
  ) {
    this.connection = provider.connection;
    this.wallet = wallet;
    this.opts = opts;
    // It's a hack but it works on Anchor workspace *shrug*
    this.program = program as unknown as Program<SwapOnOff>;
    this.provider = provider;
    this.ixs = new ProgramIx(this);
  }

  // TODO: Add another factory method to build from on-chain IDL
}
