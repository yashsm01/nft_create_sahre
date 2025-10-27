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
  publicKey,
} from "@metaplex-foundation/umi";
import {
  createNft,
  createV1,
  TokenStandard,
  fetchMetadataFromSeeds,
  updateV1,
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
 * Create a Product Master NFT
 * 
 * This represents the master product definition (GTIN) on blockchain
 * All batches and items will reference this master product NFT
 */
export async function createProductMasterNFT(
  umi: Umi,
  productData: {
    gtin: string;
    productName: string;
    company: string;
    category: string;
    model?: string;
    description?: string;
    specifications?: any;
    warrantyMonths?: number;
    imageUrl?: string;
  },
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<{
  productNft: any;
  explorerLink: string;
  metadataUri: string;
}> {
  console.log(`\n🏭 Creating Product Master NFT`);
  console.log(`GTIN: ${productData.gtin}`);
  console.log(`Product: ${productData.productName}`);
  console.log(`Company: ${productData.company}`);

  // Generate product mint
  const productMint = generateSigner(umi);

  // Prepare metadata attributes
  const attributes = [
    {
      trait_type: "GTIN",
      value: productData.gtin,
    },
    {
      trait_type: "Company",
      value: productData.company,
    },
    {
      trait_type: "Category",
      value: productData.category,
    },
  ];

  if (productData.model) {
    attributes.push({
      trait_type: "Model",
      value: productData.model,
    });
  }

  if (productData.warrantyMonths) {
    attributes.push({
      trait_type: "Warranty",
      value: `${productData.warrantyMonths} months`,
    });
  }

  if (productData.specifications) {
    Object.entries(productData.specifications).forEach(([key, value]) => {
      attributes.push({
        trait_type: key,
        value: String(value),
      });
    });
  }

  // Upload product metadata
  console.log(`\n📤 Uploading product master metadata...`);

  // Create short symbol from GTIN (last 8 digits)
  const shortSymbol = `PROD${productData.gtin.slice(-6)}`;

  const productMetadata = {
    name: productData.productName.substring(0, 32), // Max 32 chars for Metaplex
    symbol: shortSymbol.substring(0, 10), // Max 10 chars
    description: productData.description || `Master product definition for ${productData.productName} (GTIN: ${productData.gtin}) by ${productData.company}`,
    image: productData.imageUrl || "",
    attributes,
    properties: {
      category: "product_master",
      gtin: productData.gtin,
      company: productData.company,
      product_category: productData.category,
      model: productData.model || "",
      specifications: productData.specifications || {},
      warranty_months: productData.warrantyMonths || 0,
    },
  };

  const metadataUri = await umi.uploader.uploadJson(productMetadata);
  console.log(`✅ Metadata uploaded: ${metadataUri}`);

  // Create product master NFT
  console.log(`\n🎨 Creating product master NFT...`);

  await createNft(umi, {
    mint: productMint,
    name: productMetadata.name,
    symbol: productMetadata.symbol,
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: false, // Master product is not a collection
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100,
      },
    ],
  }).sendAndConfirm(umi);

  console.log(`✅ Product Master NFT created: ${productMint.publicKey}`);

  const explorerLink = getExplorerLinkForAddress(
    productMint.publicKey,
    cluster
  );

  return {
    productNft: productMint.publicKey,
    explorerLink,
    metadataUri,
  };
}

/**
 * Update Product Master NFT metadata
 * 
 * Updates the Product Master NFT on blockchain with new metadata
 */
