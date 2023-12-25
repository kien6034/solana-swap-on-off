
require("dotenv").config();

export const env = {
  RPC_END_POINT: process.env.RPC_END_POINT || "http://127.0.0.1:8899",
  PROGRAM_ID:
    process.env.PROGRAM_ID ||
    "3kRBwdLwVE8uE4S3V64tPFwLqLDrodjNbiLLgUgpEZZz",
  TOKEN_MINT:
    process.env.TOKEN_MINT || "BrkXXL5tXnnBPJFsZVhx8RC4hyN3Z5vR36aH6vigHDar",
};
