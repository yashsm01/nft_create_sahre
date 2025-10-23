/**
 * Script to fractionalize an NFT using simple SPL tokens
 * This uses the Solana CLI approach that we know works!
 */

import "dotenv/config";
import { Connection } from "@solana/web3.js";
import { exec } from "child_process";
import { promisify } from "util";
import { getEnvironmentConfig } from "../config/constants.js";
import {
  loadKeypair,
  ensureFunding,
  displaySeparator,
  displaySuccess,
  displayError,
  validateEnvVariable,
} from "../utils/helpers.js";

const execAsync = promisify(exec);

/**
 * Main function to fractionalize an NFT using CLI
 */
async function main() {
  try {
    displaySeparator();
    console.log("🚀 Starting NFT Fractionalization (Simple Method)");
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

    displaySeparator();

    // Configuration
    const totalShares = 100;
    const shareName = "My NFT Shares";
    const shareSymbol = "MNFTS";

    console.log("📋 Fractionalization Configuration:");
    console.log(`   NFT: ${envConfig.nftAddress}`);
    console.log(`   Total Shares: ${totalShares}`);
    console.log(`   Share Name: ${shareName}`);
    console.log(`   Share Symbol: ${shareSymbol}`);

    displaySeparator();

    console.log("\n🔨 Step 1: Creating share token...");
    
    // Create token with 0 decimals
    const createTokenCmd = `spl-token create-token --decimals 0 --url ${envConfig.cluster}`;
    console.log(`Running: ${createTokenCmd}`);
    
    const createResult = await execAsync(createTokenCmd);
    console.log(createResult.stdout);
    
    // Extract token address from output
    const tokenMatch = createResult.stdout.match(/Creating token (\w+)/);
    if (!tokenMatch) {
      throw new Error("Failed to extract token address from output");
    }
    
    const shareTokenMint = tokenMatch[1];
    console.log(`✅ Share token created: ${shareTokenMint}`);

    displaySeparator();

    console.log("\n🔨 Step 2: Creating token account...");
    
    const createAccountCmd = `spl-token create-account ${shareTokenMint} --url ${envConfig.cluster}`;
    console.log(`Running: ${createAccountCmd}`);
    
    const accountResult = await execAsync(createAccountCmd);
    console.log(accountResult.stdout);
    console.log(`✅ Token account created`);

    displaySeparator();

    console.log("\n🔨 Step 3: Minting shares...");
    
    const mintCmd = `spl-token mint ${shareTokenMint} ${totalShares} --url ${envConfig.cluster}`;
    console.log(`Running: ${mintCmd}`);
    
    const mintResult = await execAsync(mintCmd);
    console.log(mintResult.stdout);
    console.log(`✅ Minted ${totalShares} shares`);

    displaySeparator();

    // Verify balance
    console.log("\n🔍 Verifying balance...");
    const balanceCmd = `spl-token balance ${shareTokenMint} --url ${envConfig.cluster}`;
    const balanceResult = await execAsync(balanceCmd);
    const balance = balanceResult.stdout.trim();
    
    console.log(`✅ Your balance: ${balance} shares`);

    displaySeparator();
    displaySuccess("NFT fractionalized successfully!");

    const explorerLink = `https://explorer.solana.com/address/${shareTokenMint}?cluster=${envConfig.cluster}`;

    console.log("\n📋 Fractionalization Results:");
    console.log(`   Share Token Mint: ${shareTokenMint}`);
    console.log(`   Total Shares Created: ${totalShares}`);
    console.log(`   Your Balance: ${balance} shares`);
    console.log(`   Explorer: ${explorerLink}`);

    console.log("\n💡 Next Steps:");
    console.log("   1. Add this to your .env file:");
    console.log(`      SHARE_TOKEN_MINT=${shareTokenMint}`);
    console.log("\n   2. To distribute shares, use:");
    console.log(`      spl-token transfer ${shareTokenMint} <AMOUNT> <RECIPIENT_WALLET> --fund-recipient --url ${envConfig.cluster}`);
    console.log("\n   3. Example: Send 25 shares (25%) to someone:");
    console.log(`      spl-token transfer ${shareTokenMint} 25 <WALLET_ADDRESS> --fund-recipient --url ${envConfig.cluster}`);

    console.log("\n✅ Share tokens represent fractional ownership of your NFT!");
    console.log("   Original NFT: " + envConfig.nftAddress);

    displaySeparator();
  } catch (error) {
    displayError("Failed to fractionalize NFT");
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

