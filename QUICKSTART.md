# Quick Start Guide

Get started with creating Solana NFTs in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Wallet

```bash
# Generate a new Solana keypair (if you don't have one)
solana-keygen new

# Check your wallet address
solana address
```

### 3. Add Images

Download and add these sample images to `assets/images/`:

```bash
cd assets/images

# Download collection image
curl -o collection.png https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/metaplex-umi/collection.png

# Download NFT image  
curl -o nft.png https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/metaplex-umi/nft.png

cd ../..
```

## 📝 Create Your First NFT Collection

### Step 1: Create Collection
```create key-pair
solana-keygen new --no-bip39-passphrase


```

```bash
solana airdrop 2 2f7CJ8DWT8zJbVnC95rooMUoeh7yb7wewZha1hTAjU45 --url devnet

solana balance --url devnet

npm run create:collection


```

**Output:**
```
🚀 Starting Collection Creation Process
📡 Cluster: devnet
🔑 Loaded keypair: ABC123...
💰 Wallet balance: 1 SOL
🎨 Creating collection: My Collection...
📤 Image uploaded: https://arweave.net/...
📤 Metadata uploaded: https://arweave.net/...
🔨 Minting collection NFT...
✨ Collection created successfully!
📍 Collection address: XYZ789...
```

**Important:** Copy the collection address!

### Step 2: Update .env

Create a `.env` file (or the project already has one):

```env
COLLECTION_NFT_ADDRESS=<paste-your-collection-address-here>
```

### Step 3: Create NFT

```bash
npm run create:nft
```

**Output:**
```
🎨 Creating NFT: My NFT...
📤 Image uploaded: https://arweave.net/...
📤 Metadata uploaded: https://arweave.net/...
🔨 Minting NFT...
✨ NFT created successfully!
📍 NFT address: DEF456...
```

**Important:** Copy the NFT address!

### Step 4: Update .env with NFT Address

```env
COLLECTION_NFT_ADDRESS=<your-collection-address>
NFT_ADDRESS=<paste-your-nft-address-here>
```

### Step 5: Verify NFT in Collection

```bash
npm run verify:nft
```

**Output:**
```
🔍 Verifying NFT as part of collection...
✅ NFT verified as part of collection!
```

### Step 6: View on Explorer

Click the explorer links in the output to view your NFTs on Solana Explorer!

## 🎨 Customize Your NFT

### Customize Collection

Edit `src/scripts/create-collection.ts`:

```typescript
const collectionConfig: CollectionConfig = {
  name: "Awesome Apes",           // ← Your collection name
  symbol: "APES",                  // ← Your symbol
  description: "10,000 unique apes", // ← Your description
  imageFile: path.resolve("assets/images", "collection.png"),
  sellerFeeBasisPoints: 500,       // ← 5% royalty (500 = 5%)
};
```

### Customize NFT

Edit `src/scripts/create-nft.ts`:

```typescript
const nftConfig: NFTConfig = {
  name: "Ape #1",                  // ← NFT name
  symbol: "APE",                   // ← NFT symbol
  description: "A rare ape",       // ← Description
  imageFile: path.resolve("assets/images", "nft.png"),
  sellerFeeBasisPoints: 500,       // ← 5% royalty
  attributes: [                    // ← NFT traits
    { trait_type: "Fur", value: "Golden" },
    { trait_type: "Background", value: "Purple" },
    { trait_type: "Rarity", value: "Legendary" },
  ],
};
```

## 📊 Project Structure at a Glance

```
hotel/
├── src/
│   ├── scripts/          # ← Run these files
│   │   ├── create-collection.ts
│   │   ├── create-nft.ts
│   │   ├── verify-nft.ts
│   │   └── update-nft.ts
│   ├── services/         # ← Business logic
│   ├── utils/            # ← Helper functions
│   ├── types/            # ← TypeScript types
│   └── config/           # ← Configuration
├── assets/
│   └── images/           # ← Put your images here
├── package.json
└── README.md
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run create:collection` | Create a new collection |
| `npm run create:nft` | Create a new NFT |
| `npm run verify:nft` | Verify NFT in collection |
| `npm run update:nft` | Update NFT metadata |

## 🔄 Update NFT

To update an existing NFT:

1. Make sure `NFT_ADDRESS` is set in `.env`

2. Edit `src/scripts/update-nft.ts`:

```typescript
const updateData: NFTUpdateData = {
  name: "New NFT Name",
  sellerFeeBasisPoints: 1000,  // 10% royalty
};
```

3. Run:

```bash
npm run update:nft
```

## 🌐 Switch Networks

### Devnet (Default - Free)
```env
SOLANA_CLUSTER=devnet
```

### Testnet
```env
SOLANA_CLUSTER=testnet
```

### Mainnet (Real SOL)
```env
SOLANA_CLUSTER=mainnet-beta
```

## 💡 Pro Tips

### Tip 1: Save Addresses
Always save your collection and NFT addresses! Add them to `.env` immediately.

### Tip 2: Check Explorer
After each operation, check the Solana Explorer link to verify everything worked.

### Tip 3: Test on Devnet First
Always test your NFTs on devnet before moving to mainnet.

### Tip 4: Royalties
- `sellerFeeBasisPoints: 0` = 0% royalty
- `sellerFeeBasisPoints: 500` = 5% royalty
- `sellerFeeBasisPoints: 1000` = 10% royalty
- Maximum: 10000 (100%)

### Tip 5: Image Sizes
Use high-quality images (at least 1000x1000 pixels) for best results.

## ❓ Common Issues

### "Insufficient balance"
**Solution:** The script auto-airdrops SOL on devnet. Just run it again.

### "Collection address not found"
**Solution:** Set `COLLECTION_NFT_ADDRESS` in your `.env` file.

### "Image not found"
**Solution:** Make sure your images are in `assets/images/` directory.

### "Keypair not found"
**Solution:** Run `solana-keygen new` to create a wallet.

## 📖 Next Steps

1. ✅ Created collection
2. ✅ Created NFT
3. ✅ Verified NFT
4. 🔜 Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the code
5. 🔜 Customize the scripts for your use case
6. 🔜 Create multiple NFTs
7. 🔜 Deploy to mainnet

## 🎯 What You Built

Congratulations! You now have:

- ✅ A verified NFT collection on Solana
- ✅ An NFT that's part of that collection
- ✅ Permanent storage on Irys/Arweave
- ✅ Full metadata with attributes
- ✅ A scalable codebase for creating more NFTs

## 🚀 Scale Up

Want to create 100, 1000, or 10,000 NFTs?

The architecture is ready for it! You can:

1. Create a loop in the scripts
2. Read NFT data from a CSV/JSON file
3. Batch upload images
4. Create multiple NFTs in parallel

For large collections, consider using:
- [Metaplex Sugar](https://docs.metaplex.com/tools/sugar/) - CLI for candy machine
- [Metaplex Candy Machine](https://docs.metaplex.com/programs/candy-machine/) - For large drops

---

**Happy Building! 🎨**

For more details, see [README.md](README.md) and [ARCHITECTURE.md](ARCHITECTURE.md)

