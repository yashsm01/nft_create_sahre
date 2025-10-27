/**
 * Product Controller
 * Handles master product definitions (GTIN-based)
 */

import { Request, Response } from 'express';
import { Product, Batch } from '../models';
import { createProductMasterNFT, updateProductMasterNFT } from '../../src/services/product';
import { createUmiInstance } from '../../src/utils/umi';
import { loadKeypair } from '../../src/utils/helpers';

/**
 * Get all products
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { company, category, isActive, limit = 50, offset = 0 } = req.query;

    const where: any = {};
    if (company) where.company = company;
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const products = await Product.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
    });

    const total = await Product.count({ where });

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: total > Number(offset) + Number(limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: ['batches'], // Include associated batches
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

/**
 * Create new product with NFT
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      gtin,
      productName,
      company,
      category,
      description,
      model,
      specifications,
      warrantyMonths,
      imageUrl,
      createNFT = true, // Default: automatically create NFT
    } = req.body;

    // Check if GTIN already exists (if provided)
    if (gtin) {
      const existingProduct = await Product.findOne({ where: { gtin } });
      if (existingProduct) {
        res.status(409).json({
          success: false,
          message: 'Product with this GTIN already exists',
          data: { existingProduct },
        });
        return;
      }
    }

    // Create product (UUID is auto-generated)
    const product = await Product.create({
      gtin,
      productName,
      company,
      category,
      description,
      model,
      specifications,
      warrantyMonths,
      imageUrl,
      isActive: true,
    });

    let nftResult: { productNft: any; explorerLink: string; metadataUri: string; } | null = null;

    // Automatically create NFT if requested
    if (createNFT) {
      try {
        console.log('Creating Product Master NFT on blockchain...');

        // Initialize Umi
        const keypair = await loadKeypair();
        const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
        const umi = createUmiInstance(rpcEndpoint, keypair);
        const cluster = (process.env.SOLANA_CLUSTER as "devnet" | "testnet" | "mainnet-beta") || "devnet";

        // Create Product Master NFT
        nftResult = await createProductMasterNFT(
          umi,
          {
            gtin: product.gtin || product.id, // Use UUID if no GTIN
            productName: product.productName,
            company: product.company,
            category: product.category,
            model: product.model || undefined,
            description: product.description || undefined,
            specifications: product.specifications || undefined,
            warrantyMonths: product.warrantyMonths || undefined,
            imageUrl: product.imageUrl || undefined,
          },
          cluster
        );

        // Update product with NFT information
        if (nftResult) {
          await product.update({
            nftMintAddress: nftResult.productNft.toString(),
            nftMetadataUri: nftResult.metadataUri,
            nftExplorerLink: nftResult.explorerLink,
          });
        }

        console.log('✅ Product Master NFT created successfully');
      } catch (nftError: any) {
        console.error('⚠️  Failed to create NFT (product saved):', nftError.message);
        // Product is still created, just without NFT
      }
    }

    res.status(201).json({
      success: true,
      message: nftResult ? 'Product and NFT created successfully' : 'Product created successfully',
      data: {
        product,
        blockchain: nftResult ? {
          nftMintAddress: nftResult?.productNft?.toString() || null,
          explorerLink: nftResult?.explorerLink || null,
          metadataUri: nftResult?.metadataUri || null,
        } : null,
      },
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

/**
 * Update product (database + blockchain NFT)
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      // Database fields
      gtin,
      productName,
      company,
      category,
      description,
      model,
      specifications,
      warrantyMonths,
      imageUrl,
      isActive,
      // NFT-specific fields
      nftName,
      nftSymbol,
      sellerFeeBasisPoints,
      primarySaleHappened,
      isMutable,
    } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Prepare database updates
    const dbUpdates: any = {};
    if (gtin !== undefined) dbUpdates.gtin = gtin;
    if (productName !== undefined) dbUpdates.productName = productName;
    if (company !== undefined) dbUpdates.company = company;
    if (category !== undefined) dbUpdates.category = category;
    if (description !== undefined) dbUpdates.description = description;
    if (model !== undefined) dbUpdates.model = model;
    if (specifications !== undefined) dbUpdates.specifications = specifications;
    if (warrantyMonths !== undefined) dbUpdates.warrantyMonths = warrantyMonths;
    if (imageUrl !== undefined) dbUpdates.imageUrl = imageUrl;
    if (isActive !== undefined) dbUpdates.isActive = isActive;

    // Update database
    await product.update(dbUpdates);

    let nftUpdateResult: { success: boolean; metadataUri?: string; explorerLink: string; updatedFields: string[]; } | null = null;

    // If product has NFT and NFT fields are provided, update blockchain
    if (product.nftMintAddress && (nftName || nftSymbol || description || imageUrl || sellerFeeBasisPoints !== undefined || primarySaleHappened !== undefined || isMutable !== undefined)) {
      try {
        console.log(`\n🔄 Updating Product NFT on blockchain...`);
        console.log(`Product: ${product.productName}`);
        console.log(`NFT Address: ${product.nftMintAddress}`);

        // Initialize Umi
        const keypair = await loadKeypair();
        const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
        const umi = createUmiInstance(rpcEndpoint, keypair);
        const cluster = (process.env.SOLANA_CLUSTER as "devnet" | "testnet" | "mainnet-beta") || "devnet";

        // Call service function to update NFT
        nftUpdateResult = await updateProductMasterNFT(
          umi,
          product.nftMintAddress,
          product.nftMetadataUri || '',
          {
            name: nftName,
            symbol: nftSymbol,
            description,
            imageUrl,
            sellerFeeBasisPoints,
            primarySaleHappened,
            isMutable,
          },
          cluster
        );

        // Update product record if metadata URI changed
        if (nftUpdateResult && nftUpdateResult.metadataUri && nftUpdateResult.metadataUri !== product.nftMetadataUri) {
          await product.update({
            nftMetadataUri: nftUpdateResult.metadataUri,
            nftExplorerLink: nftUpdateResult.explorerLink,
          });
          // Reload to get latest data
          await product.reload();
        }

        console.log(`✅ Product and NFT updated successfully`);
      } catch (nftError: any) {
        console.error('⚠️  Failed to update NFT (database updated):', nftError.message);
        // Continue - database is updated, NFT update failed
      }
    }

    res.status(200).json({
      success: true,
      message: nftUpdateResult
        ? 'Product and NFT updated successfully'
        : 'Product updated successfully',
      data: {
        product,
        blockchain: nftUpdateResult ? {
          nftMintAddress: product.nftMintAddress,
          explorerLink: nftUpdateResult?.explorerLink || product.nftExplorerLink,
          updatedFields: nftUpdateResult?.updatedFields || [],
        } : null,
      },
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

/**
 * Deactivate product
 */
