"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const transfersol_1 = require("../src/transfersol");
const transferspl_1 = require("../src/transferspl");
const getbalance_1 = require("../src/getbalance");
async function main() {
    while (true) {
        try {
            const { action } = await inquirer_1.default.prompt([
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
                    const transfersol = new transfersol_1.SolanaTransferProgram();
                    await transfersol.userInputSendSol();
                    break;
                case 'Transfer SPL Token':
                    const transferspl = new transferspl_1.SolanaTransferSPLProgram();
                    await transferspl.userInputSendSpl();
                    break;
                case 'View the balance':
                    const getbalance = new getbalance_1.GetBalance();
                    await getbalance.userInputGetBalance();
                    break;
                case 'Exit':
                    console.log("Thank you for using our Solana CLI tool. Goodbye!");
                    return;
            }
            console.log("\n");
        }
        catch (error) {
            console.error(chalk_1.default.red(`An error occurred: ${error.message}`));
            console.log(chalk_1.default.yellow("Please try again or select 'Exit' to quit the program."));
        }
    }
}
main().catch((error) => {
    console.error(chalk_1.default.red(`A critical error occurred: ${error.message}`));
    console.error(chalk_1.default.red("The program will now exit."));
    process.exit(1);
});
//# sourceMappingURL=index.js.map