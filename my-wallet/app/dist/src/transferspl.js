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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTransferSPLProgram = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const bs58_1 = __importDefault(require("bs58"));
const chalk_1 = __importDefault(require("chalk"));
const anchor = __importStar(require("@coral-xyz/anchor"));
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const IDL_json_1 = __importDefault(require("../typesIDL/IDL.json"));
class SolanaTransferSPLProgram {
    connection;
    provider;
    program;
    constructor() {
        this.connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        this.program = new anchor.Program(IDL_json_1.default, null);
    }
    initializeProvider(wallet) {
        this.provider = new anchor.AnchorProvider(this.connection, wallet, {});
        anchor.setProvider(this.provider);
        this.program = new anchor.Program(IDL_json_1.default, this.provider);
    }
    async userInputSendSpl() {
        try {
            const answer = await inquirer_1.default.prompt([
                {
                    type: 'password',
                    name: 'privatekey',
                    message: 'Enter your secret key (base58):',
                    mask: '*',
                    validate: (value) => {
                        const privateKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{88}$/;
                        return privateKeyRegex.test(value) || chalk_1.default.bgRed('Please enter a valid secret key:');
                    },
                },
                {
                    type: 'input',
                    name: 'recipientAddress',
                    message: 'Enter the recipient address:',
                    validate: (value) => {
                        const PubKeyRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
                        return PubKeyRegex.test(value) || chalk_1.default.bgRed('Please enter a valid Solana address:');
                    }
                },
                {
                    type: 'input',
                    name: 'tokenMintAddress',
                    message: 'Enter the SPL token mint address:',
                    validate: (value) => {
                        const PubKeyRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
                        return PubKeyRegex.test(value) || chalk_1.default.bgRed('Please enter a valid SPL token mint address:');
                    }
                },
                {
                    type: 'number',
                    name: 'amount',
                    message: 'Enter the amount of SPL tokens to transfer:',
                    validate: function (value) {
                        return value > 0 || 'Please enter a positive number:';
                    },
                }
            ]);
            const decodedkey = bs58_1.default.decode(answer.privatekey);
            const bs58keypair = web3_js_1.Keypair.fromSecretKey(decodedkey);
            const wallet = new anchor.Wallet(bs58keypair);
            this.initializeProvider(wallet);
            const recipientPubKey = new web3_js_1.PublicKey(answer.recipientAddress);
            const tokenMintPubKey = new web3_js_1.PublicKey(answer.tokenMintAddress);
            const mintInfo = await (0, spl_token_1.getMint)(this.connection, tokenMintPubKey);
            const amountWithDecimals = answer.amount * Math.pow(10, mintInfo.decimals);
            const amount = new anchor.BN(amountWithDecimals);
            const fromTokenAccount = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(this.connection, bs58keypair, tokenMintPubKey, bs58keypair.publicKey);
            const toTokenAccount = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(this.connection, bs58keypair, tokenMintPubKey, recipientPubKey);
            console.log(chalk_1.default.yellow("Initiating SPL token transfer..."));
            const tx = await this.program.methods
                .transferSplWithCpi(amount)
                .accounts({
                authority: bs58keypair.publicKey,
                from: fromTokenAccount.address,
                to: toTokenAccount.address,
            })
                .signers([bs58keypair])
                .rpc();
            console.log(chalk_1.default.green("Transfer successful!"));
            console.log(chalk_1.default.blue("Transaction signature:"), tx);
        }
        catch (error) {
            console.error(chalk_1.default.red("Error during SPL transfer:"), error);
            if (error instanceof Error) {
                console.error(chalk_1.default.red("Error details:"), error.message);
            }
        }
    }
}
exports.SolanaTransferSPLProgram = SolanaTransferSPLProgram;
//# sourceMappingURL=transferspl.js.map