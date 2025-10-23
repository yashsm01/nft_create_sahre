/**
 * Configuration constants for the Solana NFT project
 */

import { clusterApiUrl } from "@solana/web3.js";
import { EnvironmentConfig } from "../types/index.js";

/**
 * Default Solana cluster to use
 */
export const DEFAULT_CLUSTER: "devnet" | "testnet" | "mainnet-beta" = "devnet";

/**
 * Default airdrop amounts
 */
export const AIRDROP_AMOUNT = {
  TARGET: 1, // SOL to airdrop if balance is low
  THRESHOLD: 0.1, // SOL threshold below which to airdrop
};

/**
 * Transaction commitment levels
 */
export const COMMITMENT_LEVELS = {
  CONFIRMED: "confirmed",
  FINALIZED: "finalized",
  PROCESSED: "processed",
} as const;

/**
 * Default seller fee basis points (0 = 0%, 100 = 1%, 10000 = 100%)
 */
export const DEFAULT_SELLER_FEE_BASIS_POINTS = 0;

/**
 * File types for NFT assets
 */
export const SUPPORTED_IMAGE_TYPES = {
  PNG: "image/png",
  JPEG: "image/jpeg",
  JPG: "image/jpg",
  GIF: "image/gif",
  WEBP: "image/webp",
} as const;

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const cluster = (process.env.SOLANA_CLUSTER || DEFAULT_CLUSTER) as
    | "devnet"
    | "testnet"
    | "mainnet-beta";

  return {
    cluster,
    rpcEndpoint: process.env.CUSTOM_RPC_ENDPOINT || clusterApiUrl(cluster),
    collectionAddress: process.env.COLLECTION_NFT_ADDRESS,
    nftAddress: process.env.NFT_ADDRESS,
  };
}

/**
 * Asset paths
 */
export const ASSET_PATHS = {
  IMAGES: "assets/images",
  METADATA: "assets/metadata",
  TEMPLATES: "assets/metadata/templates",
} as const;

/**
 * Default image filenames
 */
export const DEFAULT_IMAGES = {
  COLLECTION: "collection.png",
  NFT: "nft.png",
} as const;

