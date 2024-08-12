use anchor_lang::prelude::*;

declare_id!("7oEL8MLz4Fn7hCun2xBvMkaNk74XhL5SiXK4QJYxgWP");

#[program]
pub mod mywallet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
