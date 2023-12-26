"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignature = exports.Client = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_sdk_1 = require("@orca-so/common-sdk");
const pda_1 = require("../pda");
const spl_token_1 = require("@solana/spl-token");
const ed25519 = __importStar(require("@noble/ed25519"));
const getTokenAccountRentExempt = (connection, refresh = false) => __awaiter(void 0, void 0, void 0, function* () {
    // This value should be relatively static or at least not break according to spec
    // https://docs.solana.com/developing/programming-model/accounts#rent-exemption
    let rentExempt = yield connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span);
    return rentExempt;
});
class Client {
    constructor(ctx, tokenMint) {
        this.ctx = ctx;
        this.pda = new pda_1.PDA(ctx.program.programId, tokenMint);
        this.tokenMint = tokenMint;
    }
    initMarket(signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = this.pda.getMarketPDA();
            const tokenVault = this.pda.getMarketVaultPDA();
            const ix = yield this.ctx.ixs.initializeConfig({
                initializer: this.ctx.wallet.publicKey,
                signer: signer,
                tokenMint: this.tokenMint,
                market: market,
                tokenVault: tokenVault,
            });
            return ix.toTx();
        });
    }
    lockToken(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = this.pda.getMarketPDA();
            const tokenVault = this.pda.getMarketVaultPDA();
            const userTokenAccount = yield (0, common_sdk_1.deriveATA)(this.ctx.wallet.publicKey, this.tokenMint);
            const ix = yield this.ctx.ixs.lockToken({
                user: this.ctx.wallet.publicKey,
                userTokenAccount: userTokenAccount,
                tokenMint: this.tokenMint,
                market: market,
                tokenVault: tokenVault,
                amount: amount,
            });
            return ix.toTx();
        });
    }
    getUnlockSignatureMsg(internalId, user, amount, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = getUnlockTxBytes(internalId, user, this.tokenMint, amount);
            let sig = yield (0, exports.getSignature)(signer, msg);
            return {
                msg: msg,
                signature: sig,
                publicKey: signer.publicKey,
            };
        });
    }
    unlockToken(txId, amount, signatureResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const market = this.pda.getMarketPDA();
            const tokenVault = this.pda.getMarketVaultPDA();
            const _a = yield (0, common_sdk_1.resolveOrCreateATA)(this.ctx.connection, this.ctx.wallet.publicKey, this.tokenMint, () => getTokenAccountRentExempt(this.ctx.connection), undefined, this.ctx.wallet.publicKey), { address: userTokenAccount } = _a, createuserTokenAccountInstruction = __rest(_a, ["address"]);
            //Construct ed25510 x
            let ed25519TxId = web3_js_1.Ed25519Program.createInstructionWithPublicKey({
                publicKey: signatureResponse.publicKey.toBytes(),
                message: signatureResponse.msg,
                signature: signatureResponse.signature,
            });
            let ed25519Ix = {
                instructions: [ed25519TxId],
                cleanupInstructions: [],
                signers: [],
            };
            const ix = yield this.ctx.ixs.unlockToken({
                user: this.ctx.wallet.publicKey,
                userTokenAccount: userTokenAccount,
                tokenMint: this.tokenMint,
                market: market,
                tokenVault: tokenVault,
                amount: amount,
                sig: signatureResponse.signature,
                txId: txId,
            });
            return ix
                .toTx()
                .prependInstruction(ed25519Ix)
                .prependInstruction(createuserTokenAccountInstruction);
        });
    }
}
exports.Client = Client;
const getUnlockTxBytes = (internalId, user, tokenMint, amount) => {
    const allBytes = [
        Uint8Array.from(Buffer.from(internalId)),
        Uint8Array.from(user.toBytes()),
        Uint8Array.from(tokenMint.toBytes()),
        Uint8Array.from(amount.toArray(undefined, 8)), // amount
    ];
    let msg_bytes_len = 0;
    for (const bytes of allBytes) {
        msg_bytes_len += bytes.length;
    }
    let msg_bytes = new Uint8Array(msg_bytes_len);
    // set the msg bytes
    var offset = 0;
    for (const bytes of allBytes) {
        msg_bytes.set(bytes, offset);
        offset += bytes.length;
    }
    return msg_bytes;
};
const getSignature = (signer, msg) => __awaiter(void 0, void 0, void 0, function* () {
    let signature;
    signature = yield ed25519.sign(msg, signer.secretKey.slice(0, 32));
    return signature;
});
exports.getSignature = getSignature;
