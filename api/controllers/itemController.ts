/**
 * Item Controller
 * Handles individual manufactured items with NFTs
 */

import { Request, Response } from 'express';
import { Item, Batch, Product } from '../models';
import { createProductNFT, verifyProductInBatch } from '../../src/services/product';
import { ProductConfig } from '../../src/types/product';
import { createUmiInstance } from '../../src/utils/umi';
import { loadKeypair } from '../../src/utils/helpers';
import { publicKey } from '@metaplex-foundation/umi';

/**
 * Get all items
 */
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchId, qualityStatus, status, limit = 50, offset = 0 } = req.query;

    const where: any = {};
    if (batchId) where.batchId = batchId;
    if (qualityStatus) where.qualityStatus = qualityStatus;
    if (status) where.status = status;

    const items = await Item.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          association: 'batch',
          include: ['product'],
        },
      ],
    });

    const total = await Item.count({ where });

    res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: total > Number(offset) + Number(limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch items',
      error: error.message,
    });
  }
};

/**
 * Get item by serial number
 */
export const getItemBySerial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serialNumber } = req.params;

    const item = await Item.findOne({
      where: { serialNumber },
      include: [
        {
          association: 'batch',
          include: ['product'],
        },
      ],
    });

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item',
      error: error.message,
    });
  }
};

/**
 * Create single item NFT
 */
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      batchId,
      serialNumber,
      manufacturingOperator,
      qualityInspector,
      qualityNotes,
      additionalAttributes,
    } = req.body;

    // Check if batch exists
    const batch = await Batch.findByPk(batchId, {
      include: ['product'],
    });
    if (!batch) {
      res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
      return;
    }

    const product = await Product.findByPk(batch.productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Ensure product has NFT
    if (!product.nftMintAddress) {
      res.status(400).json({
        success: false,
        message: 'Product does not have NFT. Create product NFT first.',
      });
      return;
    }

    // Check if item already exists
    const existingItem = await Item.findOne({ where: { serialNumber } });
    if (existingItem) {
      res.status(409).json({
        success: false,
        message: 'Item with this serial number already exists',
      });
      return;
    }

    // Create item NFT on blockchain
    console.log('Creating item NFT on blockchain...');

    // Initialize Umi
    const keypair = await loadKeypair();
    const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
    const umi = createUmiInstance(rpcEndpoint, keypair);
    const cluster = (process.env.SOLANA_CLUSTER as "devnet" | "testnet" | "mainnet-beta") || "devnet";

    const itemConfig: ProductConfig = {
      serialNumber,
      productCollection: publicKey(product.nftMintAddress!),
      batchCollection: publicKey(batch.nftCollectionAddress!),
      batchId: `BATCH-${batch.id}`,
      productName: product.productName,
      productModel: product.model || product.productName,
      manufacturingDetails: {
        factoryLocation: batch.manufacturingFacility,
        productionLine: batch.productionLine,
        assemblyDate: new Date().toISOString(),
        assemblyOperator: manufacturingOperator,
      },
      qualityInspection: qualityInspector
        ? {
          inspector: qualityInspector,
          inspectionDate: new Date().toISOString(),
          passed: true,
          grade: 'A' as const,
          defects: [],
          notes: qualityNotes || '',
        }
        : undefined,
      additionalAttributes: [
        ...(additionalAttributes ? Object.entries(additionalAttributes).map(([key, value]) => ({
          trait_type: key,
          value: String(value)
        })) : []),
        { trait_type: 'GTIN', value: product.gtin },
        { trait_type: 'Company', value: product.company },
        { trait_type: 'Category', value: product.category },
        ...(product.warrantyMonths ? [{
          trait_type: 'Warranty',
          value: `${product.warrantyMonths} months`
        }] : [])
      ],
    };

    const nftResult = await createProductNFT(umi, itemConfig, cluster);

    // Save item to database
    const item = await Item.create({
      serialNumber,
      batchId,
      manufacturingDate: new Date(),
      manufacturingOperator,
      qualityStatus: qualityInspector ? 'PASSED' : 'PENDING',
      qualityInspector,
      qualityInspectionDate: qualityInspector ? new Date() : undefined,
      qualityNotes,
      nftMintAddress: nftResult.productNft.toString(),
      nftExplorerLink: nftResult.explorerLink,
      nftMetadataUri: nftResult.metadataUri,
      status: 'MANUFACTURED',
      additionalAttributes,
      metadata: { serialNumber: nftResult.serialNumber, batchId: nftResult.batchId },
    });

    // Update batch produced quantity
    await batch.increment('producedQuantity', { by: 1 });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: {
        item,
        batch,
        product,
        blockchain: {
          mintAddress: nftResult.productNft.toString(),
          explorerLink: nftResult.explorerLink,
          metadataUri: nftResult.metadataUri,
        },
      },
    });
  } catch (error: any) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create item',
      error: error.message,
    });
  }
};

/**
 * Update item
 */
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serialNumber } = req.params;
    const updates = req.body;

    const item = await Item.findOne({ where: { serialNumber } });

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    await item.update(updates);

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item,
    });
  } catch (error: any) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: error.message,
    });
  }
};

/**
 * Update quality inspection
 */
export const updateQualityInspection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serialNumber } = req.params;
    const { qualityStatus, qualityInspector, qualityNotes } = req.body;

    const item = await Item.findOne({ where: { serialNumber } });

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    await item.update({
      qualityStatus,
      qualityInspector,
      qualityInspectionDate: new Date(),
      qualityNotes,
    });

    res.status(200).json({
      success: true,
      message: 'Quality inspection updated successfully',
      data: item,
    });
  } catch (error: any) {
    console.error('Error updating quality inspection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quality inspection',
      error: error.message,
    });
  }
};

/**
 * Verify item on blockchain
 */
export const verifyItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serialNumber } = req.params;

    const item = await Item.findOne({
      where: { serialNumber },
      include: [
        {
          association: 'batch',
          include: ['product'],
        },
      ],
    });

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    if (!item.nftMintAddress) {
      res.status(400).json({
        success: false,
        message: 'Item does not have an NFT address',
      });
      return;
    }

    // Verify on blockchain
    const batch = await Batch.findByPk(item.batchId);
    if (!batch || !batch.nftCollectionAddress) {
      res.status(400).json({
        success: false,
        message: 'Batch does not have an NFT collection address',
      });
      return;
    }

    // Initialize Umi
    const keypair = await loadKeypair();
    const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
    const umi = createUmiInstance(rpcEndpoint, keypair);
    const cluster = (process.env.SOLANA_CLUSTER as "devnet" | "testnet" | "mainnet-beta") || "devnet";

    const verificationResult = await verifyProductInBatch(
      umi,
      item.nftMintAddress,
      batch.nftCollectionAddress,
      cluster
    );

    res.status(200).json({
      success: true,
      message: 'Item verified successfully',
      data: {
        item,
        verification: verificationResult,
      },
    });
  } catch (error: any) {
    console.error('Error verifying item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify item',
      error: error.message,
    });
  }
};

/**
 * Delete item
 */
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serialNumber } = req.params;

    const item = await Item.findOne({ where: { serialNumber } });

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    // Update batch count
    const batch = await Batch.findByPk(item.batchId);
    if (batch) {
      await batch.decrement('producedQuantity', { by: 1 });
    }

    await item.destroy();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message,
    });
  }
};

