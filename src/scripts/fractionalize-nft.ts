/**
 * Script to fractionalize an NFT into multiple shares
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
import { fractionalizeNFT } from "../services/fractionalize.js";
import { FractionalizeConfig } from "../types/fractionalize.js";

/**
 * Main function to fractionalize an NFT
 */
async function main() {
  try {
    displaySeparator();
    console.log("🚀 Starting NFT Fractionalization Process");
    displaySeparator();

    // Get environment configuration
    const envConfig = getEnvironmentConfig();
    console.log(`📡 Cluster: ${envConfig.cluster}`);
    console.log(`🔗 RPC Endpoint: ${envConfig.rpcEndpoint}`);

    // Validate NFT address
    validateEnvVariable(envConfig.nftAddress, "NFT_ADDRESS");

    // Create Solana connection
    const connection = new Connection(envConfig.rpcEndpoint!);

    // Load keypair and ensure funding
    const keypair = await loadKeypair();
    await ensureFunding(connection, keypair);

    // Create Umi instance
    const umi = createUmiInstance(envConfig.rpcEndpoint!, keypair);

    displaySeparator();

    // Configure fractionalization
    const fractionalizeConfig: FractionalizeConfig = {
      nftMint: UmiPublicKey(envConfig.nftAddress!),
      totalShares: 100, // Create 100 shares
      shareName: "My NFT Shares",
      shareSymbol: "MNFTS",
      pricePerShare: 0.01, // Optional: 0.01 SOL per share
    };

    console.log("📋 Fractionalization Configuration:");
    console.log(`   NFT: ${fractionalizeConfig.nftMint}`);
    console.log(`   Total Shares: ${fractionalizeConfig.totalShares}`);
    console.log(`   Share Name: ${fractionalizeConfig.shareName}`);
    console.log(`   Share Symbol: ${fractionalizeConfig.shareSymbol}`);
    if (fractionalizeConfig.pricePerShare) {
      console.log(`   Price per Share: ${fractionalizeConfig.pricePerShare} SOL`);
    }

    displaySeparator();

    // Fractionalize the NFT
    const result = await fractionalizeNFT(
      umi,
      fractionalizeConfig,
      envConfig.cluster
    );

    displaySeparator();
    displaySuccess("NFT fractionalized successfully!");

    console.log("\n📋 Fractionalization Results:");
    console.log(`   Share Token Mint: ${result.shareTokenMint}`);
    console.log(`   Total Shares Created: ${result.totalShares}`);
    console.log(`   Explorer: ${result.explorerLink}`);

    console.log("\n💡 Next Steps:");
    console.log("   1. You now own all shares in your wallet");
    console.log("   2. Run 'npm run distribute:shares' to send shares to others");
    console.log("   3. Add SHARE_TOKEN_MINT to .env:");
    console.log(`      SHARE_TOKEN_MINT=${result.shareTokenMint}`);
    console.log("   4. Shares can be traded like any fungible token!");

    console.log("\n⚠️  Important Notes:");
    console.log("   - This creates share tokens representing fractional ownership");
    console.log("   - The original NFT is still in your wallet");
    console.log("   - For production, lock the NFT in a vault program");
    console.log("   - Consider using a formal fractional NFT protocol");

    displaySeparator();
  } catch (error) {
    displayError("Failed to fractionalize NFT");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