export async function updateProductMasterNFT(
  umi: Umi,
  nftMintAddress: string,
  currentMetadataUri: string,
  updateData: {
    name?: string;
    symbol?: string;
    description?: string;
    imageUrl?: string;
    sellerFeeBasisPoints?: number;
    primarySaleHappened?: boolean;
    isMutable?: boolean;
  },
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<{
  success: boolean;
  metadataUri?: string;
  explorerLink: string;
  updatedFields: string[];
}> {
  console.log(`\n🔄 Updating Product Master NFT: ${nftMintAddress}`);

  const mint = publicKey(nftMintAddress);

  // Fetch current NFT metadata from blockchain
  const nftMetadata = await fetchMetadataFromSeeds(umi, { mint });

  // Prepare update fields
  const updatedFields: string[] = [];
  const onChainUpdate: any = {};

  // Update on-chain fields
  if (updateData.name) {
    onChainUpdate.name = updateData.name;
    updatedFields.push('name');
  }

  if (updateData.symbol) {
    onChainUpdate.symbol = updateData.symbol;
    updatedFields.push('symbol');
  }

  if (updateData.sellerFeeBasisPoints !== undefined) {
    onChainUpdate.sellerFeeBasisPoints = updateData.sellerFeeBasisPoints;
    updatedFields.push('sellerFeeBasisPoints');
  }

  // Handle metadata URI update if description or imageUrl changes
  let newMetadataUri = currentMetadataUri;
  if (updateData.description || updateData.imageUrl) {
    console.log(`📤 Fetching current metadata from: ${nftMetadata.uri}`);

    let currentMetadata: any = {};

    try {
      // Try to fetch the current metadata JSON from URI
      const metadataUrl = nftMetadata.uri.replace('arweave.net', 'arweave.net');
      const response = await fetch(metadataUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`⚠️  Failed to fetch metadata (${response.status}), creating new metadata from scratch`);
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          currentMetadata = await response.json();
        } else {
          console.warn(`⚠️  Metadata URL returned non-JSON content, creating new metadata from scratch`);
        }
      }
    } catch (error: any) {
      console.warn(`⚠️  Error fetching current metadata: ${error.message}`);
      console.log(`📝 Creating new metadata from scratch`);
    }

    // Merge with new data (use on-chain data as fallback)
    const newMetadata = {
      name: updateData.name || currentMetadata.name || nftMetadata.name,
      symbol: updateData.symbol || currentMetadata.symbol || nftMetadata.symbol,
      description: updateData.description || currentMetadata.description || '',
      image: updateData.imageUrl || currentMetadata.image || '',
      attributes: currentMetadata.attributes || [],
      properties: currentMetadata.properties || {},
    };

    // Upload new metadata
    console.log(`📤 Uploading updated metadata...`);
    newMetadataUri = await umi.uploader.uploadJson(newMetadata);
    onChainUpdate.uri = newMetadataUri;
    updatedFields.push('uri');

    console.log(`✅ New metadata uploaded: ${newMetadataUri}`);
  }

  // Update NFT on blockchain
  console.log(`🔨 Updating on-chain metadata...`);

  await updateV1(umi, {
    mint,
    authority: umi.identity,
    data: {
      name: onChainUpdate.name || nftMetadata.name,
      symbol: onChainUpdate.symbol || nftMetadata.symbol,
      uri: onChainUpdate.uri || nftMetadata.uri,
      sellerFeeBasisPoints:
        onChainUpdate.sellerFeeBasisPoints !== undefined
          ? onChainUpdate.sellerFeeBasisPoints
          : nftMetadata.sellerFeeBasisPoints,
      creators: nftMetadata.creators,
    },
    primarySaleHappened:
      updateData.primarySaleHappened ?? nftMetadata.primarySaleHappened,
    isMutable:
      updateData.isMutable ?? nftMetadata.isMutable,
  }).sendAndConfirm(umi);

  const explorerLink = getExplorerLinkForAddress(mint, cluster);

  console.log(`✅ Product Master NFT updated successfully!`);
  console.log(`🔗 Explorer: ${explorerLink}`);
  console.log(`📝 Updated fields: ${updatedFields.join(', ')}`);

  return {
    success: true,
    metadataUri: newMetadataUri,
    explorerLink,
    updatedFields,
  };
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
      ...(config.productCollection ? [{
        trait_type: "Product Master NFT",
        value: config.productCollection.toString(),
      }] : []),
    ],
    properties: {
      category: "batch_collection",
      batch_id: config.batchId,
      product_master: config.productCollection?.toString() || null,
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
    ...(config.productCollection && {
      collection: {
        key: config.productCollection,
        verified: false,
      },
    }),
  }).sendAndConfirm(umi);

  console.log(`✅ Batch collection created: ${collectionMint.publicKey}`);

  const explorerLink = getExplorerLinkForAddress(
    collectionMint.publicKey,
    cluster
  );

  return {
    batchCollection: collectionMint.publicKey,
    productCollection: config.productCollection,
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
  const sequenceNumber = config.serialNumber;

  const productMetadata = {
    name: `${sequenceNumber}`,  // Short name: "Product #00001" (max 32 chars)
    symbol: `${'00000'}`,     // Symbol: "PROD00001" (max 10 chars)
    description: `Manufacturing certificate for ${config.productModel} - Serial: ${config.serialNumber}`,
    image: config.imageFile || "",
    attributes,
    properties: {
      category: "product_nft",
      serial_number: config.serialNumber,
      batch_id: config.batchId,
      product_master: config.productCollection.toString(),
      batch_collection: config.batchCollection.toString(),
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
  productCollection: string,
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
          productCollection: createPublicKey(productCollection),
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

