import { Keypair, Transaction, VersionedTransaction, Connection } from "@solana/web3.js";
import { SolanaTracker } from "./SolanaTracker";

const rpc = "https://rpc-mainnet.solanatracker.io/?api_key=e891a957-8d59-4888-89fe-8ee2109a3f2a"




// Load the private key from the environment variable (use dotenv package if needed)
const walletSecretKey = Uint8Array.from(JSON.parse("[249,62,198,251,176,155,94,18,153,141,246,68,163,30,97,59,114,62,173,123,38,245,61,190,11,94,1,118,121,6,219,137,89,121,237,132,180,192,41,14,181,10,175,180,90,249,82,94,168,201,54,3,236,36,213,128,21,132,7,130,150,135,121,224]"));
const keypair = Keypair.fromSecretKey(walletSecretKey);

async function swap() {
  const apiKey = "f74df995-dea5-4427-bcd1-f8be8c1c1d6f";

  // Use your real wallet Keypair instead of a dummy one
  const solanaTracker = new SolanaTracker(
    keypair,
    "https://rpc-mainnet.solanatracker.io/?api_key=e891a957-8d59-4888-89fe-8ee2109a3f2a", // Use actual RPC URL
    apiKey
  );


  const swapInstruction = await solanaTracker.getSwapInstructions(
    "So11111111111111111111111111111111111111112", // From Token (SOL)
    "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", // To Token (Raydium)
    0.01, // Amount to swap (updated to 0.01)
    30, // Slippage
    keypair.publicKey.toBase58(), // Real wallet public key
    0.0005, // Priority fee,
  );


  // ============



  async function mySwap() {
    const connection = new Connection(rpc);


    const res = swapInstruction
    console.log(swapInstruction.type)
    const serializedTransactionBuffer = Buffer.from(res.txn, "base64");
    let txn;
    let txid;
    if (res.type === 'v0') {
      txn = VersionedTransaction.deserialize(serializedTransactionBuffer);

      txn.sign([keypair]);

      txid = await connection.sendRawTransaction(txn.serialize(), {
        skipPreflight: true,
      });
      console.log(" txn swap ", txn, txid)
    } else {
      txn = Transaction.from(serializedTransactionBuffer);
      txn.sign(keypair);
      const rawTransaction = txn.serialize();
      txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      });
      console.log("else txn Swap ", txn, txid)
    }

    if (!txn) return false;

  }
  mySwap()
  return
  // =============








































  // console.log("response", swapInstruction)
  // Perform swap as before with your real wallet
  try {
    //  console.log(swapInstruction)
    const txid = await solanaTracker.performSwap(swapInstruction, {
      sendOptions: { skipPreflight: true },
      confirmationRetries: 30,
      confirmationRetryTimeout: 500,
      lastValidBlockHeightBuffer: 150,
      resendInterval: 1000,
      confirmationCheckInterval: 1000,
      commitment: "processed",
      skipConfirmationCheck: false,
      apiKey: apiKey
    });
    console.log("Transaction ID:", txid);
    console.log("Transaction URL:", `https://solscan.io/tx/${txid}`);
  } catch (error: any) {
    console.error("Error performing swap:", error.message);
  }

  // Jito transaction (if supported)
  try {
    const txid = await solanaTracker.performSwap(swapInstruction, {
      sendOptions: { skipPreflight: true },
      confirmationRetries: 30,
      confirmationCheckInterval: 500,
      commitment: "processed",
      jito: {
        enabled: true,
        tip: 0.0001,
      },
      apiKey: apiKey
    });
    console.log("Jito Transaction ID:", txid);
    console.log("Jito Transaction URL:", `https://solscan.io/tx/${txid}`);
  } catch (error: any) {
    console.error("Error performing Jito swap:", error.message);
  }
}

swap();


