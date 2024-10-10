import { Keypair, Connection, PublicKey, Transaction, sendAndConfirmTransaction, } from "@solana/web3.js";

export class SolanaTracker {
  private connection: Connection;

  constructor(
    private keypair: Keypair,
    private rpcUrl: string,
    private apiKey: string
  ) {
    this.connection = new Connection(rpcUrl);
  }

  // async getSwapInstructions(
  //   fromToken: string,
  //   toToken: string,
  //   amount: number,
  //   slippage: number,
  //   payerPublicKey: string,
  //   priorityFee: number
  // ) {
  //   // This is a placeholder for the actual swap instruction logic
  //   // You would typically make an API call here to get the swap instructions
    
  //   console.log("Getting swap instructions...");
  //   return {
  //     instructions: [],
  //     signers: [],
  //     // Other necessary data for the swap
  //   };
  // }

  async getSwapInstructions(
    fromToken: string,
    toToken: string,
    amount: number,
    slippage: number,
    payerPublicKey: string,
    priorityFee: number
  ) {
    try {
      // Construct the API URL with query parameters
      const url = `https://swap-v2.solanatracker.io/swap?from=${fromToken}&to=${toToken}&fromAmount=${amount}&slippage=${slippage}&payer=${payerPublicKey}`;
  
      // Make a GET request to the API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error(`Error fetching swap instructions: ${response.statusText}`);
      }
  
      // Parse the response as JSON
      const data = await response.json();
  
      // Check if the API returned valid swap instructions
      if (!data || !data.txn) {
        throw new Error("Invalid swap data received");
      }
  
      // Extract the transaction (swap instructions) and rate data from the response
      const txn = data.txn;
      const rate = data.rate;
  
      // Prepare the instructions and signers based on the response data
      const instructions = 
        {
          ...data,
          txn: txn,
          rate: rate,
          fromToken: fromToken,
          toToken: toToken,
          amount: amount,
          slippage: slippage,
          priorityFee: priorityFee
        }
      
  
      // The signer is the payer's public key (in this case, the person initiating the swap)
      const signers = [payerPublicKey];
  
      // Return the instructions and signers to be used later
      return {
        ... instructions,
        signers: signers
      };
    } catch (error) {
      console.error("Error in getSwapInstructions:", error);
      throw error;
    }
  }
  
  async performSwap(swapResponse: any, options: any) {
    console.log("Performing swap with API key:", this.apiKey, options);
    
    // This is a placeholder for the actual swap logic
    // You would typically create and send a transaction here
    
    const transaction = new Transaction();
    transaction.add(swapResponse)
    // Add instructions from swapResponse to the transaction
    // https://swap-v2.solanatracker.io/swap?from=So11111111111111111111111111111111111111112&to=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&fromAmount=1&slippage=10&payer=PAYER_ADDRESS
    try {
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.keypair],
        options.sendOptions
      );
      
      console.log("Swap completed. Transaction signature:", signature);
      return signature;
    } catch (error) {
      console.error("Error performing swap:", error);
      throw error;
    }
  }
}