/**
 * Fractionalize Routes
 * API endpoints for NFT fractionalization and share distribution
 */

import { Router } from 'express';
import {
    fractionalizeNFTEndpoint,
    distributeSharesEndpoint,
    getShareTokenInfo,
} from '../controllers/fractionalizeController';

const router = Router();

/**
 * @swagger
 * /api/fractionalize:
 *   post:
 *     summary: Fractionalize an NFT into fungible share tokens with rich metadata
 *     description: |
 *       Create fractional shares of an NFT with comprehensive metadata including:
 *       - Custom token name and symbol
 *       - Creator information (name and ID)
 *       - Description and image URL
 *       - On-chain attributes (original NFT, total shares, creator, timestamp)
 *       - Arweave storage for permanent metadata
 *       
 *       The share token is stored in the database for tracking and querying.
 *     tags: [Fractionalization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nftMintAddress
 *               - tokenName
 *               - tokenSymbol
 *               - creatorName
 *               - totalShares
 *             properties:
 *               nftMintAddress:
 *                 type: string
 *                 description: The NFT mint address to fractionalize
 *                 example: "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV"
 *               tokenName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 32
 *                 description: Name for the share token (max 32 characters)
 *                 example: "Premium Art Shares"
 *               tokenSymbol:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 10
 *                 description: Symbol for the share token (uppercase, max 10 characters)
 *                 example: "PARTSH"
 *               creatorName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Name of the creator/issuer
 *                 example: "John Doe"
 *               creatorId:
 *                 type: string
 *                 maxLength: 100
 *                 description: Optional creator ID for tracking
 *                 example: "CREATOR-001"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Description of the share token
 *                 example: "Fractional ownership of premium digital art from renowned artist collection"
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL to token image
 *                 example: "https://arweave.net/abc123/image.png"
 *               totalShares:
 *                 type: integer
 *                 minimum: 2
 *                 maximum: 1000000
 *                 description: Number of share tokens to create
 *                 example: 100
 *               shareDecimals:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 9
 *                 description: Decimals for share tokens (default 0)
 *                 example: 0
 *           examples:
 *             artShares:
 *               summary: Art Collection Shares
 *               value:
 *                 nftMintAddress: "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV"
 *                 tokenName: "Premium Art Shares"
 *                 tokenSymbol: "PARTSH"
 *                 creatorName: "Art Gallery DAO"
 *                 creatorId: "GALLERY-001"
 *                 description: "Fractional ownership of premium digital art"
 *                 imageUrl: "https://arweave.net/abc123/art.png"
 *                 totalShares: 100
 *                 shareDecimals: 0
 *             realEstate:
 *               summary: Real Estate Property
 *               value:
 *                 nftMintAddress: "8xyz..."
 *                 tokenName: "Downtown Property Shares"
 *                 tokenSymbol: "DTOWN"
 *                 creatorName: "Real Estate Fund LLC"
 *                 creatorId: "FUND-2024-001"
 *                 description: "Fractional ownership of commercial property in downtown area"
 *                 totalShares: 1000
 *                 shareDecimals: 0
 *             startup:
 *               summary: Startup Equity
 *               value:
 *                 nftMintAddress: "9abc..."
 *                 tokenName: "TechCorp Equity Tokens"
 *                 tokenSymbol: "TECH"
 *                 creatorName: "TechCorp Inc"
 *                 creatorId: "COMPANY-001"
 *                 description: "Employee and investor equity in TechCorp"
 *                 totalShares: 10000
 *                 shareDecimals: 2
 *     responses:
 *       201:
 *         description: NFT fractionalized successfully with metadata
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
 *                   example: "NFT fractionalized successfully with metadata"
 *                 data:
 *                   type: object
 *                   properties:
 *                     nftMintAddress:
 *                       type: string
 *                       example: "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV"
 *                     shareTokenMint:
 *                       type: string
 *                       example: "8XyzAbC123..."
 *                     tokenName:
 *                       type: string
 *                       example: "Premium Art Shares"
 *                     tokenSymbol:
 *                       type: string
 *                       example: "PARTSH"
 *                     totalShares:
 *                       type: integer
 *                       example: 100
 *                     decimals:
 *                       type: integer
 *                       example: 0
 *                     creator:
 *                       type: object
 *                       properties:
 *                         address:
 *                           type: string
 *                           example: "2f7CJ8DWT8zJbVnC95rooMUoeh7yb7wewZha1hTAjU45"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         id:
 *                           type: string
 *                           example: "CREATOR-001"
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         description:
 *                           type: string
 *                           example: "Fractional ownership of premium digital art"
 *                         imageUrl:
 *                           type: string
 *                           example: "https://arweave.net/abc123/image.png"
 *                         metadataUri:
 *                           type: string
 *                           example: "https://arweave.net/def456/metadata.json"
 *                     ownerAddress:
 *                       type: string
 *                       example: "2f7CJ8DWT8zJbVnC95rooMUoeh7yb7wewZha1hTAjU45"
 *                     ownerBalance:
 *                       type: string
 *                       example: "100"
 *                     explorerLink:
 *                       type: string
 *                       example: "https://explorer.solana.com/address/8XyzAbC123...?cluster=devnet"
 *                     instructions:
 *                       type: object
 *                       properties:
 *                         getBalance:
 *                           type: string
 *                         transfer:
 *                           type: string
 *             example:
 *               success: true
 *               message: "NFT fractionalized successfully with metadata"
 *               data:
 *                 nftMintAddress: "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV"
 *                 shareTokenMint: "8XyzAbC123..."
 *                 tokenName: "Premium Art Shares"
 *                 tokenSymbol: "PARTSH"
 *                 totalShares: 100
 *                 decimals: 0
 *                 creator:
 *                   address: "2f7CJ8DWT8zJbVnC95rooMUoeh7yb7wewZha1hTAjU45"
 *                   name: "John Doe"
 *                   id: "CREATOR-001"
 *                 metadata:
 *                   description: "Fractional ownership of premium digital art"
 *                   imageUrl: "https://arweave.net/abc123/image.png"
 *                   metadataUri: "https://arweave.net/def456/metadata.json"
 *                 ownerAddress: "2f7CJ8DWT8zJbVnC95rooMUoeh7yb7wewZha1hTAjU45"
 *                 ownerBalance: "100"
 *                 explorerLink: "https://explorer.solana.com/address/8XyzAbC123...?cluster=devnet"
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to fractionalize NFT"
 *                 error:
 *                   type: string
 */
