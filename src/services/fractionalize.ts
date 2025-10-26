/**
 * NFT Fractionalization Service
 * 
 * This service allows you to split an NFT into multiple fungible token shares
 * that can be distributed and traded independently.
 * 
 * ENHANCED: Now includes Metaplex metadata for share tokens with name, symbol, and creator info
 */

import {
  Umi,
  PublicKey as UmiPublicKey,
  publicKey,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";
import {
  createFungible,
} from "@metaplex-foundation/mpl-token-metadata";
import { FractionalizeConfig, FractionalizeResult, ShareDistribution, ShareTransferResult, TokenMetadata } from "../types/fractionalize.js";
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
  connection: Connection,
  payer: Keypair,
  nftMintAddress: string,
  totalShares: number,
  shareDecimals: number = 0,
  cluster: "devnet" | "testnet" | "mainnet-beta" = "devnet"
): Promise<FractionalizeResult> {
  console.log(`\n🔨 Fractionalizing NFT into ${totalShares} shares...`);
  console.log(`NFT Mint: ${nftMintAddress}`);
  console.log(`Total Shares: ${totalShares}`);

  console.log(`\n📤 Creating share token mint...`);

  // Create the token mint (fungible token)
  const mint = await createMint(
    connection,
    payer,              // Payer
    payer.publicKey,    // Mint authority
    payer.publicKey,    // Freeze authority
    shareDecimals       // Decimals
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
  console.log(`\n🪙 Minting ${totalShares} shares...`);

  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,              // Mint authority
    totalShares
  );

  console.log(`✅ Minted ${totalShares} shares to your wallet`);

  const explorerLink = `https://explorer.solana.com/address/${mint.toBase58()}?cluster=${cluster}`;

  console.log(`\n✨ Fractionalization complete!`);
  console.log(`🔗 Share Token Mint: ${mint.toBase58()}`);
  console.log(`🔗 Explorer: ${explorerLink}`);

  return {
    shareTokenMint: mint.toBase58(),
    totalShares,
    tokenName: "Share Token",
    tokenSymbol: "SHARE",
    creator: payer.publicKey.toBase58(),
    explorerLink,
  };
}

/**
 * Create fractional shares with Metaplex metadata
 * 
 * @param umi - Umi instance
 * @param nftMintAddress - Original NFT
 * @param tokenName - Token name
 * @param tokenSymbol - Token symbol
 * @param totalShares - Number of shares
 * @param creatorName - Creator name
 * @param creatorId - Creator ID
 * @param description - Description
 * @param imageUrl - Image URL
 * @param shareDecimals - Decimals
 * @param cluster - Cluster
 * @returns Fractionalization result
 */
