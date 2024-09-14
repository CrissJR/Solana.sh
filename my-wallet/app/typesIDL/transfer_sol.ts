/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/transfer_sol.json`.
 */
export type TransferSol = {
  address: "9oGWcX3xZTnjDkAzX8NWDZVCrNCowFH1QSM3UGyPPF3X";
  metadata: {
    name: "transferSol";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "getBalanceAccount";
      discriminator: [232, 191, 140, 82, 223, 60, 189, 205];
      accounts: [
        {
          name: "account";
          writable: true;
        },
      ];
      args: [];
      returns: "f64";
    },
    {
      name: "transferSolWithCpi";
      discriminator: [209, 108, 135, 67, 87, 217, 209, 143];
      accounts: [
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "recipient";
          writable: true;
        },
        {
          name: "systemProgram";
          docs: ["test -systemAccount , real - accountinfo"];
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
    {
      name: "transferSplWithCpi";
      discriminator: [197, 30, 50, 64, 206, 94, 65, 168];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "from";
          writable: true;
        },
        {
          name: "to";
          writable: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
  ];
};
