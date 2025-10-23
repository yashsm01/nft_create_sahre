/**
 * Metadata preparation and validation service
 */

import { NFTMetadata, NFTConfig, CollectionConfig } from "../types/index.js";
import * as path from "path";
import { ASSET_PATHS } from "../config/constants.js";

/**
 * Prepare NFT metadata object
 * @param config - NFT configuration
 * @param imageUri - URI of the uploaded image
 * @returns Complete NFT metadata object
 */
export function prepareNFTMetadata(
  config: NFTConfig,
  imageUri: string
): NFTMetadata {
  return {
    name: config.name,
    symbol: config.symbol,
    description: config.description,
    image: imageUri,
    sellerFeeBasisPoints: config.sellerFeeBasisPoints,
    attributes: config.attributes || [],
    properties: {
      files: [
        {
          uri: imageUri,
          type: getFileType(config.imageFile),
        },
      ],
      category: "image",
    },
  };
}

/**
 * Prepare collection metadata object
 * @param config - Collection configuration
 * @param imageUri - URI of the uploaded image
 * @returns Complete collection metadata object
 */
export function prepareCollectionMetadata(
  config: CollectionConfig,
  imageUri: string
): NFTMetadata {
  return {
    name: config.name,
    symbol: config.symbol,
    description: config.description,
    image: imageUri,
    sellerFeeBasisPoints: config.sellerFeeBasisPoints,
    properties: {
      files: [
        {
          uri: imageUri,
          type: getFileType(config.imageFile),
        },
      ],
      category: "image",
    },
  };
}

/**
 * Get MIME type from file path
 * @param filePath - Path to the file
 * @returns MIME type string
 */
function getFileType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "image/png";
  }
}

/**
 * Validate NFT configuration
 * @param config - NFT configuration to validate
 * @throws Error if validation fails
 */
export function validateNFTConfig(config: NFTConfig): void {
  if (!config.name || config.name.trim() === "") {
    throw new Error("NFT name is required");
  }

  if (!config.symbol || config.symbol.trim() === "") {
    throw new Error("NFT symbol is required");
  }

  if (!config.description || config.description.trim() === "") {
    throw new Error("NFT description is required");
  }

  if (!config.imageFile || config.imageFile.trim() === "") {
    throw new Error("Image file path is required");
  }

  if (
    config.sellerFeeBasisPoints < 0 ||
    config.sellerFeeBasisPoints > 10000
  ) {
    throw new Error("Seller fee basis points must be between 0 and 10000");
  }
}

/**
 * Validate collection configuration
 * @param config - Collection configuration to validate
 * @throws Error if validation fails
 */
export function validateCollectionConfig(config: CollectionConfig): void {
  if (!config.name || config.name.trim() === "") {
    throw new Error("Collection name is required");
  }

  if (!config.symbol || config.symbol.trim() === "") {
    throw new Error("Collection symbol is required");
  }

  if (!config.description || config.description.trim() === "") {
    throw new Error("Collection description is required");
  }

  if (!config.imageFile || config.imageFile.trim() === "") {
    throw new Error("Image file path is required");
  }

  if (
    config.sellerFeeBasisPoints < 0 ||
    config.sellerFeeBasisPoints > 10000
  ) {
    throw new Error("Seller fee basis points must be between 0 and 10000");
  }
}

/**
 * Resolve asset path
 * @param filename - The filename
 * @returns Full path to the asset
 */
export function resolveAssetPath(filename: string): string {
  return path.resolve(ASSET_PATHS.IMAGES, filename);
}

