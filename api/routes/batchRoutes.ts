/**
 * Batch Routes
 * API routes for batch management
 */

import express from 'express';
import * as batchController from '../controllers/batchController';

const router = express.Router();

/**
 * @swagger
 * /api/batches:
 *   get:
 *     summary: Get all batches
 *     tags: [Batches]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filter by product ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PLANNED, IN_PROGRESS, COMPLETED, CANCELLED]
 *         description: Filter by batch status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of results per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of batches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     batches:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Batch'
 *                     pagination:
 *                       type: object
 */
router.get(
  '/',
  batchController.getAllBatches
);

/**
 * @swagger
 * /api/batches/{id}:
 *   get:
 *     summary: Get batch by ID
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Batch'
 *       404:
 *         description: Batch not found
 */
router.get(
  '/:id',
  batchController.getBatchById
);

/**
 * @swagger
 * /api/batches:
 *   post:
 *     summary: Create new batch for a product (with NFT collection)
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - batchName
 *               - manufacturingFacility
 *               - productionLine
 *               - startDate
 *               - plannedQuantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               batchName:
 *                 type: string
 *                 example: 2025-Q1-Factory-A
 *               manufacturingFacility:
 *                 type: string
 *                 example: Factory-A, Mumbai
 *               productionLine:
 *                 type: string
 *                 example: Line-1
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               plannedQuantity:
 *                 type: integer
 *                 example: 1000
 *               imageFile:
 *                 type: string
 *                 description: Optional image file path
 *     responses:
 *       201:
 *         description: Batch created successfully
 *       404:
 *         description: Product not found
 *       409:
 *         description: Batch already exists for this product
 */
router.post(
  '/',
  batchController.createBatch
);

/**
 * @swagger
 * /api/batches/{id}:
 *   put:
 *     summary: Update batch (can top up produced quantity)
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PLANNED, IN_PROGRESS, COMPLETED, CANCELLED]
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               topUpQuantity:
 *                 type: integer
 *                 description: Increment produced quantity by this amount
 *                 example: 50
 *     responses:
 *       200:
 *         description: Batch updated successfully
 *       404:
 *         description: Batch not found
 */
router.put(
  '/:id',
  batchController.updateBatch
);

/**
 * @swagger
 * /api/batches/{id}:
 *   delete:
 *     summary: Delete batch
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Batch deleted successfully
 *       400:
 *         description: Cannot delete batch with items
 *       404:
 *         description: Batch not found
 */
router.delete(
  '/:id',
  batchController.deleteBatch
);

/**
 * @swagger
 * /api/batches/{id}/stats:
 *   get:
 *     summary: Get batch statistics
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Batch statistics
 *       404:
 *         description: Batch not found
 */
router.get(
  '/:id/stats',
  batchController.getBatchStats
);

export default router;

