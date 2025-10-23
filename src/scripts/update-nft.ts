/**
 * Script to update an existing NFT's metadata
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
  validateEnvVariable,
} from "../utils/helpers.js";
import { updateNFT } from "../services/nft.js";
import { NFTUpdateData } from "../types/index.js";
import * as path from "path";

/**
 * Main function to update an NFT
 */
async function main() {
  try {
    displaySeparator();
    console.log("🚀 Starting NFT Update Process");
    displaySeparator();

    // Get environment configuration
    const envConfig = getEnvironmentConfig();
    console.log(`📡 Cluster: ${envConfig.cluster}`);
    console.log(`🔗 RPC Endpoint: ${envConfig.rpcEndpoint}`);

    // Validate required environment variables
    validateEnvVariable(envConfig.nftAddress, "NFT_ADDRESS");

    // Create Solana connection
    const connection = new Connection(envConfig.rpcEndpoint!);

    // Load keypair and ensure funding
    const keypair = await loadKeypair();
    await ensureFunding(connection, keypair);

    // Create Umi instance
    const umi = createUmiInstance(envConfig.rpcEndpoint!, keypair);

    // Convert address to Umi PublicKey
    const nftAddress = UmiPublicKey(envConfig.nftAddress!);

    // Define update data
    const updateData: NFTUpdateData = {
      name: "Updated NFT Name",
      sellerFeeBasisPoints: 500, // 5% royalty
      primarySaleHappened: true,
      isMutable: true,
    };

    // Optional: Provide new image path if you want to update the image
    const newImagePath = path.resolve("assets/images", DEFAULT_IMAGES.NFT);

    displaySeparator();

    console.log("📝 Update Details:");
    if (updateData.name) console.log(`   New Name: ${updateData.name}`);
    if (updateData.symbol) console.log(`   New Symbol: ${updateData.symbol}`);
    if (updateData.sellerFeeBasisPoints !== undefined) {
      console.log(
        `   New Royalty: ${updateData.sellerFeeBasisPoints / 100}%`
      );
    }
    if (newImagePath) console.log(`   New Image: Yes`);

    displaySeparator();

    // Update the NFT
    await updateNFT(
      umi,
      nftAddress,
      updateData,
      envConfig.cluster,
      newImagePath // Pass undefined if you don't want to update the image
    );

    displaySeparator();
    displaySuccess("NFT updated successfully!");

    console.log("\n📋 Updated NFT:");
    console.log(`   Address: ${nftAddress}`);

    console.log("\n💡 Next Steps:");
    console.log("   1. View your updated NFT on Solana Explorer");
    console.log("   2. The metadata should reflect the changes");
    console.log("   3. It may take a few moments for the changes to propagate");

    displaySeparator();
  } catch (error) {
    displayError("Failed to update NFT");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

