use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("8RcNK61yi9KkwJQb4uxkrfnWhdESM63xHmv9rre2PF1o");

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
   
pub fn get_balance_account(ctx:Context<GetBalance>) -> Result<f64> {
   let account_info = ctx.accounts.account.to_account_info();
    let lamports = **account_info.lamports.borrow();
    let sol_balance = lamports as f64 / 1_000_000_000.0;
    msg!("Account balance:{} lamports", sol_balance);
    Ok(sol_balance)
}