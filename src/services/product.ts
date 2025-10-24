/**
 * Product Tracking & Traceability Service
 * 
 * This service handles creation and management of product NFTs using Metaplex.
 * Each product gets a unique NFT with complete traceability information.
 */

import {
  Umi,
  generateSigner,
  percentAmount,
  publicKey as createPublicKey,
} from "@metaplex-foundation/umi";
import {
  createNft,
  createV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import fs from "fs";
import {
  BatchConfig,
  BatchCreationResult,
  ProductConfig,
  ProductCreationResult,
  ProductSerialConfig,
  ProductVerificationResult,
} from "../types/product.js";
import { getExplorerLinkForAddress } from "../utils/helpers.js";

/**
 * Generate unique serial number for product
 */
export function generateSerialNumber(config: ProductSerialConfig): string {
  const { prefix, year, batchId, sequenceNumber } = config;
  const paddedSequence = sequenceNumber.toString().padStart(5, "0");
  return `${prefix}-${year}-${batchId}-${paddedSequence}`;
}

/**
 * Create a batch collection NFT
 * 
 * This represents a manufacturing batch that will contain multiple product NFTs
 */
export async function createBatchCollection(
  umi: Umi,
  config: BatchConfig,
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<BatchCreationResult> {
  console.log(`\n🏭 Creating Batch Collection: ${config.batchId}`);
  console.log(`Product Line: ${config.productLine}`);
  console.log(`Product Model: ${config.productModel}`);
  console.log(`Expected Units: ${config.totalUnits}`);

  // Generate collection mint
  const collectionMint = generateSigner(umi);

  // Upload collection metadata
  console.log(`\n📤 Uploading batch metadata...`);
  
  const collectionMetadata = {
    name: `${config.productLine} - ${config.batchId}`,
    symbol: config.batchId.replace(/-/g, "").substring(0, 10).toUpperCase(),
    description: config.description || `Manufacturing batch ${config.batchId} for ${config.productModel}`,
    image: config.imageFile || "",
    attributes: [
      {
        trait_type: "Batch ID",
        value: config.batchId,
      },
      {
        trait_type: "Product Line",
        value: config.productLine,
      },
      {
        trait_type: "Product Model",
        value: config.productModel,
      },
      {
        trait_type: "Total Units",
        value: config.totalUnits,
      },
      {
        trait_type: "Manufacturing Date",
        value: config.manufacturingDate,
      },
      {
        trait_type: "Factory Location",
        value: config.factoryLocation,
      },
    ],
    properties: {
      category: "batch_collection",
      batch_id: config.batchId,
      product_line: config.productLine,
      product_model: config.productModel,
      total_units: config.totalUnits,
      factory: config.factoryLocation,
    },
  };

  const metadataUri = await umi.uploader.uploadJson(collectionMetadata);
  console.log(`✅ Metadata uploaded: ${metadataUri}`);

  // Create collection NFT
  console.log(`\n🎨 Creating collection NFT...`);
  
  await createNft(umi, {
    mint: collectionMint,
    name: collectionMetadata.name,
    symbol: collectionMetadata.symbol,
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100,
      },
    ],
  }).sendAndConfirm(umi);

  console.log(`✅ Batch collection created: ${collectionMint.publicKey}`);

  const explorerLink = getExplorerLinkForAddress(
    collectionMint.publicKey,
    cluster
  );

  return {
    batchCollection: collectionMint.publicKey,
    batchId: config.batchId,
    explorerLink,
    metadataUri,
  };
}

/**
 * Create individual product NFT
 * 
 * Each product gets a unique NFT with its serial number and complete metadata
 */
