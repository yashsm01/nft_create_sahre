# Solana NFT Project with Metaplex

A comprehensive, well-architected TypeScript project for creating, managing, and updating NFTs on Solana using the Metaplex Token Metadata program and Umi framework.

## 🏗️ Architecture

This project follows a modular, service-oriented architecture with clear separation of concerns:

```
hotel/
├── src/
│   ├── config/           # Configuration and constants
│   ├── utils/            # Utility functions (Umi setup, uploader, helpers)
│   ├── services/         # Business logic (collection, NFT, metadata services)
│   ├── scripts/          # Executable scripts for NFT operations
│   └── types/            # TypeScript type definitions
├── assets/
│   ├── images/           # NFT and collection images
│   └── metadata/         # Metadata templates
├── package.json
├── tsconfig.json
└── README.md
```

### Architecture Benefits

- **Modularity**: Each service has a single responsibility
- **Reusability**: Utilities and services can be imported and used anywhere
- **Type Safety**: Full TypeScript support with comprehensive types
- **Maintainability**: Clean code structure makes updates easy
- **Scalability**: Easy to add new features and NFT operations

## 🚀 Features

- ✅ Create NFT Collections
- ✅ Create individual NFTs (standalone or as part of a collection)
- ✅ Verify NFTs as part of collections
- ✅ Update NFT metadata
- ✅ Upload images and metadata to Irys (permanent storage)
- ✅ Full TypeScript support
- ✅ Environment-based configuration
- ✅ Comprehensive error handling
- ✅ Beautiful console output with progress indicators

## 📋 Prerequisites

- Node.js v16 or higher
- A Solana wallet (keypair file)
- Basic understanding of Solana and NFTs

## 🔧 Installation

1. **Clone or navigate to the project directory**

```bash
cd hotel
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up your Solana wallet**

If you don't have a Solana keypair, generate one:

```bash
solana-keygen new
```

This will create a keypair at `~/.config/solana/id.json` by default.

4. **Add your NFT images**

Place your images in the `assets/images/` directory:
- `collection.png` - Your collection cover image
- `nft.png` - Your NFT image

You can download sample images from:
- [Collection image](https://github.com/solana-developers/professional-education/blob/main/labs/metaplex-umi/collection.png)
- [NFT image](https://github.com/solana-developers/professional-education/blob/main/labs/metaplex-umi/nft.png)

5. **Configure environment (optional)**

The project works out of the box with devnet. To customize, create a `.env` file:

```env
# Solana Configuration
SOLANA_CLUSTER=devnet
RPC_ENDPOINT=https://api.devnet.solana.com

# Fill these in after creating your collection and NFT
COLLECTION_NFT_ADDRESS=
NFT_ADDRESS=
```

## 📖 Usage

### 1. Create a Collection

```bash
npm run create:collection
```

This will:
- Upload your collection image to Irys
- Create metadata for the collection
- Mint a collection NFT on Solana
- Display the collection address and explorer link

**Important**: Save the collection address displayed in the console!

### 2. Create an NFT

After creating a collection, you can create NFTs as part of that collection.

**Option A: Update .env with collection address**

```env
COLLECTION_NFT_ADDRESS=<your-collection-address>
```

Then run:

```bash
npm run create:nft
```

**Option B: Create standalone NFT**

Just run the command without setting `COLLECTION_NFT_ADDRESS`:

```bash
npm run create:nft
```

This will:
- Upload your NFT image to Irys
- Create metadata for the NFT
- Mint the NFT on Solana
- Associate it with the collection (if address provided)
- Display the NFT address and explorer link

**Important**: Save the NFT address!

### 3. Verify NFT in Collection

To officially verify an NFT as part of a collection:

1. Update your `.env` file with both addresses:

```env
COLLECTION_NFT_ADDRESS=<your-collection-address>
NFT_ADDRESS=<your-nft-address>
```

2. Run:

```bash
npm run verify:nft
```

This sets the `verified` field to `true`, which is important for marketplaces and wallets to recognize the NFT as part of the collection.

### 4. Update NFT Metadata

To update an existing NFT's metadata:

1. Ensure `NFT_ADDRESS` is set in `.env`

2. Edit the update configuration in `src/scripts/update-nft.ts`:

```typescript
const updateData: NFTUpdateData = {
  name: "Updated NFT Name",
  sellerFeeBasisPoints: 500, // 5% royalty
  primarySaleHappened: true,
  isMutable: true,
};
```

3. Run:

```bash
npm run update:nft
```

## 🏛️ Architecture Details

### Core Modules

#### **Configuration** (`src/config/`)
- `constants.ts` - All project constants and environment config

#### **Types** (`src/types/`)
- `index.ts` - TypeScript interfaces for NFTs, collections, and configurations

#### **Utilities** (`src/utils/`)
- `umi.ts` - Umi instance creation and setup
- `uploader.ts` - Image and metadata upload to Irys
- `helpers.ts` - Common helper functions

#### **Services** (`src/services/`)
- `collection.ts` - Collection creation and management
- `nft.ts` - NFT creation, update, and verification
- `metadata.ts` - Metadata preparation and validation

#### **Scripts** (`src/scripts/`)
- `create-collection.ts` - Executable script to create collections
- `create-nft.ts` - Executable script to create NFTs
- `verify-nft.ts` - Executable script to verify NFTs
- `update-nft.ts` - Executable script to update NFTs

### Data Flow

1. **Script Layer**: User runs npm command → script file
2. **Service Layer**: Script calls service functions (collection, NFT, metadata)
3. **Utility Layer**: Services use utilities (Umi, uploader, helpers)
4. **External APIs**: Utilities interact with Solana and Irys

```
User Command
    ↓
