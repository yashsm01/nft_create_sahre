/**
 * Product Routes
 * API routes for master product management (GTIN-based)
 */

import express from 'express';
import * as productController from '../controllers/productController';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product UUID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product (with automatic NFT creation)
 *     description: Creates a product with UUID and automatically creates Product Master NFT on blockchain
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - company
 *               - category
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Model-X Pro
 *               company:
 *                 type: string
 *                 example: TechCorp Industries
 *               category:
 *                 type: string
 *                 example: Electronics
 *               gtin:
 *                 type: string
 *                 example: "8901234567890"
 *                 description: Optional GTIN barcode
 *               description:
 *                 type: string
 *               model:
 *                 type: string
 *               specifications:
 *                 type: object
 *               warrantyMonths:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *               createNFT:
 *                 type: boolean
 *                 default: true
 *                 description: Automatically create NFT (default true)
 *     responses:
 *       201:
 *         description: Product (and NFT) created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: UUID
 *                         productName:
 *                           type: string
 *                         nftMintAddress:
 *                           type: string
 *                     blockchain:
 *                       type: object
 *                       properties:
 *                         nftMintAddress:
 *                           type: string
 *                         explorerLink:
 *                           type: string
 *                         metadataUri:
 *                           type: string
 *       409:
 *         description: Product with this GTIN already exists
 */
router.post('/', productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put('/:id', productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}/deactivate:
 *   put:
 *     summary: Deactivate product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product UUID
 *     responses:
 *       200:
 *         description: Product deactivated successfully
 *       404:
 *         description: Product not found
 */
router.put('/:id/deactivate', productController.deactivateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product UUID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Cannot delete product with batches
 *       404:
 *         description: Product not found
 */
router.delete('/:id', productController.deleteProduct);

/**
 * @swagger
 * /api/products/{id}/stats:
 *   get:
 *     summary: Get product statistics
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product UUID
 *     responses:
 *       200:
 *         description: Product statistics
 *       404:
 *         description: Product not found
 */
router.get('/:id/stats', productController.getProductStats);

export default router;
