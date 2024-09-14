use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Token};

declare_id!("9oGWcX3xZTnjDkAzX8NWDZVCrNCowFH1QSM3UGyPPF3X");


#[derive(Accounts)]

pub struct TransferSpl<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This is the token account that tokens will be transferred from
    #[account(mut)]
    pub from: AccountInfo<'info>,
    
    /// CHECK: This is the token account that tokens will be transferred to
    #[account(mut)]
    pub to: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
}


#[derive(Accounts)]
pub struct TransferSolWithCpi<'info> {
    #[account(mut)]
    payer: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>, ///test -systemAccount , real - accountinfo
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetBalance<'info> {
    /// CHECK: This is a read-only account used to get the balance
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
    pub fn transfer_spl_with_cpi(ctx: Context<TransferSpl>, amount: u64) -> Result<()> {
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.from.to_account_info(),
                    to: ctx.accounts.to.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            amount,
        )?;
    
        Ok(())
    }
    pub fn get_balance_account(ctx:Context<GetBalance>) -> Result<f64> {
        let account_info = ctx.accounts.account.to_account_info();
         let lamports = **account_info.lamports.borrow();
         let sol_balance = lamports as f64 / 1_000_000_000.0;
         msg!("Account balance:{} lamports", sol_balance);
         Ok(sol_balance)
     }
    }