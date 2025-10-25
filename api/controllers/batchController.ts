/**
 * Batch Controller
 * Handles manufacturing batch management (belongs to Product)
 */

import { Request, Response } from 'express';
import { Batch, Product, Item } from '../models';
import { createBatchCollection } from '../../src/services/product';
import { BatchConfig } from '../../src/types/product';
import { createUmiInstance } from '../../src/utils/umi';
import { loadKeypair } from '../../src/utils/helpers';

/**
 * Get all batches
 */
export const getAllBatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, status, limit = 50, offset = 0 } = req.query;

    const where: any = {};
    if (productId) where.productId = productId;
    if (status) where.status = status;

    const batches = await Batch.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
      include: ['product'], // Include product details
    });

    const total = await Batch.count({ where });

    res.status(200).json({
      success: true,
      data: {
        batches,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: total > Number(offset) + Number(limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching batches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batches',
      error: error.message,
    });
  }
};

/**
 * Get batch by ID
 */
export const getBatchById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const batch = await Batch.findByPk(id, {
      include: ['product', 'items'], // Include product and items
    });

    if (!batch) {
      res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error: any) {
    console.error('Error fetching batch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batch',
      error: error.message,
    });
  }
};

/**
 * Create new batch for a product
 */
export const createBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      productId,
      batchName,
      manufacturingFacility,
      productionLine,
      startDate,
      plannedQuantity,
      imageFile,
    } = req.body;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Ensure product has GTIN
    if (!product.gtin) {
      res.status(400).json({
        success: false,
        message: 'Product does not have a GTIN code. Please update the product first.',
      });
      return;
    }

    // Check if batch name already exists for this product
    const existingBatch = await Batch.findOne({
      where: { productId, batchName },
    });
    if (existingBatch) {
      res.status(409).json({
        success: false,
        message: 'Batch with this name already exists for this product',
      });
      return;
    }

    // Create NFT collection on blockchain
    console.log('Creating NFT collection on blockchain...');

    // Initialize Umi
    const keypair = await loadKeypair();
    const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
    const umi = createUmiInstance(rpcEndpoint, keypair);
    const cluster = (process.env.SOLANA_CLUSTER as "devnet" | "testnet" | "mainnet-beta") || "devnet";

    // Shorten names to fit Metaplex limits (32 chars for name, 10 for symbol)
    const shortBatchName = batchName.length > 15 ? batchName.substring(0, 15) : batchName;
    const shortProductName = product.productName.length > 15 ? product.productName.substring(0, 12) + '...' : product.productName;

    const batchConfig: BatchConfig = {
      batchId: shortBatchName, // Use shorter ID
      productLine: shortProductName,
      productModel: product.model || product.productName,
      totalUnits: plannedQuantity,
      manufacturingDate: new Date(startDate).toISOString(),
      factoryLocation: manufacturingFacility,
      description: `Manufacturing batch ${batchName} for ${product.productName} (GTIN: ${product.gtin}) at ${productionLine}. Full ID: ${product.gtin}-${batchName}`,
      imageFile: imageFile || product.imageUrl,
    };

    const nftResult = await createBatchCollection(umi, batchConfig, cluster);

    // Save batch to database
    const batch = await Batch.create({
      batchName,
      productId,
      manufacturingFacility,
      productionLine,
      startDate: new Date(startDate),
      plannedQuantity,
      producedQuantity: 0,
      status: 'IN_PROGRESS',
      nftCollectionAddress: nftResult.batchCollection.toString(),
      nftCollectionExplorerLink: nftResult.explorerLink,
      metadata: { metadataUri: nftResult.metadataUri },
    });

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: {
        batch,
        product,
        blockchain: {
          collectionAddress: nftResult.batchCollection.toString(),
          explorerLink: nftResult.explorerLink,
          metadataUri: nftResult.metadataUri,
        },
      },
    });
  } catch (error: any) {
    console.error('Error creating batch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create batch',
      error: error.message,
    });
  }
};

/**
 * Update batch (can top up produced quantity)
 */
export const updateBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const batch = await Batch.findByPk(id);

    if (!batch) {
      res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
      return;
    }

    // If topping up produced quantity
    if (updates.topUpQuantity) {
      const topUp = Number(updates.topUpQuantity);
      batch.producedQuantity += topUp;
      delete updates.topUpQuantity;

      console.log(`✅ Topped up batch ${batch.batchName} by ${topUp} items. New total: ${batch.producedQuantity}`);
    }

    // Update batch
    await batch.update(updates);

    res.status(200).json({
      success: true,
      message: 'Batch updated successfully',
      data: batch,
    });
  } catch (error: any) {
    console.error('Error updating batch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update batch',
      error: error.message,
    });
  }
};

/**
 * Delete batch
 */
export const deleteBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const batch = await Batch.findByPk(id);

    if (!batch) {
      res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
      return;
    }

    // Check if batch has items
    const itemCount = await Item.count({ where: { batchId: batch.id } });
    if (itemCount > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete batch with existing items',
        data: { itemCount },
      });
      return;
    }

    await batch.destroy();

    res.status(200).json({
      success: true,
      message: 'Batch deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting batch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete batch',
      error: error.message,
    });
  }
};

/**
 * Get batch statistics
 */
export const getBatchStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const batch = await Batch.findByPk(id, {
      include: ['product', 'items'],
    });

    if (!batch) {
      res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
      return;
    }

    const items = await Item.findAll({ where: { batchId: batch.id } });
    const qualityStats = {
      passed: items.filter((item: any) => item.qualityStatus === 'PASSED').length,
      failed: items.filter((item: any) => item.qualityStatus === 'FAILED').length,
      pending: items.filter((item: any) => item.qualityStatus === 'PENDING').length,
      rework: items.filter((item: any) => item.qualityStatus === 'REWORK').length,
    };

    res.status(200).json({
      success: true,
      data: {
        batchId: batch.id,
        batchName: batch.batchName,
        plannedQuantity: batch.plannedQuantity,
        producedQuantity: batch.producedQuantity,
        completionRate: ((batch.producedQuantity / batch.plannedQuantity) * 100).toFixed(2) + '%',
        qualityStats,
        status: batch.status,
      },
    });
  } catch (error: any) {
    console.error('Error fetching batch stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batch statistics',
      error: error.message,
    });
  }
};
