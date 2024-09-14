import inquirer from "inquirer";
import chalk from "chalk";
import { SolanaTransferProgram } from "../src/transfersol";
import { SolanaTransferSPLProgram } from "../src/transferspl";
import { GetBalance } from "../src/getbalance";
async function main() {
  while(true){
    try {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'select the action you want to perform:',
          choices: [
            'Transfer SOL',
            'Transfer SPL Token',
            'View the balance',
            'Exit',
          ],
        },
      ]);
      
      switch (action) {
        case 'Transfer SOL':
          const transfersol = new SolanaTransferProgram();
          await transfersol.userInputSendSol();
          break;
        case 'Transfer SPL Token':
          const transferspl = new SolanaTransferSPLProgram();
          await transferspl.userInputSendSpl()
          break;
        case 'View the balance':
          const getbalance = new GetBalance();
          await getbalance.userInputGetBalance();
          break
        case 'Exit':
          console.log("Thank you for using our Solana CLI tool. Goodbye!");
          return;
      }
      console.log("\n");
    } catch (error) {
      console.error(chalk.red(`An error occurred: ${error.message}`));
      console.log(chalk.yellow("Please try again or select 'Exit' to quit the program."));
    }
  }
}

main().catch((error) => {
  console.error(chalk.red(`A critical error occurred: ${error.message}`));
  console.error(chalk.red("The program will now exit."));
  process.exit(1);
});