/**
 * Type definitions for Product Tracking & Traceability System
 * 
 * This system uses NFTs to track individual manufactured products
 * with unique serial numbers, batch information, and complete metadata.
 */

import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";

/**
 * Product serial number configuration
 */
export interface ProductSerialConfig {
  prefix: string;              // e.g., "PROD"
  year: number;                // e.g., 2025
  batchId: string;             // e.g., "BATCH001"
  sequenceNumber: number;      // e.g., 1, 2, 3...
}

/**
 * Quality inspection result
 */
export interface QualityInspection {
  passed: boolean;
  grade: "A" | "B" | "C" | "FAIL";
  inspector: string;
  inspectionDate: string;
  defects: string[];
  notes?: string;
}

/**
 * Manufacturing details
 */
export interface ManufacturingDetails {
  factoryLocation: string;
  productionLine: string;
  assemblyDate: string;
  assemblyTime?: string;
  assemblyOperator?: string;
  materials?: string[];
  weight?: string;
  dimensions?: string;
}

/**
 * Batch configuration for creating a batch collection
 */
export interface BatchConfig {
  batchId: string;                 // Unique batch identifier
  productCollection?: UmiPublicKey; // Product Master NFT address (optional)
  productLine: string;              // Product line name
  productModel: string;             // Product model/type
  totalUnits: number;               // Expected units in batch
  manufacturingDate: string;        // Batch start date
  factoryLocation: string;          // Where manufactured
  description?: string;             // Batch description
  imageFile?: string;               // Batch image path (optional)
}

/**
 * Product configuration for creating individual product NFT
 */
export interface ProductConfig {
  serialNumber: string;             // Generated unique serial
  productCollection: UmiPublicKey;  // Product Master NFT address
  batchCollection: UmiPublicKey;    // Batch collection it belongs to
  batchId: string;                  // Batch identifier (for metadata)
  productName: string;              // Product name
  productModel: string;             // Product model
  manufacturingDetails: ManufacturingDetails;
  qualityInspection?: QualityInspection;
  imageFile?: string;               // Product image path (optional)
  additionalAttributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Result of batch creation
 */
export interface BatchCreationResult {
  batchCollection: UmiPublicKey;
  productCollection?: UmiPublicKey;
  batchId: string;
  explorerLink: string;
  metadataUri: string;
}

/**
 * Result of product NFT creation
 */
export interface ProductCreationResult {
  productNft: UmiPublicKey;
  serialNumber: string;
  batchId: string;
  explorerLink: string;
  metadataUri: string;
}

/**
 * Product verification result
 */
export interface ProductVerificationResult {
  isVerified: boolean;
  serialNumber: string;
  batchId: string;
  productNft: UmiPublicKey;
  batchCollection: UmiPublicKey;
  explorerLink: string;
}

/**
 * Product transfer record
 */
export interface ProductTransfer {
  productNft: UmiPublicKey;
  serialNumber: string;
  fromOwner: string;
  toOwner: string;
  transferDate: string;
  transferType: "MANUFACTURING" | "SHIPPING" | "SALE" | "RESALE" | "WARRANTY";
  signature: string;
}

/**
 * Bulk product creation configuration
 */
export interface BulkProductConfig {
  batchCollection: UmiPublicKey;
  batchId: string;
  productModel: string;
  startSequence: number;           // Starting sequence number
  count: number;                   // How many products to create
  manufacturingDetails: ManufacturingDetails;
  baseImageFile?: string;          // Base image for all products
}

/**
 * Product query filters
 */
export interface ProductQueryFilter {
  batchId?: string;
  factoryLocation?: string;
  dateFrom?: string;
  dateTo?: string;
  qualityGrade?: string;
  owner?: string;
}

/**
 * Product statistics
 */
export interface ProductStatistics {
  totalProducts: number;
  totalBatches: number;
  productsByBatch: Map<string, number>;
  productsByQuality: Map<string, number>;
  productsByFactory: Map<string, number>;
}

