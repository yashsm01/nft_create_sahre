/**
 * Script to distribute NFT shares programmatically using web3.js
 */

import "dotenv/config";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
  getMint,
} from "@solana/spl-token";
import { getEnvironmentConfig } from "../config/constants.js";
import {
  loadKeypair,
  ensureFunding,
  displaySeparator,
  displaySuccess,
  displayError,
  validateEnvVariable,
} from "../utils/helpers.js";

/**
 * Share distribution configuration
 */
interface ShareDistribution {
  recipient: string;
  amount: number;
  description?: string;
}

/**
 * Main function to distribute shares programmatically
 */
async function main() {
  try {
    displaySeparator();
    console.log("🚀 Starting Programmatic Share Distribution");
    displaySeparator();

    // Get environment configuration
    const envConfig = getEnvironmentConfig();
    console.log(`📡 Cluster: ${envConfig.cluster}`);
    console.log(`🔗 RPC Endpoint: ${envConfig.rpcEndpoint}`);

    // Check for share token mint in environment
    const shareTokenMintAddress = process.env.SHARE_TOKEN_MINT;
    validateEnvVariable(shareTokenMintAddress, "SHARE_TOKEN_MINT");

    // Create Solana connection
    const connection = new Connection(envConfig.rpcEndpoint!);

    // Load keypair and ensure funding
    const keypair = await loadKeypair();
    await ensureFunding(connection, keypair);

    displaySeparator();

    // Define share distribution
    // CUSTOMIZE THIS ARRAY with your recipients!
    const distributions: ShareDistribution[] = [
      {
        recipient: "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
        amount: 5,
        description: "First recipient - 5%",
      },
      // Add more recipients here
      // {
      //   recipient: "ANOTHER_WALLET_ADDRESS",
      //   amount: 10,
      //   description: "Second recipient - 10%",
      // },
    ];

    console.log("📋 Distribution Plan:");
    console.log(`   Share Token: ${shareTokenMintAddress}`);
    console.log(`   Recipients: ${distributions.length}`);
    console.log(
      `   Total Shares to Distribute: ${distributions.reduce((sum, d) => sum + d.amount, 0)}`
    );

    console.log("\n📤 Recipients:");
    distributions.forEach((dist, i) => {
      console.log(
        `   ${i + 1}. ${dist.recipient} → ${dist.amount} shares ${dist.description ? `(${dist.description})` : ""}`
      );
    });

    displaySeparator();

    // Convert addresses to PublicKey
    const mintPublicKey = new PublicKey(shareTokenMintAddress!);
    const fromWallet = keypair;

    // Get mint info
    console.log("\n🔍 Fetching token information...");
    const mintInfo = await getMint(connection, mintPublicKey);
    console.log(`   Decimals: ${mintInfo.decimals}`);
    console.log(`   Supply: ${mintInfo.supply}`);

    // Get or create sender's token account
    console.log("\n📍 Getting sender's token account...");
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mintPublicKey,
      fromWallet.publicKey
    );
    console.log(`   Sender Token Account: ${fromTokenAccount.address}`);
    console.log(`   Balance: ${fromTokenAccount.amount} shares`);

    displaySeparator();

    // Process each distribution
    const results = [];
    
    for (let i = 0; i < distributions.length; i++) {
      const dist = distributions[i];
      console.log(`\n📤 [${i + 1}/${distributions.length}] Distributing to ${dist.recipient}...`);

      try {
        const recipientPublicKey = new PublicKey(dist.recipient);

        // Get or create recipient's token account
        console.log(`   → Getting/creating recipient's token account...`);
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          fromWallet,
          mintPublicKey,
          recipientPublicKey
        );
        console.log(`   → Recipient Token Account: ${toTokenAccount.address}`);

        // Calculate amount with decimals
        const amount = BigInt(dist.amount) * BigInt(10 ** mintInfo.decimals);

        // Transfer tokens
        console.log(`   → Transferring ${dist.amount} shares...`);
        const signature = await transfer(
          connection,
          fromWallet,
          fromTokenAccount.address,
          toTokenAccount.address,
          fromWallet.publicKey,
          amount
        );

        console.log(`   ✅ Success!`);
        console.log(`   → Signature: ${signature}`);
        console.log(
          `   → Explorer: https://explorer.solana.com/tx/${signature}?cluster=${envConfig.cluster}`
        );

        results.push({
          recipient: dist.recipient,
          amount: dist.amount,
          signature,
          success: true,
        });
      } catch (error) {
        console.error(`   ❌ Failed: ${error}`);
        results.push({
          recipient: dist.recipient,
          amount: dist.amount,
          signature: null,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    displaySeparator();
    displaySuccess("Distribution complete!");

    // Summary
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log("\n📊 Distribution Summary:");
    console.log(`   Total Recipients: ${distributions.length}`);
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}`);
    console.log(
      `   Total Shares Distributed: ${results.filter((r) => r.success).reduce((sum, r) => sum + r.amount, 0)}`
    );

    console.log("\n📋 Detailed Results:");
    results.forEach((result, i) => {
      console.log(`\n   ${i + 1}. ${result.recipient}`);
      console.log(`      Amount: ${result.amount} shares`);
      console.log(`      Status: ${result.success ? "✅ Success" : "❌ Failed"}`);
      if (result.success && result.signature) {
        console.log(`      Signature: ${result.signature}`);
        console.log(
          `      Explorer: https://explorer.solana.com/tx/${result.signature}?cluster=${envConfig.cluster}`
        );
      }
      if (!result.success && result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });

    displaySeparator();

    console.log("\n💡 Next Steps:");
    console.log("   1. Recipients can view shares in their wallets");
    console.log("   2. Check your remaining balance:");
    console.log(`      spl-token balance ${shareTokenMintAddress} --url ${envConfig.cluster}`);
    console.log("   3. View all transfers on Solana Explorer");

    displaySeparator();
  } catch (error) {
    displayError("Failed to distribute shares");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

