use anchor_lang::prelude::*;

declare_id!("8fAE3udJkXMU8Pn23xo8p41PKAPiEHRMjMAJuJWc3FUX");

#[program]
pub mod solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
