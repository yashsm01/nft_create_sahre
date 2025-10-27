/**
 * NFT creation, update, and verification service
 */

import {
  createNft,
  fetchMetadataFromSeeds,
  findMetadataPda,
  updateV1,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Umi,
  generateSigner,
  percentAmount,
  PublicKey as UmiPublicKey,
} from "@metaplex-foundation/umi";
import {
  NFTConfig,
  NFTCreationResult,
  NFTUpdateData,
} from "../types/index.js";
import { uploadImageAndMetadata, uploadImage } from "../utils/uploader.js";
import { getExplorerLinkForAddress } from "../utils/helpers.js";
import { COMMITMENT_LEVELS } from "../config/constants.js";

/**
 * Create a new NFT
 * @param umi - The Umi instance
 * @param config - NFT configuration
 * @param cluster - The Solana cluster
 * @param collectionAddress - Optional collection to add NFT to
 * @returns NFT creation result
 */
export async function createNFT(
  umi: Umi,
  config: NFTConfig,
  cluster: "devnet" | "testnet" | "mainnet-beta",
  collectionAddress?: UmiPublicKey
): Promise<NFTCreationResult> {
  console.log(`\n🎨 Creating NFT: ${config.name}...`);

  // Upload image and metadata
  const { imageUri, metadataUri } = await uploadImageAndMetadata(
    umi,
    config.imageFile,
    {
      name: config.name,
      symbol: config.symbol,
      description: config.description,
      sellerFeeBasisPoints: config.sellerFeeBasisPoints,
      attributes: config.attributes,
    }
  );

  // Generate a new mint address for the NFT
  const mint = generateSigner(umi);

  console.log(`\n🔨 Minting NFT...`);

  // Create the NFT
  const nftParams: any = {
    mint,
    name: config.name,
    symbol: config.symbol,
    uri: metadataUri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(config.sellerFeeBasisPoints),
  };

  // Add collection if provided
  if (collectionAddress) {
    nftParams.collection = {
      key: collectionAddress,
      verified: false, // Will be verified separately
    };
  }

  const { signature } = await createNft(umi, nftParams).sendAndConfirm(umi, {
    send: { commitment: COMMITMENT_LEVELS.FINALIZED },
  });

  const explorerLink = getExplorerLinkForAddress(mint.publicKey, cluster);

  console.log(`\n✨ NFT created successfully!`);
  console.log(`📍 NFT address: ${mint.publicKey}`);
  console.log(`🔗 Explorer: ${explorerLink}`);

  return {
    mintAddress: mint.publicKey,
    metadataUri,
    imageUri,
    explorerLink,
    signature: signature.toString(),
  };
}

/**
 * Verify an NFT as part of a collection
 * @param umi - The Umi instance
 * @param nftAddress - The NFT mint address
 * @param collectionAddress - The collection mint address
 * @param cluster - The Solana cluster
 */
export async function verifyNFTCollection(
  umi: Umi,
  nftAddress: UmiPublicKey,
  collectionAddress: UmiPublicKey,
  cluster: "devnet" | "testnet" | "mainnet-beta"
): Promise<void> {
  console.log(`\n🔍 Verifying NFT as part of collection...`);
  console.log(`NFT: ${nftAddress}`);
  console.log(`Collection: ${collectionAddress}`);

  // Find the metadata PDA for the NFT
  const metadata = findMetadataPda(umi, { mint: nftAddress });

  // Verify the collection
  await verifyCollectionV1(umi, {
    metadata,
    collectionMint: collectionAddress,
    authority: umi.identity,
  }).sendAndConfirm(umi);

  const explorerLink = getExplorerLinkForAddress(nftAddress, cluster);

  console.log(`\n✅ NFT verified as part of collection!`);
  console.log(`🔗 Explorer: ${explorerLink}`);
}

/**
 * Update an NFT's metadata
 * @param umi - The Umi instance
 * @param nftAddress - The NFT mint address
 * @param updateData - Data to update
 * @param cluster - The Solana cluster
 * @param newImagePath - Optional new image to upload
 */
export async function updateNFT(
  umi: Umi,
  nftAddress: UmiPublicKey,
  updateData: NFTUpdateData,
  cluster: "devnet" | "testnet" | "mainnet-beta",
  newImagePath?: string
): Promise<void> {
  console.log(`\n🔄 Updating NFT: ${nftAddress}...`);

  // Fetch current NFT metadata
  const nft = await fetchMetadataFromSeeds(umi, { mint: nftAddress });

  // If new image provided, upload it and update metadata
  let uri = updateData.uri;
  if (newImagePath) {
    console.log(`📤 Uploading new image...`);
    const imageUri = await uploadImage(umi, newImagePath);

    // Upload new metadata with new image
    const metadataUri = await umi.uploader.uploadJson({
      name: updateData.name || nft.name,
      symbol: updateData.symbol || nft.symbol,
      description: (nft as any).description || "",
      image: imageUri,
      sellerFeeBasisPoints:
        updateData.sellerFeeBasisPoints !== undefined
          ? updateData.sellerFeeBasisPoints
          : nft.sellerFeeBasisPoints,
    });

    uri = metadataUri;
  }

  console.log(`🔨 Updating onchain metadata...`);

  // Update the NFT
  await updateV1(umi, {
    mint: nftAddress,
    authority: umi.identity,
    data: {
      ...nft,
      name: updateData.name || nft.name,
      symbol: updateData.symbol || nft.symbol,
      uri: uri || nft.uri,
      sellerFeeBasisPoints:
        updateData.sellerFeeBasisPoints !== undefined
          ? updateData.sellerFeeBasisPoints
          : nft.sellerFeeBasisPoints,
    },
    primarySaleHappened: updateData.primarySaleHappened ?? nft.primarySaleHappened,
    isMutable: updateData.isMutable ?? nft.isMutable,
  }).sendAndConfirm(umi);

  const explorerLink = getExplorerLinkForAddress(nftAddress, cluster);

  console.log(`\n✅ NFT updated successfully!`);
  console.log(`🔗 Explorer: ${explorerLink}`);
}

/**
 * Fetch NFT metadata
 * @param umi - The Umi instance
 * @param nftAddress - The NFT mint address
 * @returns NFT metadata
 */
export async function getNFTMetadata(umi: Umi, nftAddress: UmiPublicKey) {
  return await fetchMetadataFromSeeds(umi, { mint: nftAddress });
}

