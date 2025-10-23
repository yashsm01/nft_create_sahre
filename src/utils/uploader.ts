/**
 * File and metadata upload utilities
 */

import { Umi, GenericFile, createGenericFile } from "@metaplex-foundation/umi";
import { NFTMetadata } from "../types/index.js";
import { promises as fs } from "fs";
import * as path from "path";
import { SUPPORTED_IMAGE_TYPES } from "../config/constants.js";

/**
 * Upload an image file to Irys
 * @param umi - The Umi instance
 * @param filePath - Path to the image file
 * @returns URI of the uploaded image
 */
export async function uploadImage(
  umi: Umi,
  filePath: string
): Promise<string> {
  // Resolve the full path
  const fullPath = path.resolve(filePath);

  // Read the file into a buffer
  const buffer = await fs.readFile(fullPath);

  // Determine content type based on file extension
  const ext = path.extname(filePath).toLowerCase();
  let contentType = SUPPORTED_IMAGE_TYPES.PNG;

  if (ext === ".jpg" || ext === ".jpeg") {
    contentType = SUPPORTED_IMAGE_TYPES.JPEG;
  } else if (ext === ".gif") {
    contentType = SUPPORTED_IMAGE_TYPES.GIF;
  } else if (ext === ".webp") {
    contentType = SUPPORTED_IMAGE_TYPES.WEBP;
  }

  // Create a generic file
  const file: GenericFile = createGenericFile(buffer, filePath, {
    contentType,
  });

  // Upload to Irys and return the URI
  const [imageUri] = await umi.uploader.upload([file]);

  console.log(`📤 Image uploaded: ${imageUri}`);

  return imageUri;
}

/**
 * Upload JSON metadata to Irys
 * @param umi - The Umi instance
 * @param metadata - The metadata object to upload
 * @returns URI of the uploaded metadata
 */
export async function uploadMetadata(
  umi: Umi,
  metadata: NFTMetadata
): Promise<string> {
  const metadataUri = await umi.uploader.uploadJson(metadata);

  console.log(`📤 Metadata uploaded: ${metadataUri}`);

  return metadataUri;
}

/**
 * Upload image and metadata together
 * @param umi - The Umi instance
 * @param imageFilePath - Path to the image file
 * @param metadata - Base metadata (without image URI)
 * @returns Object containing image URI and metadata URI
 */
export async function uploadImageAndMetadata(
  umi: Umi,
  imageFilePath: string,
  metadata: Omit<NFTMetadata, "image">
): Promise<{ imageUri: string; metadataUri: string }> {
  // Upload image first
  const imageUri = await uploadImage(umi, imageFilePath);

  // Add image URI to metadata and upload
  const fullMetadata: NFTMetadata = {
    ...metadata,
    image: imageUri,
  };

  const metadataUri = await uploadMetadata(umi, fullMetadata);

  return { imageUri, metadataUri };
}

