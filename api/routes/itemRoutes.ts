/**
 * Item Routes
 * API routes for individual manufactured items (NFTs)
 */

import express from 'express';
import * as itemController from '../controllers/itemController';

const router = express.Router();

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: batchId
 *         schema:
 *           type: integer
 *         description: Filter by batch ID
 *       - in: query
 *         name: qualityStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, PASSED, FAILED, REWORK]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [MANUFACTURED, IN_TRANSIT, DELIVERED, RETURNED, SCRAPPED]
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
 *         description: List of items
 */
router.get('/', itemController.getAllItems);

/**
 * @swagger
 * /api/items/{serialNumber}:
 *   get:
 *     summary: Get item by serial number
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item details
 *       404:
 *         description: Item not found
 */
router.get('/:serialNumber', itemController.getItemBySerial);

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create item NFT
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batchId
 *               - serialNumber
 *               - manufacturingOperator
 *             properties:
 *               batchId:
 *                 type: integer
 *                 example: 1
 *               serialNumber:
 *                 type: string
 *                 example: GTIN-8901234567890-2025Q1-00001
 *               manufacturingOperator:
 *                 type: string
 *                 example: John Doe
 *               qualityInspector:
 *                 type: string
 *               qualityNotes:
 *                 type: string
 *               additionalAttributes:
 *                 type: object
 *     responses:
 *       201:
 *         description: Item created successfully
 *       404:
 *         description: Batch not found
 *       409:
 *         description: Item already exists
 */
router.post('/', itemController.createItem);

/**
 * @swagger
 * /api/items/{serialNumber}:
 *   put:
 *     summary: Update item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: serialNumber
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
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 */
router.put('/:serialNumber', itemController.updateItem);

/**
 * @swagger
 * /api/items/{serialNumber}/quality:
 *   put:
 *     summary: Update quality inspection
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qualityStatus
 *               - qualityInspector
 *             properties:
 *               qualityStatus:
 *                 type: string
 *                 enum: [PENDING, PASSED, FAILED, REWORK]
 *               qualityInspector:
 *                 type: string
 *               qualityNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quality inspection updated
 *       404:
 *         description: Item not found
 */
router.put('/:serialNumber/quality', itemController.updateQualityInspection);

/**
 * @swagger
 * /api/items/{serialNumber}/verify:
 *   get:
 *     summary: Verify item on blockchain
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item verified successfully
 *       404:
 *         description: Item not found
 *       400:
 *         description: Item does not have NFT address
 */
router.get('/:serialNumber/verify', itemController.verifyItem);

/**
 * @swagger
 * /api/items/{serialNumber}:
 *   delete:
 *     summary: Delete item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
router.delete('/:serialNumber', itemController.deleteItem);

export default router;

