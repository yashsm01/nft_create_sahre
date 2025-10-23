/**
 * Script to create a new NFT collection on Solana
 */

import "dotenv/config";
import { Connection } from "@solana/web3.js";
import { getEnvironmentConfig, DEFAULT_IMAGES } from "../config/constants.js";
import { createUmiInstance } from "../utils/umi.js";
import {
  loadKeypair,
  ensureFunding,
  displaySeparator,
  displaySuccess,
  displayError,
} from "../utils/helpers.js";
import { createCollection } from "../services/collection.js";
import { validateCollectionConfig } from "../services/metadata.js";
import { CollectionConfig } from "../types/index.js";
import * as path from "path";

/**
 * Main function to create a collection
 */
async function main() {
  try {
    displaySeparator();
    console.log("🚀 Starting Collection Creation Process");
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

    // Define collection configuration
    const collectionConfig: CollectionConfig = {
      name: "My Collection",
      symbol: "MYCOL",
      description: "My NFT Collection on Solana",
      imageFile: path.resolve("assets/images", DEFAULT_IMAGES.COLLECTION),
      sellerFeeBasisPoints: 0, // 0% royalty
    };

    // Validate configuration
    validateCollectionConfig(collectionConfig);

    displaySeparator();

    // Create the collection
    const result = await createCollection(
      umi,
      collectionConfig,
      envConfig.cluster
    );

    displaySeparator();
    displaySuccess("Collection created successfully!");

    console.log("\n📋 Collection Details:");
    console.log(`   Name: ${collectionConfig.name}`);
    console.log(`   Symbol: ${collectionConfig.symbol}`);
    console.log(`   Address: ${result.collectionAddress}`);
    console.log(`   Image URI: ${result.imageUri}`);
    console.log(`   Metadata URI: ${result.metadataUri}`);
    console.log(`   Explorer: ${result.explorerLink}`);

    console.log("\n💡 Next Steps:");
    console.log(
      "   1. Save the collection address for creating NFTs in this collection"
    );
    console.log("   2. View your collection on Solana Explorer");
    console.log(
      "   3. Run 'npm run create:nft' to create NFTs in this collection"
    );

    displaySeparator();
  } catch (error) {
    displayError("Failed to create collection");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

