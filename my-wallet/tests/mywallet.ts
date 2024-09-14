import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TransferSol } from "../target/types/transfer_sol.js";

describe("testik", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Testik as Program<TransferSol>;
  const transferAmount = 1 * LAMPORTS_PER_SOL;

  const payer = provider.wallet as anchor.Wallet;
  const recipient = new Keypair();

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
