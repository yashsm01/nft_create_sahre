/**
 * Script to create a batch collection for product tracking
 * 
 * A batch collection represents a manufacturing batch that will contain
 * multiple product NFTs, all manufactured together.
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
} from "../utils/helpers.js";
import { createBatchCollection } from "../services/product.js";
import { BatchConfig } from "../types/product.js";

/**
 * Main function to create a batch collection
 */
async function main() {
  try {
    displaySeparator();
    console.log("🏭 Starting Batch Collection Creation");
    displaySeparator();

    // Get environment configuration
    const envConfig = getEnvironmentConfig();
    console.log(`📡 Cluster: ${envConfig.cluster}`);
    console.log(`🔗 RPC Endpoint: ${envConfig.rpcEndpoint}`);

    // Create Solana connection
    const connection = new Connection(envConfig.rpcEndpoint!);

    // Load keypair and ensure funding
    const keypair = await loadKeypair();
    await ensureFunding(connection, keypair);

    // Create Umi instance
    const umi = createUmiInstance(envConfig.rpcEndpoint!, keypair);

    displaySeparator();

    // Configure batch
    // CUSTOMIZE THIS with your batch details!
    const batchConfig: BatchConfig = {
      batchId: "BATCH-2025-Q1-001",
      productLine: "Electronics",
      productModel: "Model-X Pro",
      totalUnits: 1000,
      manufacturingDate: "2025-01-15",
      factoryLocation: "Factory-A, Building-3, Line-7",
      description: "First quarter 2025 production batch of Model-X Pro electronics",
      // imageFile: "path/to/batch/image.png" // Optional
    };

    console.log("📋 Batch Configuration:");
    console.log(`   Batch ID: ${batchConfig.batchId}`);
    console.log(`   Product Line: ${batchConfig.productLine}`);
    console.log(`   Product Model: ${batchConfig.productModel}`);
    console.log(`   Expected Units: ${batchConfig.totalUnits}`);
    console.log(`   Manufacturing Date: ${batchConfig.manufacturingDate}`);
    console.log(`   Factory: ${batchConfig.factoryLocation}`);

    displaySeparator();

    // Create batch collection
    const result = await createBatchCollection(
      umi,
      batchConfig,
      envConfig.cluster
    );

    displaySeparator();
    displaySuccess("Batch collection created successfully!");

    console.log("\n📋 Batch Collection Details:");
    console.log(`   Batch ID: ${result.batchId}`);
    console.log(`   Collection Address: ${result.batchCollection}`);
    console.log(`   Metadata URI: ${result.metadataUri}`);
    console.log(`   Explorer: ${result.explorerLink}`);

    console.log("\n💡 Next Steps:");
    console.log("   1. Save the collection address");
    console.log("   2. Add to .env file:");
    console.log(`      BATCH_COLLECTION_ADDRESS=${result.batchCollection}`);
    console.log("   3. Create individual products:");
    console.log("      npm run product:create");
    console.log("   4. Or batch create multiple products:");
    console.log("      npm run product:create-batch");

    console.log("\n📝 Important Notes:");
    console.log("   • This collection will contain all products from this batch");
    console.log("   • Each product will be linked to this collection");
    console.log("   • Products can be verified in the collection later");
    console.log("   • Collection provides batch-level traceability");

    displaySeparator();
  } catch (error) {
    displayError("Failed to create batch collection");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

