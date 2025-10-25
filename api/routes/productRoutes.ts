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
 * /api/products/{gtin}:
 *   get:
 *     summary: Get product by GTIN
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: gtin
 *         required: true
 *         schema:
 *           type: string
 *         description: Product GTIN barcode
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:gtin', productController.getProductByGtin);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gtin
 *               - productName
 *               - company
 *               - category
 *             properties:
 *               gtin:
 *                 type: string
 *                 example: "8901234567890"
 *               productName:
 *                 type: string
 *                 example: Model-X Pro
 *               company:
 *                 type: string
 *                 example: TechCorp Industries
 *               category:
 *                 type: string
 *                 example: Electronics
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
 *     responses:
 *       201:
 *         description: Product created successfully
 *       409:
 *         description: Product with this GTIN already exists
 */
router.post('/', productController.createProduct);

/**
 * @swagger
 * /api/products/{gtin}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: gtin
 *         required: true
 *         schema:
 *           type: string
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
router.put('/:gtin', productController.updateProduct);

/**
 * @swagger
 * /api/products/{gtin}/deactivate:
 *   put:
 *     summary: Deactivate product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: gtin
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deactivated successfully
 *       404:
 *         description: Product not found
 */
router.put('/:gtin/deactivate', productController.deactivateProduct);

/**
 * @swagger
 * /api/products/{gtin}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: gtin
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Cannot delete product with batches
 *       404:
 *         description: Product not found
 */
router.delete('/:gtin', productController.deleteProduct);

/**
 * @swagger
 * /api/products/{gtin}/stats:
 *   get:
 *     summary: Get product statistics
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: gtin
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product statistics
 *       404:
 *         description: Product not found
 */
router.get('/:gtin/stats', productController.getProductStats);

export default router;
