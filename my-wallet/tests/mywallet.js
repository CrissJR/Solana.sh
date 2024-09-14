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
Object.defineProperty(exports, "__esModule", { value: true });
const anchor = __importStar(require("@coral-xyz/anchor"));
const web3_js_1 = require("@solana/web3.js");
describe("testik", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Testik;
    const transferAmount = 1 * web3_js_1.LAMPORTS_PER_SOL;
    const payer = provider.wallet;
    const recipient = new web3_js_1.Keypair();
    it("Transfer SOL with CPI", async () => {
        const tx = await program.methods
            .transferSolWithCpi(new anchor.BN(transferAmount))
            .accounts({
            payer: payer.publicKey,
            recipient: recipient.publicKey,
        })
            .rpc();
        console.log("Your transaction signature", tx);
    });
    it("get balance of account", async () => {
        const account_balance = await program.methods
            .getBalanceAccount()
            .accounts({
            account: payer.publicKey
        })
            .rpc();
        console.log("your account balance:", account_balance);
    });
});
