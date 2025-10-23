/**
 * Script to verify an NFT as part of a collection
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
import { verifyNFTCollection } from "../services/nft.js";

/**
 * Main function to verify an NFT
 */
async function main() {
  try {
    displaySeparator();
    console.log("🚀 Starting NFT Verification Process");
    displaySeparator();

    // Get environment configuration
    const envConfig = getEnvironmentConfig();
    console.log(`📡 Cluster: ${envConfig.cluster}`);
    console.log(`🔗 RPC Endpoint: ${envConfig.rpcEndpoint}`);

    // Validate required environment variables
    validateEnvVariable(
      envConfig.collectionAddress,
      "COLLECTION_NFT_ADDRESS"
    );
    validateEnvVariable(envConfig.nftAddress, "NFT_ADDRESS");

    // Create Solana connection
    const connection = new Connection(envConfig.rpcEndpoint!);

    // Load keypair and ensure funding
    const keypair = await loadKeypair();
    await ensureFunding(connection, keypair);

    // Create Umi instance
    const umi = createUmiInstance(envConfig.rpcEndpoint!, keypair);

    // Convert addresses to Umi PublicKeys
    const collectionAddress = UmiPublicKey(envConfig.collectionAddress!);
    const nftAddress = UmiPublicKey(envConfig.nftAddress!);

    displaySeparator();

    // Verify the NFT
    await verifyNFTCollection(
      umi,
      nftAddress,
      collectionAddress,
      envConfig.cluster
    );

    displaySeparator();
    displaySuccess("NFT verified successfully!");

    console.log("\n📋 Verification Details:");
    console.log(`   NFT Address: ${nftAddress}`);
    console.log(`   Collection Address: ${collectionAddress}`);
    console.log(
      `   Status: ✅ Verified as part of collection`
    );

    console.log("\n💡 Next Steps:");
    console.log("   1. View your verified NFT on Solana Explorer");
    console.log("   2. The 'verified' field should now be set to true");
    console.log(
      "   3. Marketplaces will now recognize this NFT as part of the collection"
    );

    displaySeparator();
  } catch (error) {
    displayError("Failed to verify NFT");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

