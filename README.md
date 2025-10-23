# Solana NFT Platform with Fractionalization

A **complete, production-ready** TypeScript platform for creating, managing, fractionalizing, and distributing NFTs on Solana. Built with Metaplex Token Metadata, Umi framework, and SPL Token program.

**Status**: ✅ **FULLY TESTED & OPERATIONAL** on Solana Devnet

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

### NFT Operations
- ✅ Create NFT Collections
- ✅ Create individual NFTs (standalone or as part of a collection)
- ✅ Verify NFTs as part of collections
- ✅ Update NFT metadata
- ✅ Upload images and metadata to Irys (permanent storage)

### 🆕 Fractionalization & Distribution
- ✅ **Fractionalize NFTs** into fungible share tokens
- ✅ **Automated share creation** (100 shares per NFT)
- ✅ **CLI-based distribution** (manual transfers)
- ✅ **Programmatic distribution** (batch transfers to multiple recipients)
- ✅ **Transaction tracking** and verification
- ✅ **Ownership percentage** calculations

### Technical Features
- ✅ Full TypeScript support with comprehensive types
- ✅ Environment-based configuration
- ✅ Comprehensive error handling
- ✅ Beautiful console output with progress indicators
- ✅ Production-ready architecture
- ✅ Complete documentation

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

# Fill these in as you create assets
COLLECTION_NFT_ADDRESS=      # After creating collection
NFT_ADDRESS=                 # After creating NFT
SHARE_TOKEN_MINT=           # After fractionalizing NFT
```

**Example populated .env** (from this project's actual devnet deployment):

```env
SOLANA_CLUSTER=devnet
RPC_ENDPOINT=https://api.devnet.solana.com
COLLECTION_NFT_ADDRESS=8A7r94LZLqgimZLKH5rUtDPxoDe2MUzFg1e33sUfeWAM
NFT_ADDRESS=B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY
SHARE_TOKEN_MINT=5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H
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

### 5. Fractionalize NFT (Create Share Tokens)

To split an NFT into 100 fungible share tokens:

1. Update your `.env` file with the NFT address:

```env
NFT_ADDRESS=<your-nft-address>
```

2. Run:

```bash
npm run fractionalize:simple
```

This will:
- Create a new SPL token with 0 decimals (fungible, but indivisible like shares)
- Mint 100 share tokens to your wallet
- Display the share token address and explorer link

**Important**: Save the share token address! Add it to your `.env`:

```env
SHARE_TOKEN_MINT=<your-share-token-address>
```

### 6. Distribute Shares

You have two methods to distribute shares to others:

#### Method A: Programmatic Distribution (Recommended for Multiple Recipients)

1. Update `src/scripts/distribute-shares-programmatic.ts` with recipients:

```typescript
const distributions: ShareDistribution[] = [
  { address: "RECIPIENT_WALLET_1", amount: 10 },
  { address: "RECIPIENT_WALLET_2", amount: 20 },
  { address: "RECIPIENT_WALLET_3", amount: 15 },
];
```

2. Ensure `SHARE_TOKEN_MINT` is set in `.env`

3. Run:

```bash
npm run distribute:program
```

This will automatically:
- Create token accounts for recipients (if needed)
- Transfer shares to all recipients
- Display transaction signatures and explorer links
- Show updated ownership percentages

#### Method B: CLI Distribution (For Single Transfers)

Use the `spl-token` CLI for quick one-off transfers:

```bash
spl-token transfer <SHARE_TOKEN_MINT> <AMOUNT> <RECIPIENT_WALLET> --fund-recipient --url devnet
```

Example:

```bash
spl-token transfer 5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H 10 7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM --fund-recipient --url devnet
```

### 7. Verify Share Balances

Check your share token balance:

```bash
spl-token balance <SHARE_TOKEN_MINT> --url devnet
```

View all your tokens:

