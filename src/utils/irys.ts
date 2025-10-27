/**
 * Irys (Arweave) utilities for managing uploads and balance
 */

import { Umi } from "@metaplex-foundation/umi";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

/**
 * Get Irys balance for the current identity
 * Note: Irys uses your Solana keypair to identify your account
 */
export async function getIrysBalance(umi: Umi): Promise<{
    balance: number;
    balanceInSOL: number;
    address: string;
}> {
    try {
        const address = umi.identity.publicKey.toString();

        // Note: Irys SDK would be used here for actual balance check
        // For now, we'll return a placeholder that shows the structure
        console.log(`📊 Checking Irys balance for: ${address}`);

        return {
            balance: 0, // Balance in atomic units
            balanceInSOL: 0, // Balance in SOL
            address,
        };
    } catch (error: any) {
        console.error('❌ Error checking Irys balance:', error);
        throw new Error(`Failed to check Irys balance: ${error.message}`);
    }
}

/**
 * Get estimated cost for uploading data to Arweave via Irys
 * @param sizeInBytes - Size of data to upload
 */
export async function getUploadCost(sizeInBytes: number): Promise<{
    costInLamports: number;
    costInSOL: number;
    sizeInKB: number;
}> {
    // Approximate cost: ~0.000005 SOL per KB (may vary)
    const sizeInKB = sizeInBytes / 1024;
    const costPerKB = 0.000005; // SOL
    const costInSOL = sizeInKB * costPerKB;
    const costInLamports = Math.ceil(costInSOL * LAMPORTS_PER_SOL);

    return {
        costInLamports,
        costInSOL,
        sizeInKB: Math.round(sizeInKB * 100) / 100,
    };
}

/**
 * Fund Irys account with SOL
 * This would require the Irys SDK
 */
export async function fundIrysAccount(
    amount: number,
    solanaConnection: Connection
): Promise<string> {
    console.log(`💰 Funding Irys account with ${amount} SOL...`);

    // This would use @irys/sdk to fund the account
    // Example: const irys = new Irys({ ... });
    // const tx = await irys.fund(amount);

    throw new Error('Irys funding not implemented yet. Please fund manually at https://devnet.irys.xyz');
}

/**
 * Get Arweave transaction URL
 * @param transactionId - Arweave transaction ID from URI
 */
export function getArweaveUrl(transactionId: string): string {
    // Remove https://arweave.net/ if present
    const id = transactionId.replace('https://arweave.net/', '');
    return `https://arweave.net/${id}`;
}

/**
 * Get Irys explorer URL for uploaded data
 * @param transactionId - Transaction ID
 * @param network - Network (devnet/mainnet)
 */
export function getIrysExplorerUrl(
    transactionId: string,
    network: 'devnet' | 'mainnet' = 'devnet'
): string {
    const baseUrl = network === 'mainnet'
        ? 'https://irys.xyz/tx'
        : 'https://devnet.irys.xyz/tx';
    return `${baseUrl}/${transactionId}`;
}

/**
 * Extract transaction ID from Arweave URI
 */
export function extractTxIdFromUri(uri: string): string {
    return uri.replace('https://arweave.net/', '').replace('ar://', '');
}

/**
 * Validate Arweave wallet address format
 */
export function isValidArweaveAddress(address: string): boolean {
    // Arweave addresses are 43 characters, base64url encoded
    const arweaveAddressRegex = /^[a-zA-Z0-9_-]{43}$/;
    return arweaveAddressRegex.test(address);
}

/**
 * Get information about configured Arweave wallet
 */
export function getArweaveWalletInfo(): {
    address: string | undefined;
    isConfigured: boolean;
} {
    const address = process.env.ARWEAVE_WALLET_ADDRESS;

    return {
        address,
        isConfigured: !!address && isValidArweaveAddress(address),
    };
}

