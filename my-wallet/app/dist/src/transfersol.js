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
exports.SolanaTransferProgram = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const bs58_1 = __importDefault(require("bs58"));
const chalk_1 = __importDefault(require("chalk"));
const anchor = __importStar(require("@coral-xyz/anchor"));
const web3_js_1 = require("@solana/web3.js");
const IDL_json_1 = __importDefault(require("../typesIDL/IDL.json"));
class SolanaTransferProgram {
    connection;
    provider;
    program;
    constructor() {
        try {
            this.connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
            this.program = new anchor.Program(IDL_json_1.default, null);
        }
        catch (error) {
            console.error(chalk_1.default.red("Error initializing:"), error);
            throw error;
        }
    }
    initializeProvider(wallet) {
        try {
            this.provider = new anchor.AnchorProvider(this.connection, wallet, {});
            anchor.setProvider(this.provider);
            this.program = new anchor.Program(IDL_json_1.default, this.provider);
        }
        catch (error) {
            console.error(chalk_1.default.red("Error initializing:"), error);
            throw error;
        }
    }
    async userInputSendSol() {
        try {
            const answer = await inquirer_1.default.prompt([
                {
                    type: "password",
                    name: "privatekey",
                    message: "send your secret key(base58):",
                    mask: "*",
                    validate: (value) => {
                        const privateKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{88}$/;
                        return (privateKeyRegex.test(value) ||
                            chalk_1.default.bgRed("send your correct secret key:"));
                    },
                },
                {
                    type: "input",
                    name: "recipientAddress",
                    message: "Enter the recipient address:",
                    validate: (value) => {
                        const PubKeyRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
                        return (PubKeyRegex.test(value) ||
                            chalk_1.default.bgRed("Please enter the correct Solana address:"));
                    },
                },
                {
                    type: "number",
                    name: "amount",
                    message: "Enter the amount of SOL to transfer:",
                    validate: function (value) {
                        return value > 0 || "Enter a positive number:";
                    },
                },
            ]);
            const decodedkey = bs58_1.default.decode(answer.privatekey);
            const bs58keypair = web3_js_1.Keypair.fromSecretKey(decodedkey);
            const wallet = new anchor.Wallet(bs58keypair);
            this.initializeProvider(wallet);
            const RecipientPubKey = new web3_js_1.PublicKey(answer.recipientAddress);
            const amount = answer.amount * web3_js_1.LAMPORTS_PER_SOL;
            const tx = await this.program.methods
                .transferSolWithCpi(new anchor.BN(amount))
                .accounts({
                payer: bs58keypair.publicKey,
                recipient: RecipientPubKey,
            })
                .signers([bs58keypair])
                .rpc();
            console.log(chalk_1.default.green("Transfer successful!"));
            console.log(chalk_1.default.blue("Transaction signature:"), tx);
        }
        catch (error) {
            console.error(chalk_1.default.red("Error during SOL transfer:"), error);
            if (error instanceof Error) {
                console.error(chalk_1.default.red("Error details:"), error.message);
            }
        }
    }
}
exports.SolanaTransferProgram = SolanaTransferProgram;
//# sourceMappingURL=transfersol.js.map