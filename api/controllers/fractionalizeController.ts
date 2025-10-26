/**
 * Fractionalize Controller
 * Handles NFT fractionalization and share distribution with metadata
 */

import { Request, Response } from 'express';
import { fractionalizeNFT, fractionalizeNFTWithMetadata, distributeShares } from '../../src/services/fractionalize';
import { loadKeypair } from '../../src/utils/helpers';
import { createUmiInstance } from '../../src/utils/umi';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { FractionalToken, ShareTransfer } from '../models';

/**
 * Fractionalize an NFT into fungible share tokens with metadata
 */
export const fractionalizeNFTEndpoint = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            nftMintAddress,
            totalShares,
            tokenName,
            tokenSymbol,
            creatorName,
            creatorId,
            description,
            imageUrl,
            shareDecimals = 0,
        } = req.body;

        // Validate required fields
        if (!nftMintAddress || !totalShares || !tokenName || !tokenSymbol || !creatorName) {
            res.status(400).json({
                success: false,
                message: 'nftMintAddress, totalShares, tokenName, tokenSymbol, and creatorName are required',
            });
            return;
        }

        if (totalShares < 2 || totalShares > 1000000) {
            res.status(400).json({
                success: false,
                message: 'totalShares must be between 2 and 1,000,000',
            });
            return;
        }

        console.log('🔨 Fractionalizing NFT with metadata...');
        console.log(`NFT: ${nftMintAddress}`);
        console.log(`Token: ${tokenName} (${tokenSymbol})`);
        console.log(`Creator: ${creatorName}`);
        console.log(`Total Shares: ${totalShares}`);

        // Load keypair and create connection/umi
        const keypair = await loadKeypair();
        const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
        const connection = new Connection(rpcEndpoint, 'confirmed');
        const umi = createUmiInstance(rpcEndpoint, keypair);
        const cluster = (process.env.SOLANA_CLUSTER as "devnet" | "testnet" | "mainnet-beta") || "devnet";

        // Fractionalize with metadata
        const result = await fractionalizeNFTWithMetadata(
            umi,
            nftMintAddress,
            tokenName,
            tokenSymbol,
            totalShares,
            creatorName,
            creatorId,
            description,
            imageUrl,
            shareDecimals,
            cluster
        );

        // Get mint info
        const shareTokenPubkey = new PublicKey(result.shareTokenMint);
        const mintInfo = await getMint(connection, shareTokenPubkey);

        // Get owner balance
        const ownerATA = await getAssociatedTokenAddress(shareTokenPubkey, keypair.publicKey);
        const tokenAccount = await getAccount(connection, ownerATA);

        // Save to database
        await FractionalToken.create({
            nftMintAddress,
            shareTokenMint: result.shareTokenMint,
            tokenName: result.tokenName,
            tokenSymbol: result.tokenSymbol,
            totalShares: result.totalShares,
            decimals: shareDecimals,
            description,
            imageUrl,
            metadataUri: result.metadataUri,
            creatorAddress: result.creator,
            creatorName,
            creatorId,
            explorerLink: result.explorerLink,
            isActive: true,
        });

        res.status(201).json({
            success: true,
            message: 'NFT fractionalized successfully with metadata',
            data: {
                nftMintAddress,
                shareTokenMint: result.shareTokenMint,
                tokenName: result.tokenName,
                tokenSymbol: result.tokenSymbol,
                totalShares: result.totalShares,
                decimals: shareDecimals,
                creator: {
                    address: result.creator,
                    name: creatorName,
                    id: creatorId,
                },
                metadata: {
                    description,
                    imageUrl,
                    metadataUri: result.metadataUri,
                },
                ownerAddress: keypair.publicKey.toBase58(),
                ownerBalance: tokenAccount.amount.toString(),
                explorerLink: result.explorerLink,
                instructions: {
                    getBalance: `spl-token balance ${result.shareTokenMint} --url ${cluster}`,
                    transfer: `spl-token transfer ${result.shareTokenMint} <amount> <recipient> --url ${cluster}`,
                },
            },
        });
    } catch (error: any) {
        console.error('Error fractionalizing NFT:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fractionalize NFT',
            error: error.message,
        });
    }
};

/**
 * Distribute shares to multiple recipients
 */