Script (create-nft.ts)
    ↓
Service (nft.ts) → Validates config
    ↓
Utility (uploader.ts) → Uploads to Irys
    ↓
Utility (umi.ts) → Interacts with Solana
    ↓
Blockchain (NFT created)
```

## 🛠️ Customization

### Modify NFT/Collection Configuration

Edit the configuration in the respective script files:

**For Collections** (`src/scripts/create-collection.ts`):

```typescript
const collectionConfig: CollectionConfig = {
  name: "Your Collection Name",
  symbol: "SYMBOL",
  description: "Your collection description",
  imageFile: path.resolve("assets/images", "your-image.png"),
  sellerFeeBasisPoints: 500, // 5% royalty
};
```

**For NFTs** (`src/scripts/create-nft.ts`):

```typescript
const nftConfig: NFTConfig = {
  name: "Your NFT Name",
  symbol: "SYMBOL",
  description: "Your NFT description",
  imageFile: path.resolve("assets/images", "your-nft.png"),
  sellerFeeBasisPoints: 0,
  attributes: [
    { trait_type: "Rarity", value: "Legendary" },
    { trait_type: "Power", value: 100 },
  ],
};
```

### Add Custom Services

Create new service files in `src/services/` and import them in your scripts:

```typescript
// src/services/my-custom-service.ts
export async function myCustomFunction(umi: Umi) {
  // Your custom logic
}
```

## 📚 Key Concepts

### NFTs on Solana

NFTs on Solana are SPL tokens with:
- 0 decimals (indivisible)
- Supply of 1 (only one exists)
- Null mint authority (supply can't change)
- Associated metadata account

### Metaplex Token Metadata

The Token Metadata program:
- Creates a Program Derived Address (PDA) for metadata
- Stores onchain metadata (name, symbol, URI)
- Links to offchain metadata (JSON with image, attributes, etc.)

### Umi Framework

Umi is Metaplex's framework for interacting with Solana programs:
- Provides a unified interface
- Handles transaction signing
- Manages program interactions
- Includes uploader plugins (Irys, NFT.Storage, etc.)

## 🔐 Security Notes

- Never commit your keypair files to version control
- `.gitignore` is configured to exclude keypair files
- Store private keys securely
- Use environment variables for sensitive configuration

## 📝 Development

### Type Checking

```bash
npx tsc --noEmit
```

### Run Individual Scripts

```bash
npx esrun src/scripts/create-collection.ts
npx esrun src/scripts/create-nft.ts
npx esrun src/scripts/verify-nft.ts
npx esrun src/scripts/update-nft.ts
```

## 🌐 Networks

The project supports all Solana clusters:

- `devnet` - For development and testing (default)
- `testnet` - For final testing before mainnet
- `mainnet-beta` - For production

Change the cluster in your `.env` file or `src/config/constants.ts`.

## 🐛 Troubleshooting

### "Insufficient balance" error

Run the create command again - it will automatically airdrop SOL on devnet.

### "Collection address not found"

Make sure you've set `COLLECTION_NFT_ADDRESS` in your `.env` file.

### "Image not found"

Ensure your image files are in the `assets/images/` directory.

### TypeScript errors

Run `npm install` to ensure all dependencies are installed.

## 📖 Additional Resources

- [Solana Documentation](https://docs.solana.com/)
- [Metaplex Documentation](https://developers.metaplex.com/)
- [Umi Framework](https://github.com/metaplex-foundation/umi)
- [Solana Cookbook](https://solanacookbook.com/)

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy NFT Building! 🎨🚀**