export const deactivateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });

      return;
    }

    await product.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully',
    });
  } catch (error: any) {
    console.error('Error deactivating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate product',
      error: error.message,
    });
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Check if product has batches
    const batchCount = await Batch.count({ where: { productId: product.id } });
    if (batchCount > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete product with existing batches. Deactivate instead.',
        data: { batchCount },
      });
      return;
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

/**
 * Get product statistics
 */
export const getProductStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: ['batches'],
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    const batches = await Batch.findAll({ where: { productId: product.id } });
    const totalPlanned = batches.reduce((sum: number, batch: any) => sum + batch.plannedQuantity, 0);
    const totalProduced = batches.reduce((sum: number, batch: any) => sum + batch.producedQuantity, 0);

    res.status(200).json({
      success: true,
      data: {
        id: product.id,
        gtin: product.gtin,
        productName: product.productName,
        company: product.company,
        nftMintAddress: product.nftMintAddress,
        nftExplorerLink: product.nftExplorerLink,
        totalBatches: batches.length,
        totalPlannedItems: totalPlanned,
        totalProducedItems: totalProduced,
        productionRate: totalPlanned > 0 ? ((totalProduced / totalPlanned) * 100).toFixed(2) + '%' : '0%',
        isActive: product.isActive,
      },
    });
  } catch (error: any) {
    console.error('Error fetching product stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product statistics',
      error: error.message,
    });
  }
};
