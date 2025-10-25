/**
 * Umi instance setup and configuration utilities
 */

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { Umi, KeypairSigner } from "@metaplex-foundation/umi";
import { Keypair } from "@solana/web3.js";

/**
 * Create and configure a Umi instance with all necessary plugins
 * @param rpcEndpoint - The Solana RPC endpoint to connect to
 * @param keypair - The keypair to use as the identity/signer
 * @returns Configured Umi instance
 */
export function createUmiInstance(
  rpcEndpoint: string,
  keypair: Keypair
): Umi {
  // Create base Umi instance
  const umi = createUmi(rpcEndpoint);

  // Convert Solana keypair to Umi-compatible keypair
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(
    keypair.secretKey
  );

  // Configure Umi with plugins and identity
  umi
    .use(keypairIdentity(umiKeypair)) // Set the signer/identity
    .use(mplTokenMetadata()) // Load Token Metadata program
    .use(irysUploader()); // Load Irys uploader for permanent storage

  return umi;
}

/**
 * Get the public key of the current Umi identity
 * @param umi - The Umi instance
 * @returns Public key as string
 */
export function getUmiIdentityPublicKey(umi: Umi): string {
  return umi.identity.publicKey.toString();
}

