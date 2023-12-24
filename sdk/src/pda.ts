import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

const MARKET_SEED = "market";
const MARKET_VAULT_SEED= "market_vault";

export interface PDAInfo {
  key: anchor.web3.PublicKey;
  bump: number;
}

export class PDA {
  readonly programId: anchor.web3.PublicKey;
  readonly marketId: string;
  readonly tokenMint: PublicKey;

  public constructor(programId: anchor.web3.PublicKey, marketId: string, tokenMint: PublicKey) {
    this.programId = programId;
    this.marketId = marketId;
    this.tokenMint = tokenMint;
  }

  public getMarketPDA = (): PDAInfo => {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode(MARKET_SEED), this.tokenMint.toBuffer(),  anchor.utils.bytes.utf8.encode(this.marketId)],
      this.programId
    );

    return {
      key: pda,
      bump: bump,
    };
  };

  public getMarketVaultPDA = (): PDAInfo => {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(MARKET_VAULT_SEED),
        this.tokenMint.toBuffer(),
        anchor.utils.bytes.utf8.encode(this.marketId),
      ],
      this.programId
    );

    return {
      key: pda,
      bump: bump,
    };
  };
}
