/**
 * Script to batch create multiple product NFTs
 * 
 * Creates multiple product NFTs at once for efficient bulk manufacturing tracking
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
import { createProductsBatch } from "../services/product.js";
import { ManufacturingDetails } from "../types/product.js";

/**
 * Main function to batch create products
 */
async function main() {
  try {
    displaySeparator();
    console.log("🏭 Starting Batch Product Creation");
    displaySeparator();

    // Get environment configuration
    const envConfig = getEnvironmentConfig();
    console.log(`📡 Cluster: ${envConfig.cluster}`);
    console.log(`🔗 RPC Endpoint: ${envConfig.rpcEndpoint}`);

    // Check for batch collection address
    const batchCollectionAddress = process.env.BATCH_COLLECTION_ADDRESS;
    validateEnvVariable(batchCollectionAddress, "BATCH_COLLECTION_ADDRESS");

    // Create Solana connection
    const connection = new Connection(envConfig.rpcEndpoint!);

    // Load keypair and ensure funding
    const keypair = await loadKeypair();
    await ensureFunding(connection, keypair);

    // Create Umi instance
    const umi = createUmiInstance(envConfig.rpcEndpoint!, keypair);

    displaySeparator();

    // Configure batch creation
    // CUSTOMIZE THIS with your batch details!
    const batchId = "BATCH-2025-Q1-001";
    const productModel = "Model-X Pro Electronics";
    const productName = "Model-X Pro";
    const startSequence = 1; // Start from product #1
    const count = 10; // Create 10 products (change as needed)

    const manufacturingDetails: ManufacturingDetails = {
      factoryLocation: "Factory-A, Building-3, Line-7",
      productionLine: "Line-7",
      assemblyDate: "2025-01-15",
      materials: ["Aluminum Alloy", "PCB Board", "LCD Screen", "Battery"],
      weight: "250g",
      dimensions: "150x80x10mm",
    };

    console.log("📋 Batch Creation Configuration:");
    console.log(`   Batch ID: ${batchId}`);
    console.log(`   Product Model: ${productModel}`);
    console.log(`   Starting Sequence: ${startSequence}`);
    console.log(`   Number of Products: ${count}`);
    console.log(`   Factory: ${manufacturingDetails.factoryLocation}`);
    console.log(`   Production Date: ${manufacturingDetails.assemblyDate}`);

    displaySeparator();

    console.log(`\n⚠️  This will create ${count} product NFTs.`);
    console.log(`   Cost: ~${(count * 0.003).toFixed(3)} SOL`);
    console.log(`   Time: ~${count * 3} seconds\n`);

    // Create products in batch
    const results = await createProductsBatch(
      umi,
      batchCollectionAddress!,
      batchId,
      productModel,
      productName,
      startSequence,
      count,
      manufacturingDetails,
      envConfig.cluster
    );

    displaySeparator();
    displaySuccess(`Batch creation complete!`);

    console.log("\n📋 Batch Results:");
    console.log(`   Total Products Created: ${results.length}/${count}`);
    console.log(`   Success Rate: ${((results.length / count) * 100).toFixed(1)}%`);

    console.log("\n📦 Created Products:");
    results.forEach((result, index) => {
      console.log(`\n   Product ${index + 1}:`);
      console.log(`      Serial: ${result.serialNumber}`);
      console.log(`      NFT: ${result.productNft}`);
      console.log(`      Explorer: ${result.explorerLink}`);
    });

    console.log("\n💡 Next Steps:");
    console.log("   1. Verify products in batch collection:");
    console.log("      npm run product:verify-batch");
    console.log("   2. Generate QR codes for all products");
    console.log("   3. Print and attach QR codes");
    console.log("   4. Products ready for shipment");

    console.log("\n📊 Batch Statistics:");
    console.log(`   • Total Products: ${results.length}`);
    console.log(`   • Batch ID: ${batchId}`);
    console.log(`   • All records on blockchain: ✅`);
    console.log(`   • Individual traceability: ✅`);

    displaySeparator();
  } catch (error) {
    displayError("Failed to create products batch");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

