/**
 * Type definitions for the Solana NFT Metaplex project
 */

import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";

/**
 * NFT metadata structure following Metaplex standard
 */
export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  sellerFeeBasisPoints?: number;
  attributes?: NFTAttribute[];
  properties?: {
    files?: Array<{
      uri: string;
      type: string;
    }>;
    category?: string;
    creators?: Array<{
      address: string;
      share: number;
    }>;
  };
}

/**
 * NFT attribute for traits
 */
export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

/**
 * Configuration for creating an NFT
 */
export interface NFTConfig {
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints: number;
  imageFile: string;
  attributes?: NFTAttribute[];
}

/**
 * Configuration for creating a collection
 */
export interface CollectionConfig {
  name: string;
  symbol: string;
  description: string;
  imageFile: string;
  sellerFeeBasisPoints: number;
}

/**
 * Result of NFT creation
 */
export interface NFTCreationResult {
  mintAddress: UmiPublicKey;
  metadataUri: string;
  imageUri: string;
  explorerLink: string;
  signature?: string;
}

/**
 * Result of collection creation
 */
export interface CollectionCreationResult {
  collectionAddress: UmiPublicKey;
  metadataUri: string;
  imageUri: string;
  explorerLink: string;
}

/**
 * Update NFT data
 */
export interface NFTUpdateData {
  name?: string;
  symbol?: string;
  uri?: string;
  sellerFeeBasisPoints?: number;
  primarySaleHappened?: boolean;
  isMutable?: boolean;
}

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  cluster: "devnet" | "testnet" | "mainnet-beta";
  rpcEndpoint?: string;
  collectionAddress?: string;
  nftAddress?: string;
}

