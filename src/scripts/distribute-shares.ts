/**
 * Script to distribute NFT shares to multiple recipients
 */

import "dotenv/config";
import { Connection } from "@solana/web3.js";
import { publicKey as UmiPublicKey } from "@metaplex-foundation/umi";
import { getEnvironmentConfig } from "../config/constants.js";
import { createUmiInstance } from "../utils/umi.js";
import {
  loadKeypair,
  ensureFunding,
  displaySeparator,
  displaySuccess,
  displayError,
  validateEnvVariable,
} from "../utils/helpers.js";
import { distributeShares } from "../services/fractionalize.js";
import { ShareDistribution } from "../types/fractionalize.js";

/**
 * Main function to distribute shares
 */
async function main() {
  try {
    displaySeparator();
    console.log("🚀 Starting Share Distribution Process");
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

    // Create Umi instance
    const umi = createUmiInstance(envConfig.rpcEndpoint!, keypair);

    displaySeparator();

    // Configure share distribution
    // CUSTOMIZE THIS ARRAY with your recipients!
    const distributions: ShareDistribution[] = [
      {
        recipient: "8vNFrvPuB46CXQyQ8VLUoA2D9yvHQo7NNaTesw4YA8A3", // Replace with actual address
        amount: 10, // Send 10 shares
      },
      // {
      //   recipient: "RECIPIENT_WALLET_ADDRESS_2", // Replace with actual address
      //   amount: 20, // Send 20 shares
      // },
      // {
      //   recipient: "RECIPIENT_WALLET_ADDRESS_3", // Replace with actual address
      //   amount: 30, // Send 30 shares
      // },
      // Add more recipients as needed
    ];

    console.log("📋 Distribution Plan:");
    console.log(`   Share Token: ${shareTokenMintAddress}`);
    console.log(`   Recipients: ${distributions.length}`);
    console.log(`   Total Shares to Distribute: ${distributions.reduce((sum, d) => sum + d.amount, 0)}`);

    console.log("\n📤 Recipients:");
    distributions.forEach((dist, i) => {
      console.log(`   ${i + 1}. ${dist.recipient} → ${dist.amount} shares`);
    });

    displaySeparator();

    console.log("⚠️  IMPORTANT: Make sure you've updated the recipient addresses!");
    console.log("   Edit src/scripts/distribute-shares.ts to add real wallet addresses.\n");

    // Check if addresses are still placeholders
    const hasPlaceholders = distributions.some(d => 
      d.recipient.includes("RECIPIENT_WALLET_ADDRESS")
    );

    if (hasPlaceholders) {
      displayError("Placeholder addresses detected!");
      console.log("\n❌ Please update the recipient addresses in:");
      console.log("   src/scripts/distribute-shares.ts");
      console.log("\nReplace 'RECIPIENT_WALLET_ADDRESS_X' with actual Solana wallet addresses.");
      process.exit(1);
    }

    // Distribute shares
    const results = await distributeShares(
      umi,
      shareTokenMintAddress!,
      distributions,
      envConfig.cluster
    );

    displaySeparator();
    displaySuccess("Share distribution complete!");

    console.log("\n📋 Distribution Results:");
    results.forEach((result, i) => {
      console.log(`\n   Transfer ${i + 1}:`);
      console.log(`   Recipient: ${result.recipient}`);
      console.log(`   Amount: ${result.amount} shares`);
      console.log(`   Signature: ${result.signature}`);
      console.log(`   Explorer: ${result.explorerLink}`);
    });

    console.log("\n💡 Next Steps:");
    console.log("   1. Recipients can now see shares in their wallets");
    console.log("   2. Shares can be traded on DEXs as fungible tokens");
    console.log("   3. Track ownership and voting rights as needed");

    displaySeparator();
  } catch (error) {
    displayError("Failed to distribute shares");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

