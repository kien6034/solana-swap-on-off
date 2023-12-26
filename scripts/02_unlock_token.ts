import { getFixture } from "./utils";
import { getWallets, ROLES } from "./utils/";
import { Client } from "@kien6034/swap-on-off";
import { BN } from "@project-serum/anchor";

/**
 * @usage swap off-on
 */
const main = async () => {
  const wallets = getWallets([ROLES.DEPLOYER, ROLES.TEST]);

  const deployer = wallets[ROLES.DEPLOYER];
  const test = wallets[ROLES.TEST];

  let user = test;
  let signer = deployer;
  const { ctx, tokenMint } = await getFixture(user);

  const client = new Client(ctx, tokenMint);

  // lock amount
  const unlockAmount = new BN(10);

  let txId = "tx1";
  let signature = await client.getUnlockSignatureMsg(
    txId,
    user.publicKey,
    unlockAmount,
    signer
  );

  const tx = await client.unlockToken("tx1", unlockAmount, signature);
  const hash = await tx.buildAndExecute();
  console.log("hash: ", hash);
};

main().catch((error) => console.log(error));
