require("dotenv").config();

export const env = {
  RPC_END_POINT: process.env.RPC_END_POINT || "https://api.devnet.solana.com",
  PROGRAM_ID:
    process.env.PROGRAM_ID || "AwSAKJKjFCVyQ9YXinJu5gcw2auxqaCcRLdjaNLQnMoe",
  TOKEN_MINT:
    process.env.TOKEN_MINT || "HdS2bHJjA5bgwUWTne2ZZfyAUZahp49BPHgoXVyWim3e",
};
