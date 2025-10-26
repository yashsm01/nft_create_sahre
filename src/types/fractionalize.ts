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
  creatorName: string;             // Creator name
  creatorId?: string;              // Creator ID (optional)
  description?: string;            // Token description
  imageUrl?: string;               // Token image URL
  pricePerShare?: number;          // Optional: Price per share in SOL
}

/**
 * Result of fractionalization
 */
export interface FractionalizeResult {
  shareTokenMint: string;          // Mint address of share tokens
  metadataAddress?: string;        // Metadata account address
  totalShares: number;             // Total shares created
  tokenName: string;               // Token name
  tokenSymbol: string;             // Token symbol
  creator: string;                 // Creator address
  explorerLink: string;            // Explorer link
  metadataUri?: string;            // Metadata URI on Arweave
}

/**
 * Share distribution configuration
 */
export interface ShareDistribution {
  recipient: string;               // Wallet address to receive shares
  recipientName?: string;          // Recipient name
  recipientId?: string;            // Recipient ID
  amount: number;                  // Number of shares to send
  note?: string;                   // Transfer note
}

/**
 * Share transfer result
 */
export interface ShareTransferResult {
  recipient: string;
  recipientName?: string;
  recipientId?: string;
  amount: number;
  signature: string;
  explorerLink: string;
  transferredBy: string;           // Address that initiated transfer
  transferredAt: string;           // Timestamp
}

/**
 * Token metadata attributes
 */
export interface TokenMetadata {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Array<{
    address: string;
    verified: boolean;
    share: number;
  }>;
}

