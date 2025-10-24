/**
 * Script to verify a product in its batch collection
 * 
 * This marks the product as officially verified and part of the batch
 */

import "dotenv/config";
import { Connection } from "@solana/web3.js";
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
import { verifyProductInBatch } from "../services/product.js";

/**
 * Main function to verify product
 */
async function main() {
  try {
    displaySeparator();
    console.log("✅ Starting Product Verification");
    displaySeparator();

    // Get environment configuration
    const envConfig = getEnvironmentConfig();
    console.log(`📡 Cluster: ${envConfig.cluster}`);
    console.log(`🔗 RPC Endpoint: ${envConfig.rpcEndpoint}`);

    // Check for required addresses
    const batchCollectionAddress = process.env.BATCH_COLLECTION_ADDRESS;
    const productNftAddress = process.env.PRODUCT_NFT_ADDRESS;

    validateEnvVariable(batchCollectionAddress, "BATCH_COLLECTION_ADDRESS");
    validateEnvVariable(productNftAddress, "PRODUCT_NFT_ADDRESS");

    // Create Solana connection
    const connection = new Connection(envConfig.rpcEndpoint!);

    // Load keypair and ensure funding
    const keypair = await loadKeypair();
    await ensureFunding(connection, keypair);

    // Create Umi instance
    const umi = createUmiInstance(envConfig.rpcEndpoint!, keypair);

    displaySeparator();

    console.log("📋 Verification Details:");
    console.log(`   Product NFT: ${productNftAddress}`);
    console.log(`   Batch Collection: ${batchCollectionAddress}`);

    displaySeparator();

    // Verify product in batch
    const result = await verifyProductInBatch(
      umi,
      productNftAddress!,
      batchCollectionAddress!,
      envConfig.cluster
    );

    displaySeparator();
    displaySuccess("Product verified successfully!");

    console.log("\n📋 Verification Result:");
    console.log(`   Product NFT: ${result.productNft}`);
    console.log(`   Batch Collection: ${result.batchCollection}`);
    console.log(`   Verification Status: ✅ VERIFIED`);
    console.log(`   Explorer: ${result.explorerLink}`);

    console.log("\n💡 What This Means:");
    console.log("   • Product is officially part of the batch");
    console.log("   • Verification is on-chain and immutable");
    console.log("   • Customers can verify authenticity");
    console.log("   • Product shows in batch collection");

    console.log("\n🎯 Next Steps:");
    console.log("   1. Product is ready for shipment");
    console.log("   2. QR code links to verified NFT");
    console.log("   3. Customers can scan to verify");
    console.log("   4. Ownership can be transferred");

    displaySeparator();
  } catch (error) {
    displayError("Failed to verify product");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

