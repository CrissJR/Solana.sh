use anchor_lang::prelude::*;

declare_id!("8RcNK61yi9KkwJQb4uxkrfnWhdESM63xHmv9rre2PF1o");

#[program]
pub mod wallet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
