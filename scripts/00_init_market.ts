
import { getFixture } from "./utils";
import { getWallets, ROLES } from "./utils/";
import {Client}  from "../sdk/src";


const main = async () => {
  const wallets = getWallets([
    ROLES.DEPLOYER,
  ]);

  const deployer = wallets[ROLES.DEPLOYER];
  const { ctx, tokenMint } = await getFixture(deployer);

  
  const client = new Client(ctx, "config", tokenMint);
  const tx = await client.initMarket(deployer.publicKey);
  await tx.buildAndExecute();
 
};


main().catch((error) => console.log(error));