router.post('/', fractionalizeNFTEndpoint);

/**
 * @swagger
 * /api/fractionalize/distribute:
 *   post:
 *     summary: Distribute share tokens to multiple recipients with tracking
 *     description: |
 *       Send share tokens to multiple recipients with complete tracking:
 *       - Recipient name and ID for identification
 *       - Transfer notes for documentation
 *       - Automatic balance checking
 *       - Database storage of all transfers
 *       - Transaction signatures and explorer links
 *       
 *       All successful transfers are recorded in the share_transfers table.
 *     tags: [Fractionalization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shareTokenMint
 *               - distributions
 *             properties:
 *               shareTokenMint:
 *                 type: string
 *                 description: The share token mint address
 *                 example: "8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2"
 *               distributions:
 *                 type: array
 *                 minItems: 1
 *                 description: Array of recipients with tracking information
 *                 items:
 *                   type: object
 *                   required:
 *                     - recipient
 *                     - amount
 *                   properties:
 *                     recipient:
 *                       type: string
 *                       minLength: 32
 *                       maxLength: 44
 *                       description: Recipient Solana wallet address
 *                       example: "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM"
 *                     recipientName:
 *                       type: string
 *                       maxLength: 100
 *                       description: Optional recipient name for tracking
 *                       example: "Alice Johnson"
 *                     recipientId:
 *                       type: string
 *                       maxLength: 100
 *                       description: Optional recipient ID for tracking
 *                       example: "USER-001"
 *                     amount:
 *                       type: integer
 *                       minimum: 1
 *                       description: Number of shares to send
 *                       example: 25
 *                     note:
 *                       type: string
 *                       maxLength: 500
 *                       description: Optional note about this transfer
 *                       example: "Initial distribution - Q1 2025"
 *           examples:
 *             investorDistribution:
 *               summary: Investor Distribution
 *               value:
 *                 shareTokenMint: "8XyzAbC123..."
 *                 distributions:
 *                   - recipient: "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM"
 *                     recipientName: "Alice Johnson"
 *                     recipientId: "INV-001"
 *                     amount: 30
 *                     note: "Lead investor allocation"
 *                   - recipient: "9AbCxYz..."
 *                     recipientName: "Bob Smith"
 *                     recipientId: "INV-002"
 *                     amount: 20
 *                     note: "Co-investor allocation"
 *             employeeEquity:
 *               summary: Employee Equity Distribution
 *               value:
 *                 shareTokenMint: "8XyzAbC123..."
 *                 distributions:
 *                   - recipient: "5Def..."
 *                     recipientName: "John Doe"
 *                     recipientId: "EMP-001"
 *                     amount: 500
 *                     note: "Q1 2025 vesting"
 *                   - recipient: "6Ghi..."
 *                     recipientName: "Jane Smith"
 *                     recipientId: "EMP-002"
 *                     amount: 300
 *                     note: "Q1 2025 vesting"
 *     responses:
 *       200:
 *         description: Shares distributed successfully with tracking
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
 *                   example: "Shares distributed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     shareTokenMint:
 *                       type: string
 *                       example: "8XyzAbC123..."
 *                     tokenName:
 *                       type: string
 *                       example: "Premium Art Shares"
 *                     tokenSymbol:
 *                       type: string
 *                       example: "PARTSH"
 *                     totalDistributed:
 *                       type: integer
 *                       example: 50
 *                     recipientCount:
 *                       type: integer
 *                       example: 2
 *                     successCount:
 *                       type: integer
 *                       example: 2
 *                     distributions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           recipient:
 *                             type: string
 *                           recipientName:
 *                             type: string
 *                           recipientId:
 *                             type: string
 *                           amount:
 *                             type: integer
 *                           status:
 *                             type: string
 *                             enum: [success, failed]
 *                           signature:
 *                             type: string
 *                       example:
 *                         - recipient: "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM"
 *                           recipientName: "Alice Johnson"
 *                           recipientId: "INV-001"
 *                           amount: 30
 *                           status: "success"
 *                           signature: "5JxyAbC..."
 *                         - recipient: "9AbCxYz..."
 *                           recipientName: "Bob Smith"
 *                           recipientId: "INV-002"
 *                           amount: 20
 *                           status: "success"
 *                           signature: "6KyzDef..."
 *                     senderBalance:
 *                       type: object
 *                       properties:
 *                         before:
 *                           type: string
 *                           example: "100"
 *                         after:
 *                           type: string
 *                           example: "50"
 *                     explorerLinks:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "https://explorer.solana.com/tx/5JxyAbC...?cluster=devnet"
 *                         - "https://explorer.solana.com/tx/6KyzDef...?cluster=devnet"
 *       400:
 *         description: Invalid input or insufficient balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Insufficient balance"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to distribute shares"
 */
router.post('/distribute', distributeSharesEndpoint);

/**
 * @swagger
 * /api/fractionalize/token/{shareTokenMint}:
 *   get:
 *     summary: Get share token information
 *     tags: [Fractionalization]
 *     parameters:
 *       - in: path
 *         name: shareTokenMint
 *         required: true
 *         schema:
 *           type: string
 *         description: Share token mint address
 *     responses:
 *       200:
 *         description: Share token info retrieved successfully
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
 *                     shareTokenMint:
 *                       type: string
 *                     decimals:
 *                       type: integer
 *                     totalSupply:
 *                       type: string
 *                     ownerAddress:
 *                       type: string
 *                     ownerBalance:
 *                       type: string
 *                     explorerLink:
 *                       type: string
 *       404:
 *         description: Share token not found
 *       500:
 *         description: Server error
 */
router.get('/token/:shareTokenMint', getShareTokenInfo);

export default router;

