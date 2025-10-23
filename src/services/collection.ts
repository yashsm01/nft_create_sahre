/**
 * Collection creation and management service
 */

import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Umi,
  generateSigner,
  percentAmount,
  PublicKey as UmiPublicKey,
} from "@metaplex-foundation/umi";
import { CollectionConfig, CollectionCreationResult } from "../types/index.js";
import { uploadImageAndMetadata } from "../utils/uploader.js";
import { getExplorerLinkForAddress } from "../utils/helpers.js";
import { COMMITMENT_LEVELS } from "../config/constants.js";

/**
 * Create a new NFT collection
 * @param umi - The Umi instance
 * @param config - Collection configuration
 * @param cluster - The Solana cluster
 * @returns Collection creation result
 */
export async function createCollection(
  umi: Umi,
  config: CollectionConfig,
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<CollectionCreationResult> {
  console.log(`\n🎨 Creating collection: ${config.name}...`);

  // Upload image and metadata
  const { imageUri, metadataUri } = await uploadImageAndMetadata(
    umi,
    config.imageFile,
    {
      name: config.name,
      symbol: config.symbol,
      description: config.description,
      sellerFeeBasisPoints: config.sellerFeeBasisPoints,
    }
  );

  // Generate a new mint address for the collection
  const collectionMint = generateSigner(umi);

  console.log(`\n🔨 Minting collection NFT...`);

  // Create the collection NFT
  await createNft(umi, {
    mint: collectionMint,
    name: config.name,
    symbol: config.symbol,
    uri: metadataUri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(config.sellerFeeBasisPoints),
    isCollection: true, // This marks it as a collection
  }).sendAndConfirm(umi, {
    send: { commitment: COMMITMENT_LEVELS.FINALIZED },
  });

  const explorerLink = getExplorerLinkForAddress(
    collectionMint.publicKey,
    cluster
  );

  console.log(`\n✨ Collection created successfully!`);
  console.log(`📍 Collection address: ${collectionMint.publicKey}`);
  console.log(`🔗 Explorer: ${explorerLink}`);

  return {
    collectionAddress: collectionMint.publicKey,
    metadataUri,
    imageUri,
    explorerLink,
  };
}

/**
 * Get collection metadata
 * @param umi - The Umi instance
 * @param collectionAddress - The collection mint address
 * @returns Collection metadata
 */
export async function getCollectionMetadata(
  umi: Umi,
  collectionAddress: UmiPublicKey
) {
  // This would use fetchMetadataFromSeeds or similar
  // Implementation depends on specific requirements
  console.log(`Fetching metadata for collection: ${collectionAddress}`);
}

