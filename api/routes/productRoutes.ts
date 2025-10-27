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
 *     summary: Update product (database + blockchain NFT)
 *     description: Updates product in database and optionally updates its NFT on blockchain if NFT exists
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product UUID
 *         example: "6c07c210-4400-4176-aaee-a44bdd5e0b95"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Product name (database)
 *                 example: "Updated Model-X Pro"
 *               company:
 *                 type: string
 *                 description: Company name (database)
 *               category:
 *                 type: string
 *                 description: Product category (database)
 *               description:
 *                 type: string
 *                 description: Product description (database + NFT metadata)
 *                 example: "Enhanced version with new features"
 *               model:
 *                 type: string
 *                 description: Product model (database)
 *               gtin:
 *                 type: string
 *                 description: GTIN barcode (database)
 *               specifications:
 *                 type: object
 *                 description: Product specifications (database)
 *               warrantyMonths:
 *                 type: integer
 *                 description: Warranty period (database)
 *               imageUrl:
 *                 type: string
 *                 description: Product image URL (database + NFT metadata)
 *                 example: "https://example.com/updated-image.jpg"
 *               isActive:
 *                 type: boolean
 *                 description: Active status (database)
 *               nftName:
 *                 type: string
 *                 description: NFT name on blockchain (max 32 chars)
 *                 example: "Updated NFT Name"
 *               nftSymbol:
 *                 type: string
 *                 description: NFT symbol on blockchain (max 10 chars)
 *                 example: "UPROD"
 *               sellerFeeBasisPoints:
 *                 type: integer
 *                 description: Royalty percentage (500 = 5%) - blockchain
 *                 example: 500
 *               primarySaleHappened:
 *                 type: boolean
 *                 description: Primary sale status - blockchain
 *               isMutable:
 *                 type: boolean
 *                 description: Whether NFT can be updated again - blockchain
 *           examples:
 *             updateDatabaseOnly:
 *               summary: Update database fields only
 *               value:
 *                 productName: "Updated Model-X Pro"
 *                 description: "Enhanced version"
 *                 warrantyMonths: 36
 *             updateDatabaseAndNFT:
 *               summary: Update database + blockchain NFT
 *               value:
 *                 productName: "Updated Model-X Pro Gen 2"
 *                 description: "Second generation professional laptop"
 *                 imageUrl: "https://example.com/gen2.jpg"
 *                 nftName: "Model-X Pro Gen 2"
 *                 nftSymbol: "MXPG2"
 *                 sellerFeeBasisPoints: 500
 *             updateNFTOnly:
 *               summary: Update only blockchain NFT fields
 *               value:
 *                 nftName: "Renamed Product NFT"
 *                 nftSymbol: "RPNFT"
 *                 sellerFeeBasisPoints: 750
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Product and NFT updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: object
 *                       description: Updated product from database
 *                     blockchain:
 *                       type: object
 *                       description: NFT update results (null if no NFT updated)
 *                       properties:
 *                         nftMintAddress:
 *                           type: string
 *                         explorerLink:
 *                           type: string
 *                         updatedFields:
 *                           type: array
 *                           items:
 *                             type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
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

/**
 * @swagger
 * /api/products/nft/{mintAddress}:
 *   get:
 *     summary: Get NFT details from Solana blockchain
 *     description: Fetch complete NFT details including on-chain and off-chain metadata from Solana using the mint address
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: mintAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: Solana NFT mint address (public key)
 *         example: "7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs"
 *     responses:
 *       200:
 *         description: NFT details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "NFT details fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     mintAddress:
 *                       type: string
 *                       example: "7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs"
 *                     onChainMetadata:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Samsung Galaxy S23"
 *                         symbol:
 *                           type: string
 *                           example: "PROD"
 *                         uri:
 *                           type: string
 *                           example: "https://arweave.net/abc123..."
 *                         sellerFeeBasisPoints:
 *                           type: number
 *                           example: 500
 *                         creators:
 *                           type: array
 *                           items:
 *                             type: object
 *                         primarySaleHappened:
 *                           type: boolean
 *                           example: false
 *                         isMutable:
 *                           type: boolean
 *                           example: true
 *                         tokenStandard:
 *                           type: string
 *                           example: "NonFungible"
 *                     offChainMetadata:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *                         image:
 *                           type: string
 *                         attributes:
 *                           type: array
 *                           items:
 *                             type: object
 *                     explorerLink:
 *                       type: string
 *                       example: "https://explorer.solana.com/address/7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs?cluster=devnet"
 *                     metadataAccount:
 *                       type: string
 *                       example: "8FZnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs"
 *       400:
 *         description: Invalid mint address
 *       404:
 *         description: NFT not found
 *       500:
 *         description: Server error
 */