export const distributeSharesEndpoint = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            shareTokenMint,
            distributions,
        } = req.body;

        // Validate input
        if (!shareTokenMint || !distributions || !Array.isArray(distributions)) {
            res.status(400).json({
                success: false,
                message: 'shareTokenMint and distributions array are required',
            });
            return;
        }

        if (distributions.length === 0) {
            res.status(400).json({
                success: false,
                message: 'distributions array cannot be empty',
            });
            return;
        }

        // Validate each distribution
        for (const dist of distributions) {
            if (!dist.recipient || !dist.amount) {
                res.status(400).json({
                    success: false,
                    message: 'Each distribution must have recipient and amount',
                });
                return;
            }

            if (dist.amount <= 0) {
                res.status(400).json({
                    success: false,
                    message: 'Amount must be greater than 0',
                });
                return;
            }

            // Validate recipient address
            try {
                new PublicKey(dist.recipient);
            } catch (e) {
                res.status(400).json({
                    success: false,
                    message: `Invalid recipient address: ${dist.recipient}`,
                });
                return;
            }
        }

        console.log('📤 Distributing shares...');
        console.log(`Share Token: ${shareTokenMint}`);
        console.log(`Recipients: ${distributions.length}`);

        // Load keypair and create connection
        const keypair = await loadKeypair();
        const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
        const connection = new Connection(rpcEndpoint, 'confirmed');
        const cluster = (process.env.SOLANA_CLUSTER as "devnet" | "testnet" | "mainnet-beta") || "devnet";

        // Check sender's balance
        const shareTokenPubkey = new PublicKey(shareTokenMint);
        const senderATA = await getAssociatedTokenAddress(shareTokenPubkey, keypair.publicKey);

        let senderBalance: bigint;
        try {
            const tokenAccount = await getAccount(connection, senderATA);
            senderBalance = tokenAccount.amount;
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Sender does not have any shares of this token',
            });
            return;
        }

        // Calculate total amount to distribute
        const totalAmount = distributions.reduce((sum, dist) => sum + dist.amount, 0);

        if (BigInt(totalAmount) > senderBalance) {
            res.status(400).json({
                success: false,
                message: `Insufficient balance. Have: ${senderBalance}, Need: ${totalAmount}`,
                data: {
                    availableBalance: senderBalance.toString(),
                    requestedAmount: totalAmount,
                },
            });
            return;
        }

        // Get token metadata
        const fractionalToken = await FractionalToken.findOne({
            where: { shareTokenMint }
        });

        // Distribute shares
        const results = await distributeShares(
            connection,
            keypair,
            shareTokenMint,
            distributions,
            cluster
        );

        // Save transfer records to database
        const transferRecords = results.distributions.filter((r: any) => r.status === "success").map((r: any) => ({
            shareTokenMint,
            tokenName: fractionalToken?.tokenName || "Unknown",
            tokenSymbol: fractionalToken?.tokenSymbol || "UNKNOWN",
            fromAddress: keypair.publicKey.toBase58(),
            fromName: "System", // Could be parameterized
            toAddress: r.recipient,
            toName: r.recipientName,
            toId: r.recipientId,
            amount: r.amount.toString(),
            signature: r.signature,
            explorerLink: `https://explorer.solana.com/tx/${r.signature}?cluster=${cluster}`,
            note: (distributions.find((d: any) => d.recipient === r.recipient))?.note,
            transferredAt: new Date(),
        }));

        if (transferRecords.length > 0) {
            await ShareTransfer.bulkCreate(transferRecords);
        }

        // Get updated balances
        const updatedSenderAccount = await getAccount(connection, senderATA);

        res.status(200).json({
            success: true,
            message: 'Shares distributed successfully',
            data: {
                shareTokenMint,
                tokenName: fractionalToken?.tokenName,
                tokenSymbol: fractionalToken?.tokenSymbol,
                totalDistributed: totalAmount,
                recipientCount: distributions.length,
                successCount: results.distributions.filter((r: any) => r.status === "success").length,
                distributions: results.distributions,
                senderBalance: {
                    before: senderBalance.toString(),
                    after: updatedSenderAccount.amount.toString(),
                },
                explorerLinks: results.explorerLinks,
            },
        });
    } catch (error: any) {
        console.error('Error distributing shares:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to distribute shares',
            error: error.message,
        });
    }
};

/**
 * Get share token info
 */
export const getShareTokenInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shareTokenMint } = req.params;

        if (!shareTokenMint) {
            res.status(400).json({
                success: false,
                message: 'shareTokenMint is required',
            });
            return;
        }

        // Load keypair and create connection
        const keypair = await loadKeypair();
        const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
        const connection = new Connection(rpcEndpoint, 'confirmed');
        const cluster = (process.env.SOLANA_CLUSTER as "devnet" | "testnet" | "mainnet-beta") || "devnet";

        // Get mint info
        const mintPubkey = new PublicKey(shareTokenMint);
        const mintInfo = await connection.getParsedAccountInfo(mintPubkey);

        if (!mintInfo.value) {
            res.status(404).json({
                success: false,
                message: 'Share token not found',
            });
            return;
        }

        const mintData: any = mintInfo.value.data;
        const decimals = mintData.parsed.info.decimals;
        const supply = mintData.parsed.info.supply;

        // Get owner's balance
        let ownerBalance = '0';
        try {
            const ownerATA = await getAssociatedTokenAddress(mintPubkey, keypair.publicKey);
            const tokenAccount = await getAccount(connection, ownerATA);
            ownerBalance = tokenAccount.amount.toString();
        } catch (e) {
            // Owner doesn't have an account for this token
        }

        const explorerLink = `https://explorer.solana.com/address/${shareTokenMint}?cluster=${cluster}`;

        res.status(200).json({
            success: true,
            data: {
                shareTokenMint,
                decimals,
                totalSupply: supply,
                ownerAddress: keypair.publicKey.toBase58(),
                ownerBalance,
                explorerLink,
            },
        });
    } catch (error: any) {
        console.error('Error getting share token info:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get share token info',
            error: error.message,
        });
    }
};

