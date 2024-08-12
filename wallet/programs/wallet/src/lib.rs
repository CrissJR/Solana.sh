use anchor_lang::prelude::*;
use anchor_lang::system_program;
use serde::{Deserialize, Serialize};


declare_id!("8RcNK61yi9KkwJQb4uxkrfnWhdESM63xHmv9rre2PF1o");
#[derive(Serialize, Deserialize, Debug)]

pub struct Wallet {
    pub name: String,
    pub public_key: String,
    pub secret_key: String,
}
#[derive(Accounts)]


pub struct TransferSolWithCpi<'info> {
    #[account(mut)]
    payer: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct GetBalance<'info> {
    #[account(mut)]
    pub account: AccountInfo<'info>,
}

  



#[program]
pub mod transfer_sol {
    use super::*;

    pub fn transfer_sol_with_cpi(ctx: Context<TransferSolWithCpi>, amount: u64) -> Result<()> {
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.recipient.to_account_info(),
                },
            ),
            amount,
        )?;

        Ok(())
    }     
 
}

   
pub fn get_balance_account(ctx:Context<GetBalance>) -> Result<u64> {
    let account_info = ctx.accounts.account.to_account_info();
    let lamports = **account_info.lamports.borrow();
    msg!("Account balance:{} lamports", lamports);
    Ok(lamports)
}