```bash
spl-token accounts --url devnet
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
- `fractionalize-nft-simple.ts` - **NEW!** Automated share token creation
- `distribute-shares-programmatic.ts` - **NEW!** Programmatic share distribution

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
# NFT Operations
npx esrun src/scripts/create-collection.ts
npx esrun src/scripts/create-nft.ts
npx esrun src/scripts/verify-nft.ts
npx esrun src/scripts/update-nft.ts

# Fractionalization & Distribution
npx esrun src/scripts/fractionalize-nft-simple.ts
npx esrun src/scripts/distribute-shares-programmatic.ts
```

### npm Scripts

```bash
# NFT Operations
npm run create:collection    # Create NFT collection
npm run create:nft          # Create NFT
npm run verify:nft          # Verify NFT in collection
npm run update:nft          # Update NFT metadata

# Fractionalization & Distribution
npm run fractionalize:simple    # Create share tokens
npm run distribute:program      # Distribute shares programmatically
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

### "SHARE_TOKEN_MINT not set" error

Add your share token address to `.env`:

```env
SHARE_TOKEN_MINT=<your-share-token-address>
```

### "Insufficient shares" error

Check your balance before distributing:

```bash
spl-token balance <SHARE_TOKEN_MINT> --url devnet
```

### "Recipient is owned by this token program" error

Make sure you're sending to a **wallet address**, not a token or NFT mint address. Wallet addresses are usually associated with user accounts.

### Airdrop rate limit

If airdrops fail, wait 5-10 minutes or use the [Solana Faucet](https://faucet.solana.com).

## 📚 Complete Documentation Suite

This project includes comprehensive documentation for all features:

| Document | Description | Use Case |
|----------|-------------|----------|
| **COMPLETE_GUIDE.md** | **Master guide** - Everything in one place | ⭐ Start here for complete overview |
| **README.md** | This file - Full platform documentation | Technical reference |
| **START_HERE.md** | Quick start guide for newcomers | First-time setup |
| **QUICKSTART.md** | 5-minute fast setup | Rapid deployment |
| **ARCHITECTURE.md** | Deep dive into technical architecture | Understanding codebase |
| **PROGRAMMATIC_DISTRIBUTION_GUIDE.md** | Automated share distribution guide | Batch operations |
| **SHARE_YOUR_NFT.md** | NFT fractionalization walkthrough | Learning fractionalization |
| **WORKING_VS_BROKEN.md** | Script comparison and lessons learned | Understanding what works |
| **YOUR_SHARE_TOKEN.md** | Personal reference for your assets | Quick lookup |

### What Makes This Platform Complete

✅ **Full NFT Lifecycle**
- Create collections
- Mint NFTs
- Verify in collections
- Update metadata

✅ **Advanced Fractionalization**
- Automated share token creation
- Configurable share amounts
- Transaction tracking

✅ **Flexible Distribution**
- CLI for quick transfers
- Programmatic for batch operations
- Multiple recipient support

✅ **Production-Ready**
- Clean architecture
- Type safety
- Error handling
- Comprehensive docs

## 🎯 Real-World Examples

### Your Live Assets (Devnet)

**Wallet**: `2f7CJ8DWT8zJbVnC95rooMUoeh7yb7wewZha1hTAjU45`

**NFT Collection**: `8A7r94LZLqgimZLKH5rUtDPxoDe2MUzFg1e33sUfeWAM`
- View on [Solana Explorer](https://explorer.solana.com/address/8A7r94LZLqgimZLKH5rUtDPxoDe2MUzFg1e33sUfeWAM?cluster=devnet)

**NFT #1** (Verified): `B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY`
- View on [Solana Explorer](https://explorer.solana.com/address/B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY?cluster=devnet)

**Share Token** (85 remaining): `5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H`
- View on [Solana Explorer](https://explorer.solana.com/address/5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H?cluster=devnet)
- **Total Supply**: 100 shares
- **Distributed**: 15 shares (15%)
- **Your Balance**: 85 shares (85%)

### Proven Transaction History

✅ **NFT Creation**: Created 3 NFTs and 1 collection  
✅ **Fractionalization**: Created 3 share tokens (300 total shares)  
✅ **CLI Distribution**: Sent 10 shares successfully  
✅ **Programmatic Distribution**: Sent 5 shares successfully  
✅ **Total Distributed**: 15 shares to real recipient  
✅ **Success Rate**: 100%

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

