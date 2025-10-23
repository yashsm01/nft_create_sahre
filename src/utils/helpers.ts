/**
 * General helper utilities
 */

import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getKeypairFromFile, airdropIfRequired, getExplorerLink } from "@solana-developers/helpers";
import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";
import { AIRDROP_AMOUNT } from "../config/constants.js";

/**
 * Load keypair from local filesystem
 * Uses the default Solana CLI keypair location
 * @returns Keypair object
 */
export async function loadKeypair(): Promise<Keypair> {
  const keypair = await getKeypairFromFile();
  console.log(`🔑 Loaded keypair: ${keypair.publicKey.toBase58()}`);
  return keypair;
}

/**
 * Ensure the wallet has sufficient SOL for operations
 * @param connection - Solana connection
 * @param keypair - The keypair to check/airdrop to
 */
export async function ensureFunding(
  connection: Connection,
  keypair: Keypair
): Promise<void> {
  await airdropIfRequired(
    connection,
    keypair.publicKey,
    AIRDROP_AMOUNT.TARGET * LAMPORTS_PER_SOL,
    AIRDROP_AMOUNT.THRESHOLD * LAMPORTS_PER_SOL
  );

  const balance = await connection.getBalance(keypair.publicKey);
  console.log(`💰 Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

/**
 * Get Solana Explorer link for an address
 * @param address - The address (UmiPublicKey)
 * @param cluster - The cluster name
 * @returns Explorer URL
 */
export function getExplorerLinkForAddress(
  address: UmiPublicKey,
  cluster: "devnet" | "testnet" | "mainnet-beta"
): string {
  return getExplorerLink("address", address.toString(), cluster);
}

/**
 * Display a separator line in console
 */
export function displaySeparator(): void {
  console.log("\n" + "=".repeat(60) + "\n");
}

/**
 * Display success message with styling
 * @param message - The message to display
 */
export function displaySuccess(message: string): void {
  console.log(`\n✅ ${message}\n`);
}

/**
 * Display error message with styling
 * @param message - The error message to display
 */
export function displayError(message: string): void {
  console.error(`\n❌ ${message}\n`);
}

/**
 * Display info message with styling
 * @param message - The info message to display
 */
export function displayInfo(message: string): void {
  console.log(`\nℹ️  ${message}\n`);
}

/**
 * Validate that a required environment variable is set
 * @param value - The environment variable value
 * @param name - The name of the environment variable
 * @throws Error if value is undefined or empty
 */
export function validateEnvVariable(
  value: string | undefined,
  name: string
): void {
  if (!value || value.trim() === "") {
    throw new Error(
      `${name} is not set. Please set it in your .env file or as an environment variable.`
    );
  }
}

