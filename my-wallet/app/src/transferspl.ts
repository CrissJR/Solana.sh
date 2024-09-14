import inquirer from "inquirer";
import bs58 from "bs58";
import chalk from "chalk";
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, clusterApiUrl, Keypair } from "@solana/web3.js";
import { TransferSol } from "../typesIDL/transfer_sol";
import { getOrCreateAssociatedTokenAccount, getMint } from "@solana/spl-token";
import IDL from "../typesIDL/IDL.json" 

export class SolanaTransferSPLProgram {
  private connection: Connection;
  private provider: anchor.AnchorProvider;
  private program: anchor.Program<TransferSol>;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    this.program = new anchor.Program(IDL as TransferSol, null as any);
  }

  private initializeProvider(wallet: anchor.Wallet) {
    this.provider = new anchor.AnchorProvider(this.connection, wallet, {});
    anchor.setProvider(this.provider);
    this.program = new anchor.Program(IDL as TransferSol, this.provider);
  }

  async userInputSendSpl() {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'password',
          name: 'privatekey',
          message: 'Enter your secret key (base58):',
          mask: '*',
          validate: (value) => {
            const privateKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{88}$/;
            return privateKeyRegex.test(value) || chalk.bgRed('Please enter a valid secret key:');
          },
        },
        {
          type: 'input',
          name: 'recipientAddress',
          message: 'Enter the recipient address:',
          validate: (value) => {
            const PubKeyRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
            return PubKeyRegex.test(value) || chalk.bgRed('Please enter a valid Solana address:');
          }
        },
        {
          type: 'input',
          name: 'tokenMintAddress',
          message: 'Enter the SPL token mint address:',
          validate: (value) => {
            const PubKeyRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
            return PubKeyRegex.test(value) || chalk.bgRed('Please enter a valid SPL token mint address:');
          }
        },
        {
          type: 'number',
          name: 'amount',
          message: 'Enter the amount of SPL tokens to transfer:',
          validate: function(value) {
            return value > 0 || 'Please enter a positive number:';
          },
        }
      ]);

      const decodedkey = bs58.decode(answer.privatekey);
      const bs58keypair = Keypair.fromSecretKey(decodedkey);
      const wallet = new anchor.Wallet(bs58keypair);

      this.initializeProvider(wallet);

      const recipientPubKey = new PublicKey(answer.recipientAddress);
      const tokenMintPubKey = new PublicKey(answer.tokenMintAddress);

    
      const mintInfo = await getMint(this.connection, tokenMintPubKey);
      const amountWithDecimals = answer.amount * Math.pow(10, mintInfo.decimals);
      const amount = new anchor.BN(amountWithDecimals);

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        bs58keypair,
        tokenMintPubKey,
        bs58keypair.publicKey
      );
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        bs58keypair,
        tokenMintPubKey,
        recipientPubKey
      );

      console.log(chalk.yellow("Initiating SPL token transfer..."));

      const tx = await this.program.methods
        .transferSplWithCpi(amount)
        .accounts({
          authority: bs58keypair.publicKey,
          from: fromTokenAccount.address,
          to: toTokenAccount.address,
        })
        .signers([bs58keypair])
        .rpc();

      console.log(chalk.green("Transfer successful!"));
      console.log(chalk.blue("Transaction signature:"), tx);

    } catch (error) {
      console.error(chalk.red("Error during SPL transfer:"), error);
      if (error instanceof Error) {
        console.error(chalk.red("Error details:"), error.message);
      }
    }
  }
}