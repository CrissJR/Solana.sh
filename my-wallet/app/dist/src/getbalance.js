"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBalance = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
class GetBalance {
    connection;
    constructor() {
        this.connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    }
    async userInputGetBalance() {
        try {
            const answer = await inquirer_1.default.prompt([
                {
                    type: "input",
                    name: "publicKey",
                    message: "Enter the public key (address) to check balance:",
                    validate: (value) => {
                        const pubKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
                        return pubKeyRegex.test(value) || "Please enter a valid Solana address.";
                    },
                },
            ]);
            const OwnersAddress = new web3_js_1.PublicKey(answer.publicKey);
            await this.getBalanceSol(OwnersAddress);
            await this.getBalanceAllSpltoken(OwnersAddress);
        }
        catch (error) {
            console.error(chalk_1.default.red("Error getting balance:"), error);
        }
    }
    async getBalanceSol(address) {
        try {
            const balance = await this.connection.getBalance(address);
            console.log(chalk_1.default.green("SOL balance:"), chalk_1.default.yellow(`${balance / web3_js_1.LAMPORTS_PER_SOL} SOL`));
        }
        catch (error) {
            console.error(chalk_1.default.red("Error getting SOL balance:"), error);
        }
    }
    async getBalanceAllSpltoken(address) {
        try {
            let response = await this.connection.getTokenAccountsByOwner(address, {
                programId: spl_token_1.TOKEN_PROGRAM_ID,
            });
            console.log(chalk_1.default.cyan("\nSPL Token Balances:"));
            console.log(chalk_1.default.cyan("Token                                         Balance"));
            console.log(chalk_1.default.cyan("------------------------------------------------------------"));
            response.value.forEach((tokenAccount) => {
                const AccountData = spl_token_1.AccountLayout.decode(tokenAccount.account.data);
                console.log(`${new web3_js_1.PublicKey(AccountData.mint)}   ${AccountData.amount}`);
            });
        }
        catch (error) {
            console.error(chalk_1.default.red("Error getting SPL token balances:"), error);
        }
    }
}
exports.GetBalance = GetBalance;
//# sourceMappingURL=getbalance.js.map