export async function createProductNFT(
  umi: Umi,
  config: ProductConfig,
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<ProductCreationResult> {
  console.log(`\n🏭 Creating Product NFT`);
  console.log(`Serial Number: ${config.serialNumber}`);
  console.log(`Batch: ${config.batchId}`);
  console.log(`Model: ${config.productModel}`);

  // Generate product mint
  const productMint = generateSigner(umi);

  // Prepare metadata attributes
  const attributes = [
    {
      trait_type: "Serial Number",
      value: config.serialNumber,
    },
    {
      trait_type: "Batch ID",
      value: config.batchId,
    },
    {
      trait_type: "Product Model",
      value: config.productModel,
    },
    {
      trait_type: "Manufacturing Date",
      value: config.manufacturingDetails.assemblyDate,
    },
    {
      trait_type: "Factory Location",
      value: config.manufacturingDetails.factoryLocation,
    },
    {
      trait_type: "Production Line",
      value: config.manufacturingDetails.productionLine,
    },
  ];

  // Add assembly operator if provided
  if (config.manufacturingDetails.assemblyOperator) {
    attributes.push({
      trait_type: "Assembly Operator",
      value: config.manufacturingDetails.assemblyOperator,
    });
  }

  // Add quality inspection if provided
  if (config.qualityInspection) {
    attributes.push({
      trait_type: "Quality Grade",
      value: config.qualityInspection.grade,
    });
    attributes.push({
      trait_type: "Inspection Status",
      value: config.qualityInspection.passed ? "PASSED" : "FAILED",
    });
    attributes.push({
      trait_type: "Inspector",
      value: config.qualityInspection.inspector,
    });
  }

  // Add weight if provided
  if (config.manufacturingDetails.weight) {
    attributes.push({
      trait_type: "Weight",
      value: config.manufacturingDetails.weight,
    });
  }

  // Add dimensions if provided
  if (config.manufacturingDetails.dimensions) {
    attributes.push({
      trait_type: "Dimensions",
      value: config.manufacturingDetails.dimensions,
    });
  }

  // Add any additional attributes
  if (config.additionalAttributes) {
    // Convert to string to ensure type compatibility
    const stringAttributes = config.additionalAttributes.map(attr => ({
      trait_type: attr.trait_type,
      value: String(attr.value),
    }));
    attributes.push(...stringAttributes);
  }

  // Upload product metadata
  console.log(`\n📤 Uploading product metadata...`);
  
  // Extract just the sequence number from serial (last 5 digits)
  const sequenceNumber = config.serialNumber.split('-').pop() || '00000';
  
  const productMetadata = {
    name: `Product #${sequenceNumber}`,  // Short name: "Product #00001" (max 32 chars)
    symbol: `PROD${sequenceNumber}`,     // Symbol: "PROD00001" (max 10 chars)
    description: `Manufacturing certificate for ${config.productModel} - Serial: ${config.serialNumber}`,
    image: config.imageFile || "",
    attributes,
    properties: {
      category: "product_nft",
      serial_number: config.serialNumber,
      batch_id: config.batchId,
      product_model: config.productModel,
      manufacturing_details: config.manufacturingDetails,
      quality_inspection: config.qualityInspection || null,
      materials: config.manufacturingDetails.materials || [],
    },
  };

  const metadataUri = await umi.uploader.uploadJson(productMetadata);
  console.log(`✅ Metadata uploaded: ${metadataUri}`);

  // Create product NFT
  console.log(`\n🎨 Creating product NFT...`);
  
  await createNft(umi, {
    mint: productMint,
    name: productMetadata.name,
    symbol: productMetadata.symbol,
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(0),
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100,
      },
    ],
    collection: {
      key: config.batchCollection,
      verified: false, // Will be verified separately
    },
  }).sendAndConfirm(umi);

  console.log(`✅ Product NFT created: ${productMint.publicKey}`);

  const explorerLink = getExplorerLinkForAddress(
    productMint.publicKey,
    cluster
  );

  return {
    productNft: productMint.publicKey,
    serialNumber: config.serialNumber,
    batchId: config.batchId,
    explorerLink,
    metadataUri,
  };
}

/**
 * Verify product in batch collection
 */
export async function verifyProductInBatch(
  umi: Umi,
  productNft: string,
  batchCollection: string,
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<ProductVerificationResult> {
  console.log(`\n✅ Verifying product in batch collection...`);
  console.log(`Product NFT: ${productNft}`);
  console.log(`Batch Collection: ${batchCollection}`);

  // Import verification function
  const { verifyCollectionV1, findMetadataPda } = await import("@metaplex-foundation/mpl-token-metadata");

  // Get metadata PDA for the product NFT
  const productNftPublicKey = createPublicKey(productNft);
  const metadataPda = findMetadataPda(umi, { mint: productNftPublicKey });

  // Verify the product in collection
  await verifyCollectionV1(umi, {
    metadata: metadataPda,
    collectionMint: createPublicKey(batchCollection),
    authority: umi.identity,
  }).sendAndConfirm(umi);

  console.log(`✅ Product verified in batch collection!`);

  const explorerLink = getExplorerLinkForAddress(
    productNftPublicKey,
    cluster
  );

  return {
    isVerified: true,
    serialNumber: "", // Would need to fetch from metadata
    batchId: "", // Would need to fetch from metadata
    productNft: createPublicKey(productNft),
    batchCollection: createPublicKey(batchCollection),
    explorerLink,
  };
}

/**
 * Batch create multiple products
 */
export async function createProductsBatch(
  umi: Umi,
  batchCollection: string,
  batchId: string,
  productModel: string,
  productName: string,
  startSequence: number,
  count: number,
  manufacturingDetails: any,
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<ProductCreationResult[]> {
  console.log(`\n🏭 Batch creating ${count} products...`);
  
  const results: ProductCreationResult[] = [];
  const year = new Date().getFullYear();

  for (let i = 0; i < count; i++) {
    const sequenceNumber = startSequence + i;
    const serialNumber = generateSerialNumber({
      prefix: "PROD",
      year,
      batchId,
      sequenceNumber,
    });

    console.log(`\n[${i + 1}/${count}] Creating product ${serialNumber}...`);

    try {
      const result = await createProductNFT(
        umi,
        {
          serialNumber,
          batchCollection: createPublicKey(batchCollection),
          batchId,
          productName,
          productModel,
          manufacturingDetails,
        },
        cluster
      );

      results.push(result);
      console.log(`✅ Created ${i + 1}/${count}`);
    } catch (error) {
      console.error(`❌ Failed to create product ${serialNumber}:`, error);
    }
  }

  console.log(`\n✅ Batch creation complete! Created ${results.length}/${count} products`);
  
  return results;
}

