/**
 * Script to create individual product NFT
 * 
 * Creates a unique NFT for a manufactured product with complete traceability
 * information including serial number, batch, quality checks, etc.
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
import {
  createProductNFT,
  generateSerialNumber,
} from "../services/product.js";
import { ProductConfig, ProductSerialConfig } from "../types/product.js";

/**
 * Main function to create a product NFT
 */
async function main() {
  try {
    displaySeparator();
    console.log("🏭 Starting Product NFT Creation");
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

    // Generate unique serial number
    const serialConfig: ProductSerialConfig = {
      prefix: "PROD",
      year: 2025,
      batchId: "BATCH001",
      sequenceNumber: 1, // Increment this for each product
    };

    const serialNumber = generateSerialNumber(serialConfig);

    // Configure product
    // CUSTOMIZE THIS with your product details!
    const productConfig: ProductConfig = {
      serialNumber: serialNumber,
      batchCollection: UmiPublicKey(batchCollectionAddress!),
      batchId: "BATCH-2025-Q1-001",
      productName: "Model-X Pro",
      productModel: "Model-X Pro Electronics",
      manufacturingDetails: {
        factoryLocation: "Factory-A, Building-3, Line-7",
        productionLine: "Line-7",
        assemblyDate: "2025-01-15",
        assemblyTime: "09:30:00",
        assemblyOperator: "John Doe (EMP-123)",
        materials: ["Aluminum Alloy", "PCB Board", "LCD Screen", "Battery"],
        weight: "250g",
        dimensions: "150x80x10mm",
      },
      qualityInspection: {
        passed: true,
        grade: "A",
        inspector: "Jane Smith (QA-456)",
        inspectionDate: "2025-01-15",
        defects: [],
        notes: "All quality checks passed successfully",
      },
      additionalAttributes: [
        {
          trait_type: "Warranty Period",
          value: "2 years",
        },
        {
          trait_type: "Color",
          value: "Space Gray",
        },
        {
          trait_type: "Storage",
          value: "128GB",
        },
      ],
      // imageFile: "path/to/product/image.png" // Optional
    };

    console.log("📋 Product Configuration:");
    console.log(`   Serial Number: ${productConfig.serialNumber}`);
    console.log(`   Batch ID: ${productConfig.batchId}`);
    console.log(`   Product Model: ${productConfig.productModel}`);
    console.log(`   Manufacturing Date: ${productConfig.manufacturingDetails.assemblyDate}`);
    console.log(`   Factory: ${productConfig.manufacturingDetails.factoryLocation}`);
    console.log(`   Quality Grade: ${productConfig.qualityInspection?.grade}`);

    displaySeparator();

    // Create product NFT
    const result = await createProductNFT(
      umi,
      productConfig,
      envConfig.cluster
    );

    displaySeparator();
    displaySuccess("Product NFT created successfully!");

    console.log("\n📋 Product Details:");
    console.log(`   Serial Number: ${result.serialNumber}`);
    console.log(`   Batch ID: ${result.batchId}`);
    console.log(`   Product NFT: ${result.productNft}`);
    console.log(`   Metadata URI: ${result.metadataUri}`);
    console.log(`   Explorer: ${result.explorerLink}`);

    console.log("\n💡 Next Steps:");
    console.log("   1. Verify product in batch collection:");
    console.log("      npm run product:verify");
    console.log("   2. Print QR code linking to NFT");
    console.log("   3. Attach QR code to physical product");
    console.log("   4. Transfer ownership when shipped:");
    console.log("      npm run product:transfer");

    console.log("\n📝 Product Information:");
    console.log(`   • Serial: ${result.serialNumber}`);
    console.log(`   • Blockchain: Immutable record created`);
    console.log(`   • QR Code Data: ${result.explorerLink}`);
    console.log(`   • Authenticity: Verifiable on blockchain`);

    console.log("\n🎯 Use Cases:");
    console.log("   ✅ Anti-counterfeiting verification");
    console.log("   ✅ Supply chain tracking");
    console.log("   ✅ Warranty claims");
    console.log("   ✅ Product recalls");
    console.log("   ✅ Secondary market authentication");

    displaySeparator();
  } catch (error) {
    displayError("Failed to create product NFT");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

