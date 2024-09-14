import inquirer from "inquirer";
import bs58 from "bs58";
import chalk from "chalk";
import * as anchor from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { TransferSol } from "../typesIDL/transfer_sol";
import IDL from "../typesIDL/IDL.json";

export class SolanaTransferProgram {
  private connection: Connection;
  private provider: anchor.AnchorProvider;
  private program: anchor.Program<TransferSol>;

  constructor() {
    try { 
      this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    this.program = new anchor.Program(IDL as TransferSol, null as any);
  
      
    } catch (error) {
      console.error(chalk.red("Error initializing:"), error);
      throw error;
    }
  }
  
   

  private initializeProvider(wallet: anchor.Wallet) {
    try {
      this.provider = new anchor.AnchorProvider(this.connection, wallet, {});
      anchor.setProvider(this.provider);
      this.program = new anchor.Program(IDL as TransferSol, this.provider);
    } catch (error) {
      console.error(chalk.red("Error initializing:"), error);
      throw error;
    }
   
  }

  async userInputSendSol() {
    try { const answer = await inquirer.prompt([
      {
        type: "password",
        name: "privatekey",
        message: "send your secret key(base58):",
        mask: "*",
        validate: (value) => {
          const privateKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{88}$/;
          return (
            privateKeyRegex.test(value) ||
            chalk.bgRed("send your correct secret key:")
          );
        },
      },
      {
        type: "input",
        name: "recipientAddress",
        message: "Enter the recipient address:",
        validate: (value) => {
          const PubKeyRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
          return (
            PubKeyRegex.test(value) ||
            chalk.bgRed("Please enter the correct Solana address:")
          );
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

    const decodedkey = bs58.decode(answer.privatekey);
    const bs58keypair = Keypair.fromSecretKey(decodedkey);
    const wallet = new anchor.Wallet(bs58keypair);

    this.initializeProvider(wallet);

    const RecipientPubKey = new PublicKey(answer.recipientAddress);
    const amount = answer.amount * LAMPORTS_PER_SOL;

   
      const tx = await this.program.methods
        .transferSolWithCpi(new anchor.BN(amount))
        .accounts({
          payer: bs58keypair.publicKey,
          recipient: RecipientPubKey,
        })
        .signers([bs58keypair])
        .rpc();
        console.log(chalk.green("Transfer successful!"));
        console.log(chalk.blue("Transaction signature:"), tx);
  
     } catch (error) {
      console.error(chalk.red("Error during SOL transfer:"), error);
      if (error instanceof Error) {
        console.error(chalk.red("Error details:"), error.message);
      
     }
    }
  }
}