router.get('/nft/:mintAddress', productController.getNFTDetails);

/**
 * @swagger
 * /api/products/metadata:
 *   get:
 *     summary: Get NFT metadata from URI
 *     description: Fetch off-chain metadata JSON from Arweave/IPFS URI
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: uri
 *         required: true
 *         schema:
 *           type: string
 *         description: Arweave or IPFS metadata URI
 *         example: "https://arweave.net/abc123def456..."
 *     responses:
 *       200:
 *         description: Metadata fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Metadata fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     uri:
 *                       type: string
 *                       example: "https://arweave.net/abc123..."
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Samsung Galaxy S23"
 *                         description:
 *                           type: string
 *                           example: "Premium smartphone with advanced features"
 *                         image:
 *                           type: string
 *                           example: "https://example.com/image.png"
 *                         attributes:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               trait_type:
 *                                 type: string
 *                               value:
 *                                 type: string
 *                         properties:
 *                           type: object
 *       400:
 *         description: Invalid or missing URI
 *       404:
 *         description: Metadata not found
 *       500:
 *         description: Server error
 */
router.get('/metadata', productController.getMetadataByUri);

/**
 * @swagger
 * /api/products/arweave/config:
 *   get:
 *     summary: Get Arweave/Irys configuration
 *     description: Get information about Arweave wallet configuration, Irys settings, and upload cost estimates
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Arweave configuration retrieved"
 *                 data:
 *                   type: object
 *                   properties:
 *                     arweaveWallet:
 *                       type: object
 *                       properties:
 *                         address:
 *                           type: string
 *                           example: "i1my-YLe7oes8B9244h6SY-UgFwtJ0E3xUmbrHZHAB4"
 *                         isConfigured:
 *                           type: boolean
 *                           example: true
 *                         explorerLink:
 *                           type: string
 *                           example: "https://viewblock.io/arweave/address/i1my-YLe7oes8B9244h6SY-UgFwtJ0E3xUmbrHZHAB4"
 *                     irysConfig:
 *                       type: object
 *                       properties:
 *                         network:
 *                           type: string
 *                           example: "devnet"
 *                         endpoint:
 *                           type: string
 *                           example: "https://devnet.irys.xyz"
 *                         paymentToken:
 *                           type: string
 *                           example: "SOL"
 *                     estimatedCosts:
 *                       type: object
 *                       properties:
 *                         metadataUpload:
 *                           type: object
 *                           properties:
 *                             sizeKB:
 *                               type: number
 *                               example: 2
 *                             costSOL:
 *                               type: number
 *                               example: 0.00001
 *                             note:
 *                               type: string
 *                               example: "Typical NFT metadata (JSON)"
 *                         imageUpload:
 *                           type: object
 *                           properties:
 *                             sizeKB:
 *                               type: number
 *                               example: 500
 *                             costSOL:
 *                               type: number
 *                               example: 0.0025
 *                             note:
 *                               type: string
 *                               example: "Typical product image (500KB)"
 *                     fundingInfo:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                         devnetUrl:
 *                           type: string
 *                         mainnetUrl:
 *                           type: string
 *       500:
 *         description: Server error
 */
router.get('/arweave/config', productController.getArweaveConfig);

export default router;
