import inquirer from "inquirer";
import chalk from "chalk";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export class GetBalance {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  }
  async userInputGetBalance() {
    try {
      const answer = await inquirer.prompt([
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

      const OwnersAddress = new PublicKey(answer.publicKey);

      await this.getBalanceSol(OwnersAddress);
      await this.getBalanceAllSpltoken(OwnersAddress);
    } catch (error) {
      console.error(chalk.red("Error getting balance:"), error);
    }
  }

  async getBalanceSol(address: PublicKey) {
    try {
      const balance = await this.connection.getBalance(address);
      console.log(chalk.green("SOL balance:"), chalk.yellow(`${balance / LAMPORTS_PER_SOL} SOL`));
    } catch (error) {
      console.error(chalk.red("Error getting SOL balance:"), error);
    }
  }

  async getBalanceAllSpltoken(address: PublicKey) {
    try {
      let response = await this.connection.getTokenAccountsByOwner(
        address,
        {
          programId: TOKEN_PROGRAM_ID,
        },
      );
      console.log(chalk.cyan("\nSPL Token Balances:"));
      console.log(chalk.cyan("Token                                         Balance"));
      console.log(chalk.cyan("------------------------------------------------------------"));
      response.value.forEach((tokenAccount) => {
        const AccountData = AccountLayout.decode(tokenAccount.account.data);
        console.log(`${new PublicKey(AccountData.mint)}   ${AccountData.amount}`);
      });
    } catch (error) {
      console.error(chalk.red("Error getting SPL token balances:"), error);
    }
  }
}