export async function fractionalizeNFTWithMetadata(
  umi: Umi,
  nftMintAddress: string,
  tokenName: string,
  tokenSymbol: string,
  totalShares: number,
  creatorName: string,
  creatorId?: string,
  description?: string,
  imageUrl?: string,
  shareDecimals: number = 0,
  cluster: "devnet" | "testnet" | "mainnet-beta" = "devnet"
): Promise<FractionalizeResult> {
  console.log(`\n🔨 Fractionalizing NFT with metadata...`);
  console.log(`NFT Mint: ${nftMintAddress}`);
  console.log(`Token Name: ${tokenName}`);
  console.log(`Token Symbol: ${tokenSymbol}`);
  console.log(`Total Shares: ${totalShares}`);
  console.log(`Creator: ${creatorName}`);

  // Upload metadata
  console.log(`\n📤 Uploading metadata...`);
  const metadataJson = {
    name: tokenName,
    symbol: tokenSymbol,
    description: description || `Fractional shares of NFT ${nftMintAddress.slice(0, 8)}... - ${totalShares} shares`,
    image: imageUrl || "",
    attributes: [
      { trait_type: "Original NFT", value: nftMintAddress },
      { trait_type: "Total Shares", value: totalShares.toString() },
      { trait_type: "Creator Name", value: creatorName },
      ...(creatorId ? [{ trait_type: "Creator ID", value: creatorId }] : []),
      { trait_type: "Created At", value: new Date().toISOString() },
    ],
  };

  const uri = await umi.uploader.uploadJson(metadataJson);
  console.log(`✅ Metadata uploaded: ${uri}`);

  // Create fungible token with metadata using SPL Token + Metaplex
  console.log(`\n📦 Creating fungible token...`);
  const mint = generateSigner(umi);

  // Step 1: Create the mint using createFungible (this creates both mint and metadata)
  await createFungible(umi, {
    mint,
    name: tokenName.slice(0, 32),
    symbol: tokenSymbol.slice(0, 10),
    uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: shareDecimals,
  }).sendAndConfirm(umi);

  console.log(`✅ Token created: ${mint.publicKey}`);

  // Step 2: Use SPL Token to mint shares (not Metaplex mintV1)
  console.log(`\n🪙 Minting ${totalShares} shares...`);

  // Load the keypair for SPL Token operations
  const keypair = await loadKeypair();
  const rpcEndpoint = cluster === "devnet"
    ? "https://api.devnet.solana.com"
    : cluster === "testnet"
      ? "https://api.testnet.solana.com"
      : "https://api.mainnet-beta.solana.com";

  const connection = new Connection(rpcEndpoint, "confirmed");
  const mintPubkey = new PublicKey(mint.publicKey.toString());

  // Get or create associated token account
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    mintPubkey,
    keypair.publicKey
  );

  // Mint shares using SPL Token
  await mintTo(
    connection,
    keypair,
    mintPubkey,
    tokenAccount.address,
    keypair,
    totalShares
  );

  console.log(`✅ Minted ${totalShares} shares`);

  const explorerLink = `https://explorer.solana.com/address/${mint.publicKey}?cluster=${cluster}`;

  return {
    shareTokenMint: mint.publicKey.toString(),
    totalShares,
    tokenName,
    tokenSymbol,
    creator: umi.identity.publicKey.toString(),
    explorerLink,
    metadataUri: uri,
  };
}

/**
 * Distribute shares to multiple recipients
 * 
 * FIXED: Now uses SPL Token program directly for programmatic distribution
 * 
 * @param connection - Solana connection
 * @param payer - Keypair for signing
 * @param shareTokenMintAddress - The share token mint address
 * @param distributions - Array of recipients and amounts
 * @param cluster - The Solana cluster
 * @returns Distribution results
 */
export async function distributeShares(
  connection: Connection,
  payer: Keypair,
  shareTokenMintAddress: string,
  distributions: Array<{ recipient: string; recipientName?: string; recipientId?: string; amount: number; note?: string }>,
  cluster: "devnet" | "testnet" | "mainnet-beta" = "devnet"
): Promise<{
  distributions: Array<{ recipient: string; recipientName?: string; recipientId?: string; amount: number; status: string; signature?: string }>;
  explorerLinks: string[];
  transferredBy: string;
  transferredAt: string;
}> {
  console.log(`\n📤 Distributing shares to ${distributions.length} recipients...`);

  const shareTokenMint = new PublicKey(shareTokenMintAddress);

  // Get sender's token account
  const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    shareTokenMint,
    payer.publicKey
  );

  const results = [];
  const explorerLinks = [];

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
      explorerLinks.push(explorerLink);

      results.push({
        recipient: dist.recipient,
        recipientName: dist.recipientName,
        recipientId: dist.recipientId,
        amount: dist.amount,
        status: "success",
        signature: signature,
      });

    } catch (error: any) {
      console.error(`❌ Failed to send to ${dist.recipient}:`, error.message);
      results.push({
        recipient: dist.recipient,
        recipientName: dist.recipientName,
        recipientId: dist.recipientId,
        amount: dist.amount,
        status: "failed",
      });
    }
  }

  const successCount = results.filter(r => r.status === "success").length;
  console.log(`\n✨ Distribution complete! ${successCount}/${distributions.length} successful`);

  return {
    distributions: results,
    explorerLinks,
    transferredBy: payer.publicKey.toBase58(),
    transferredAt: new Date().toISOString(),
  };
}

