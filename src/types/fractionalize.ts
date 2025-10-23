/**
 * Type definitions for NFT fractionalization
 */

import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";

/**
 * Configuration for fractionalizing an NFT
 */
export interface FractionalizeConfig {
  nftMint: UmiPublicKey;          // The NFT to fractionalize
  totalShares: number;             // Total number of shares to create
  shareName: string;               // Name of the share tokens
  shareSymbol: string;             // Symbol for share tokens
  pricePerShare?: number;          // Optional: Price per share in SOL
}

/**
 * Result of fractionalization
 */
export interface FractionalizeResult {
  shareTokenMint: string;          // Mint address of share tokens
  totalShares: number;             // Total shares created
  explorerLink: string;            // Explorer link
}

/**
 * Share distribution configuration
 */
export interface ShareDistribution {
  recipient: string;               // Wallet address to receive shares
  amount: number;                  // Number of shares to send
}

/**
 * Share transfer result
 */
export interface ShareTransferResult {
  recipient: string;
  amount: number;
  signature: string;
  explorerLink: string;
}

