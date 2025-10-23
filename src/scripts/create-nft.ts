/**
 * Script to create a new NFT on Solana
 */

import "dotenv/config";
import { Connection } from "@solana/web3.js";
import { publicKey as UmiPublicKey } from "@metaplex-foundation/umi";
import { getEnvironmentConfig, DEFAULT_IMAGES } from "../config/constants.js";
import { createUmiInstance } from "../utils/umi.js";
import {
  loadKeypair,
  ensureFunding,
  displaySeparator,
  displaySuccess,
  displayError,
  displayInfo,
  validateEnvVariable,
} from "../utils/helpers.js";
import { createNFT } from "../services/nft.js";
import { validateNFTConfig } from "../services/metadata.js";
import { NFTConfig } from "../types/index.js";
import * as path from "path";

/**
 * Main function to create an NFT
 */
async function main() {
  try {
    displaySeparator();
    console.log("🚀 Starting NFT Creation Process");
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

    // Define NFT configuration
    const nftConfig: NFTConfig = {
      name: "My NFT",
      symbol: "MYNFT",
      description: "My amazing NFT on Solana",
      imageFile: path.resolve("assets/images", DEFAULT_IMAGES.NFT),
      sellerFeeBasisPoints: 0, // 0% royalty
      attributes: [
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Rarity", value: "Common" },
      ],
    };

    // Validate configuration
    validateNFTConfig(nftConfig);

    displaySeparator();

    // Check if collection address is provided
    let collectionAddress;
    if (envConfig.collectionAddress) {
      try {
        collectionAddress = UmiPublicKey(envConfig.collectionAddress);
        displayInfo(
          `Creating NFT as part of collection: ${envConfig.collectionAddress}`
        );
      } catch (error) {
        console.warn(
          "⚠️  Invalid collection address in .env, creating standalone NFT"
        );
      }
    } else {
      displayInfo("No collection address provided, creating standalone NFT");
      console.log(
        "   💡 To add this NFT to a collection, set COLLECTION_NFT_ADDRESS in .env"
      );
    }

    // Create the NFT
    const result = await createNFT(
      umi,
      nftConfig,
      envConfig.cluster,
      collectionAddress
    );

    displaySeparator();
    displaySuccess("NFT created successfully!");

    console.log("\n📋 NFT Details:");
    console.log(`   Name: ${nftConfig.name}`);
    console.log(`   Symbol: ${nftConfig.symbol}`);
    console.log(`   Address: ${result.mintAddress}`);
    console.log(`   Image URI: ${result.imageUri}`);
    console.log(`   Metadata URI: ${result.metadataUri}`);
    console.log(`   Explorer: ${result.explorerLink}`);

    if (collectionAddress) {
      console.log("\n💡 Next Steps:");
      console.log("   1. Verify this NFT as part of the collection");
      console.log("   2. Run 'npm run verify:nft' to verify collection membership");
      console.log("   3. Update NFT_ADDRESS in .env with the address above");
    } else {
      console.log("\n💡 Next Steps:");
      console.log("   1. View your NFT on Solana Explorer");
      console.log("   2. Update NFT_ADDRESS in .env to update this NFT later");
    }

    displaySeparator();
  } catch (error) {
    displayError("Failed to create NFT");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

