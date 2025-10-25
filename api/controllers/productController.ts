/**
 * Product Controller
 * Handles master product definitions (GTIN-based)
 */

import { Request, Response } from 'express';
import { Product, Batch } from '../models';

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
 * Get product by GTIN
 */
export const getProductByGtin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gtin } = req.params;

    const product = await Product.findOne({
      where: { gtin },
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
 * Create new product
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
    } = req.body;

    // Check if GTIN already exists
    const existingProduct = await Product.findOne({ where: { gtin } });
    if (existingProduct) {
      res.status(409).json({
        success: false,
        message: 'Product with this GTIN already exists',
        data: { existingProduct },
      });
      return;
    }

    // Create product
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

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
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
 * Update product
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gtin } = req.params;
    const updates = req.body;

    const product = await Product.findOne({ where: { gtin } });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Don't allow GTIN changes
    delete updates.gtin;

    await product.update(updates);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
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
    const { gtin } = req.params;

    const product = await Product.findOne({ where: { gtin } });

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
    const { gtin } = req.params;

    const product = await Product.findOne({ where: { gtin } });

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
    const { gtin } = req.params;

    const product = await Product.findOne({
      where: { gtin },
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
        gtin: product.gtin,
        productName: product.productName,
        company: product.company,
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
