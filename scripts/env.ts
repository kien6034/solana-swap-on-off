
require("dotenv").config();

export const env = {
  RPC_END_POINT: process.env.RPC_END_POINT || "http://127.0.0.1:8899",
  ESCROW_PROGRAM_ID:
    process.env.ESCROW_PROGRAM_ID ||
    "EdScsxAyfWg3f1aDWRqQeSPpYxj1wihfBoSkn38oGkwv",
  TOKEN_MINT:
    process.env.TOKEN_MINT || "G5dDhn9mcZuGfo4ntiM6USxtQbTT3rP4XDhaEZCiBeJz",
};
