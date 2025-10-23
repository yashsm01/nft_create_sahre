/**
 * NFT Fractionalization Service
 * 
 * This service allows you to split an NFT into multiple fungible token shares
 * that can be distributed and traded independently.
 * 
 * FIXED: Now uses SPL Token program directly instead of Metaplex Token Metadata
 */

import {
  Umi,
  PublicKey as UmiPublicKey,
  publicKey,
} from "@metaplex-foundation/umi";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo,
  transfer,
} from "@solana/spl-token";
import { FractionalizeConfig, FractionalizeResult, ShareDistribution, ShareTransferResult } from "../types/fractionalize.js";
import { loadKeypair } from "../utils/helpers.js";

/**
 * Create fractional shares for an NFT
 * 
 * FIXED: Now uses SPL Token program directly for proper fungible token creation
 * 
 * Note: This creates a new fungible token representing shares.
 * In a production system, you'd also want to lock/vault the original NFT.
 * 
 * @param umi - The Umi instance
 * @param config - Fractionalization configuration
 * @param cluster - The Solana cluster
 * @returns Fractionalization result
 */
export async function fractionalizeNFT(
  umi: Umi,
  config: FractionalizeConfig,
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<FractionalizeResult> {
  console.log(`\n🔨 Fractionalizing NFT into ${config.totalShares} shares...`);
  console.log(`NFT Mint: ${config.nftMint}`);
  console.log(`Share Name: ${config.shareName}`);
  console.log(`Share Symbol: ${config.shareSymbol}`);
  console.log(`Total Shares: ${config.totalShares}`);

  // Get RPC endpoint based on cluster
  const rpcEndpoint = cluster === "devnet" 
    ? "https://api.devnet.solana.com"
    : cluster === "testnet"
    ? "https://api.testnet.solana.com"
    : "https://api.mainnet-beta.solana.com";

  const connection = new Connection(rpcEndpoint, "confirmed");

  // Load the keypair directly
  const payer = await loadKeypair();

  console.log(`\n📤 Creating share token mint...`);

  // Create the token mint (fungible token with 0 decimals)
  const mint = await createMint(
    connection,
    payer,              // Payer
    payer.publicKey,    // Mint authority
    payer.publicKey,    // Freeze authority
    0                   // 0 decimals - shares are whole numbers
  );

  console.log(`✅ Share token mint created: ${mint.toBase58()}`);

  // Create associated token account for the payer
  console.log(`\n📦 Creating token account...`);
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log(`✅ Token account created: ${tokenAccount.address.toBase58()}`);

  // Mint all shares to the creator
  console.log(`\n🪙 Minting ${config.totalShares} shares...`);
  
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,              // Mint authority
    config.totalShares
  );

  console.log(`✅ Minted ${config.totalShares} shares to your wallet`);

  const explorerLink = `https://explorer.solana.com/address/${mint.toBase58()}?cluster=${cluster}`;

  console.log(`\n✨ Fractionalization complete!`);
  console.log(`🔗 Share Token Mint: ${mint.toBase58()}`);
  console.log(`🔗 Explorer: ${explorerLink}`);

  return {
    shareTokenMint: mint.toBase58(),
    totalShares: config.totalShares,
    explorerLink,
  };
}

/**
 * Distribute shares to multiple recipients
 * 
 * FIXED: Now uses SPL Token program directly for programmatic distribution
 * 
 * @param umi - The Umi instance
 * @param shareTokenMint - The share token mint address (as string)
 * @param distributions - Array of recipients and amounts
 * @param cluster - The Solana cluster
 * @returns Array of transfer results
 */
export async function distributeShares(
  umi: Umi,
  shareTokenMintAddress: string,
  distributions: ShareDistribution[],
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<ShareTransferResult[]> {
  console.log(`\n📤 Distributing shares to ${distributions.length} recipients...`);

  // Get RPC endpoint based on cluster
  const rpcEndpoint = cluster === "devnet" 
    ? "https://api.devnet.solana.com"
    : cluster === "testnet"
    ? "https://api.testnet.solana.com"
    : "https://api.mainnet-beta.solana.com";

  const connection = new Connection(rpcEndpoint, "confirmed");

  // Load the keypair directly
  const payer = await loadKeypair();

  const shareTokenMint = new PublicKey(shareTokenMintAddress);

  // Get sender's token account
  const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    shareTokenMint,
    payer.publicKey
  );

  const results: ShareTransferResult[] = [];

  // Process each distribution
  for (let i = 0; i < distributions.length; i++) {
    const dist = distributions[i];
    console.log(`\n[${i + 1}/${distributions.length}] Sending ${dist.amount} shares to ${dist.recipient}...`);

    try {
      const recipientPublicKey = new PublicKey(dist.recipient);

      // Get or create recipient's token account
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        shareTokenMint,
        recipientPublicKey,
        true // Allow owner off curve
      );

      // Transfer shares
      const signature = await transfer(
        connection,
        payer,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        payer.publicKey,
        dist.amount
      );

      console.log(`✅ Transfer successful!`);
      console.log(`   Signature: ${signature}`);

      const explorerLink = `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;

      results.push({
        recipient: dist.recipient,
        amount: dist.amount,
        signature: signature,
        explorerLink: explorerLink,
      });

    } catch (error) {
      console.error(`❌ Failed to send to ${dist.recipient}:`, error);
      results.push({
        recipient: dist.recipient,
        amount: dist.amount,
        signature: "failed",
        explorerLink: `https://explorer.solana.com/address/${dist.recipient}?cluster=${cluster}`,
      });
    }
  }

  console.log(`\n✨ Distribution complete! ${results.filter(r => r.signature !== "failed").length}/${distributions.length} successful`);

  return results;
}

