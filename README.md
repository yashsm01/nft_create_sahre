# Solana Product Tracking & NFT Fractionalization Platform

A **complete, production-ready** TypeScript platform for product tracking, NFT management, and SPL token fractionalization on Solana blockchain. Built with Express.js, PostgreSQL, Metaplex Token Metadata, and SPL Token program.

**Status**: ✅ **FULLY OPERATIONAL** on Solana Devnet

---

## 🎯 Overview

This platform combines two powerful blockchain capabilities:

1. **Product Tracking System**: Create a complete NFT hierarchy for product authentication
   - Product Master NFT → Batch Collection NFT → Individual Item NFTs
   - Full product lifecycle tracking from manufacturing to end consumer
   - Blockchain-verified authenticity and provenance

2. **NFT Fractionalization**: Convert NFTs into tradeable share tokens
   - Split NFTs into fungible SPL tokens
   - Distribute shares to multiple stakeholders
   - Track ownership and transfers on-chain

---

## 🏗️ Architecture

```
hotel/
├── api/                      # REST API Layer
│   ├── controllers/          # Request handlers
│   │   ├── productController.ts
│   │   ├── batchController.ts
│   │   ├── itemController.ts
│   │   └── fractionalizeController.ts
│   ├── routes/              # API routes with Swagger docs
│   │   ├── productRoutes.ts
│   │   ├── batchRoutes.ts
│   │   ├── itemRoutes.ts
│   │   └── fractionalizeRoutes.ts
│   ├── models/              # Database models (Sequelize ORM)
│   │   ├── Product.ts
│   │   ├── Batch.ts
│   │   ├── Item.ts
│   │   ├── FractionalToken.ts
│   │   └── ShareTransfer.ts
│   ├── config/              # Configuration
│   │   ├── database.ts
│   │   └── swagger.ts
│   └── server.ts            # Express server
├── src/                     # Core Business Logic
│   ├── services/            # Blockchain services
│   │   ├── product.ts       # Product/Batch/Item NFT creation
│   │   └── fractionalize.ts # NFT fractionalization & distribution
│   ├── types/               # TypeScript interfaces
│   │   ├── product.ts
│   │   └── fractionalize.ts
│   ├── utils/               # Utility functions
│   │   ├── umi.ts           # Umi instance setup
│   │   ├── uploader.ts      # Irys uploader
│   │   └── solana.ts        # Solana utilities
│   └── config/              # Constants
├── assets/                  # Images & metadata
└── package.json
```

### Key Technologies

- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Blockchain**: Solana (Devnet/Mainnet)
- **NFT Standard**: Metaplex Token Metadata
- **Token Standard**: SPL Token Program
- **API Documentation**: Swagger/OpenAPI
- **File Storage**: Irys (permanent, decentralized)

---

## 🚀 Features

### 🏭 Product Tracking System

#### Three-Tier NFT Hierarchy

```
Product Master NFT (Non-Collection)
    ↓
Batch Collection NFT (Collection)
    ↓ (contains multiple)
Individual Item NFTs (Members)
```

#### Features

- ✅ **Product Master NFT**: Created automatically when product is registered
- ✅ **Batch Collection NFT**: Links to product, contains batch information
- ✅ **Item NFTs**: Individual product units with unique serial numbers
- ✅ **UUID-based IDs**: Products use UUIDs, GTIN is optional
- ✅ **Blockchain Explorer Links**: Every NFT includes explorer URL
- ✅ **Metadata Storage**: Permanent storage on Irys/Arweave
- ✅ **Full Provenance**: Track product from creation to consumer

#### Data Models

**Product**
- `id` (UUID) - Primary key
- `gtin` (optional) - Global Trade Item Number
- `productName`, `company`, `category`, `model`
- `nftMintAddress` - Product Master NFT address
- `nftMetadataUri` - Metadata JSON URI
- `nftExplorerLink` - Solana Explorer link

**Batch**
- `id` (UUID) - Primary key
- `productId` (UUID) - Foreign key to Product
- `batchName`, `manufacturingFacility`, `productionLine`
- `nftCollectionAddress` - Batch Collection NFT address
- `productNftReference` - Link to Product Master NFT

**Item**
- `id` (UUID) - Primary key
- `batchId` (UUID) - Foreign key to Batch
- `serialNumber`, `rfidTag`
- `nftMintAddress` - Individual Item NFT address
- `nftMetadataUri` - Metadata JSON URI
- `status` - Lifecycle status tracking

### 💎 NFT Fractionalization

#### Features

- ✅ **Convert NFTs to Fungible Tokens**: Split any NFT into SPL tokens
- ✅ **Configurable Shares**: Define total supply and share distribution
- ✅ **Token Metadata**: Add name, symbol, description, image to share tokens
- ✅ **Batch Distribution**: Send shares to multiple recipients in one call
- ✅ **Transfer Tracking**: Database records of all share distributions
- ✅ **Creator Attribution**: Track who created and distributed shares
- ✅ **Recipient Details**: Store recipient names, IDs, and transfer notes

#### Data Models

**FractionalToken**
- `id` (UUID) - Primary key
- `originalNftMint` - Original NFT that was fractionalized
- `shareTokenMint` - New fungible token address
- `tokenName`, `tokenSymbol` - Token metadata
- `totalShares` - Total supply of shares
- `creatorName`, `creatorId` - Who created it
- `metadataUri`, `explorerLink` - Blockchain links

**ShareTransfer**
- `id` (UUID) - Primary key
- `shareTokenMint` - Which token was transferred
- `fromWallet`, `toWallet` - Sender and recipient addresses
- `amount` - Number of shares transferred
- `recipientName`, `recipientId` - Recipient details
- `transferredBy` - Who initiated the transfer
- `transactionSignature` - Blockchain transaction hash
- `note` - Optional transfer note

---

## 📋 Prerequisites

- **Node.js** v16 or higher
- **PostgreSQL** 12 or higher
- **Solana CLI** (optional, for wallet management)
- **Solana Wallet** (keypair file)
- Basic understanding of Solana and NFTs

---

## 🔧 Installation

### 1. Clone and Install

```bash
cd hotel
npm install
```

### 2. Set Up PostgreSQL Database

Create a PostgreSQL database:

```sql
CREATE DATABASE hotel_tracking;
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_tracking
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

# Timezone (use standard IANA timezone)
TZ=Asia/Kolkata

# Solana Configuration
SOLANA_CLUSTER=devnet
SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
SOLANA_KEYPAIR_PATH=/home/user/.config/solana/id.json

# Image Upload Directory
IMAGE_UPLOAD_DIR=./uploads
```

### 4. Initialize Database

The database tables will be created automatically when you start the server.

```bash
npm run dev
```

### 5. Set Up Solana Wallet

If you don't have a keypair:

```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

Fund your devnet wallet:

```bash
solana airdrop 2 --url devnet
```

---

## 📖 API Usage

### Base URL

```
http://localhost:3000
```

### API Documentation

Interactive Swagger documentation available at:

```
http://localhost:3000/api-docs
```

---

## 🏭 Product Tracking APIs

### 1. Create Product with NFT

**Endpoint**: `POST /api/products`

**Description**: Creates a product and automatically generates a Product Master NFT on the blockchain.

**Request Body**:
```json
{
  "gtin": "1234567890123",
  "productName": "Premium Laptop",
  "company": "TechCorp",
  "category": "Electronics",
  "model": "XPS-15",
  "description": "High-performance laptop",
  "specifications": {
    "cpu": "Intel i7",
    "ram": "16GB",
    "storage": "512GB SSD"
  },
  "warrantyMonths": 24,
  "imageUrl": "https://example.com/laptop.jpg",
  "createNFT": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Product and NFT created successfully",
  "data": {
    "product": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "gtin": "1234567890123",
      "productName": "Premium Laptop",
      "company": "TechCorp",
      "nftMintAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "nftMetadataUri": "https://arweave.net/...",
      "nftExplorerLink": "https://explorer.solana.com/address/7xKXt...?cluster=devnet"
    },
    "blockchain": {
      "nftMintAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "explorerLink": "https://explorer.solana.com/address/7xKXt...?cluster=devnet",
      "metadataUri": "https://arweave.net/..."
    }
  }
}
```

**Key Points**:
- Product ID is a UUID (not GTIN)
- GTIN is optional
- NFT creation is automatic (can be disabled with `createNFT: false`)
- Product Master NFT is a non-collection NFT

---

### 2. Create Batch with Collection NFT

**Endpoint**: `POST /api/batches`

**Description**: Creates a batch and generates a Batch Collection NFT that references the Product Master NFT.

**Request Body**:
```json
{
  "productId": "550e8400-e29b-41d4-a716-446655440000",
  "batchName": "2025-Q1-Factory-A",
  "manufacturingFacility": "Factory-A, Mumbai",
  "productionLine": "Line-1",
  "startDate": "2025-10-26T14:49:31.383Z",
  "plannedQuantity": 1000,
  "imageUrl": "https://example.com/batch-qr.jpg"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Batch and NFT Collection created successfully",
  "data": {
    "batch": {
      "id": "660e8400-e29b-41d4-a716-446655440111",
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "batchName": "2025-Q1-Factory-A",
      "nftCollectionAddress": "9yKXtg3CW87d97TXJSDpbD5jBkheTqA83TZRuJosgBsV",
      "productNftReference": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    },
    "blockchain": {
      "collectionAddress": "9yKXtg3CW87d97TXJSDpbD5jBkheTqA83TZRuJosgBsV",
      "explorerLink": "https://explorer.solana.com/address/9yKXt...?cluster=devnet"
    }
  }
}
```

**Key Points**:
- Batch Collection NFT is created as a Metaplex Collection
- Metadata includes reference to Product Master NFT
- All items in this batch will be members of this collection

---

### 3. Create Item NFT

**Endpoint**: `POST /api/items`

**Description**: Creates an individual product item NFT as a member of the batch collection.

**Request Body**:
```json
{
  "batchId": "660e8400-e29b-41d4-a716-446655440111",
  "serialNumber": "SN-2025-001",
  "rfidTag": "RFID-ABC123",
  "manufacturingDate": "2025-10-26T10:00:00Z",
  "imageUrl": "https://example.com/item-qr.jpg"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Item and NFT created successfully",
  "data": {
    "item": {
      "id": "770e8400-e29b-41d4-a716-446655440222",
      "batchId": "660e8400-e29b-41d4-a716-446655440111",
      "serialNumber": "SN-2025-001",
      "rfidTag": "RFID-ABC123",
      "nftMintAddress": "AzKXtg4DW87d97TXJSDpbD5jBkheTqA83TZRuJosgCsW",
      "status": "manufactured"
    },
    "blockchain": {
      "nftMintAddress": "AzKXtg4DW87d97TXJSDpbD5jBkheTqA83TZRuJosgCsW",
      "explorerLink": "https://explorer.solana.com/address/AzKXt...?cluster=devnet",
      "verified": true
    }
  }
}
```

**Key Points**:
- Item NFT is automatically verified as a member of the Batch Collection
- Metadata includes both Product and Batch references
- Each item has a unique serial number and NFT address

---

### 4. Get Product by ID

**Endpoint**: `GET /api/products/:id`

**Example**: `GET /api/products/550e8400-e29b-41d4-a716-446655440000`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "gtin": "1234567890123",
    "productName": "Premium Laptop",
    "company": "TechCorp",
    "nftMintAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "nftExplorerLink": "https://explorer.solana.com/address/7xKXt...?cluster=devnet"
  }
}
```

---

### 5. Get Batch by ID

**Endpoint**: `GET /api/batches/:id`

**Example**: `GET /api/batches/660e8400-e29b-41d4-a716-446655440111`

---

### 6. Get Item by ID

**Endpoint**: `GET /api/items/:id`

**Example**: `GET /api/items/770e8400-e29b-41d4-a716-446655440222`

---

### 7. Update Item Status

**Endpoint**: `PATCH /api/items/:id/status`

**Request Body**:
```json
{
  "status": "shipped",
  "location": "Mumbai Warehouse"
}
```

**Available Statuses**:
- `manufactured` - Just created
- `in_warehouse` - In storage
- `in_transit` - Being shipped
- `delivered` - At destination
- `with_distributor` - At distributor
- `with_retailer` - At retail location
- `sold` - Sold to end customer

---

## 💎 Fractionalization APIs

### 1. Fractionalize NFT

**Endpoint**: `POST /api/fractionalize`

**Description**: Convert an NFT into fungible share tokens with metadata.

**Request Body**:
```json
{
  "nftMintAddress": "B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY",
  "totalShares": 100,
  "tokenName": "Premium Laptop Shares",
  "tokenSymbol": "LAPTOP",
  "creatorName": "John Doe",
  "creatorId": "user-123",
  "description": "Fractional ownership of Premium Laptop NFT",
  "imageUrl": "https://example.com/share-token.jpg"
}
```

**Response**:
```json
{
  "success": true,
  "message": "NFT fractionalized successfully",
  "data": {
    "fractionalToken": {
      "id": "880e8400-e29b-41d4-a716-446655440333",
      "originalNftMint": "B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY",
      "shareTokenMint": "5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H",
      "tokenName": "Premium Laptop Shares",
      "tokenSymbol": "LAPTOP",
      "totalShares": 100,
      "creatorName": "John Doe",
      "explorerLink": "https://explorer.solana.com/address/5VWBG...?cluster=devnet"
    }
  }
}
```

**Key Points**:
- Creates a new SPL Token with 0 decimals (indivisible shares)
- Uses hybrid approach: Metaplex for metadata + SPL Token for minting
- Mints all shares to creator's wallet initially
- Token metadata is stored on Irys/Arweave

---

### 2. Distribute Shares

**Endpoint**: `POST /api/fractionalize/distribute`

**Description**: Send shares to multiple recipients with tracking.

**Request Body**:
```json
{
  "shareTokenMintAddress": "5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H",
  "distributions": [
    {
      "recipientWallet": "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
      "amount": 10,
      "recipientName": "Alice Smith",
      "recipientId": "user-456",
      "note": "Initial investor allocation"
    },
    {
      "recipientWallet": "8Thg3Xn4oTjFH14GuWKoNaH4Uk68LHEUpNKd2pqGpnGN",
      "amount": 15,
      "recipientName": "Bob Johnson",
      "recipientId": "user-789",
      "note": "Advisor shares"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Shares distributed successfully",
  "data": {
    "totalRecipients": 2,
    "totalSharesDistributed": 25,
    "transfers": [
      {
        "recipientWallet": "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
        "recipientName": "Alice Smith",
        "amount": 10,
        "transactionSignature": "5j8k...",
        "explorerLink": "https://explorer.solana.com/tx/5j8k...?cluster=devnet",
        "transferredBy": "John Doe",
        "transferredAt": "2025-10-26T15:30:00Z"
      },
      {
        "recipientWallet": "8Thg3Xn4oTjFH14GuWKoNaH4Uk68LHEUpNKd2pqGpnGN",
        "recipientName": "Bob Johnson",
        "amount": 15,
        "transactionSignature": "6k9l...",
        "explorerLink": "https://explorer.solana.com/tx/6k9l...?cluster=devnet",
        "transferredBy": "John Doe",
        "transferredAt": "2025-10-26T15:30:05Z"
      }
    ]
  }
}
```

**Key Points**:
- Automatically creates token accounts for recipients if needed
- Tracks each transfer in the database
- Records recipient details and transfer notes
- Returns transaction signatures for verification

---

### 3. Get Fractionalization History

**Endpoint**: `GET /api/fractionalize/tokens/:nftMintAddress`

**Description**: Get fractionalization details for a specific NFT.

**Example**: `GET /api/fractionalize/tokens/B8ZrqDvtgQ2NuLn28m4FedbQE1ncSftUKJwDYWpNu2RY`

---

### 4. Get Share Transfer History

**Endpoint**: `GET /api/fractionalize/transfers/:shareTokenMint`

**Description**: Get all transfer history for a share token.

**Example**: `GET /api/fractionalize/transfers/5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H`

**Response**:
```json
{
  "success": true,
  "data": {
    "shareTokenMint": "5VWBGCtochHAJ993YbLVBwg8dp3hqpPPs31Whjr99M5H",
    "totalTransfers": 2,
    "totalDistributed": 25,
    "transfers": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440444",
        "toWallet": "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
        "recipientName": "Alice Smith",
        "amount": 10,
        "note": "Initial investor allocation",
        "transactionSignature": "5j8k...",
        "createdAt": "2025-10-26T15:30:00Z"
      }
    ]
  }
}
```

---

## 🛠️ Development

### Start Development Server

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Type Checking

```bash
npx tsc --noEmit
```

### Database Management

**Reset Database** (warning: deletes all data):
```bash
# In PostgreSQL
DROP DATABASE hotel_tracking;
CREATE DATABASE hotel_tracking;
```

Then restart the server to recreate tables.

---

## 🔐 Security Best Practices

### Wallet Security
- ✅ Never commit keypair files to version control
- ✅ Store keypair in secure location (`~/.config/solana/`)
- ✅ Use environment variables for sensitive paths
- ✅ Restrict file permissions: `chmod 600 ~/.config/solana/id.json`

### Database Security
- ✅ Use strong passwords
- ✅ Limit database user permissions
- ✅ Use SSL for production database connections
- ✅ Regular backups

### API Security
- ⚠️ Add authentication (JWT, API keys)
- ⚠️ Implement rate limiting
- ⚠️ Use HTTPS in production
- ⚠️ Validate all inputs

---

## 📊 Database Schema

### Products Table
```sql
CREATE TABLE "Products" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "gtin" VARCHAR(14),
  "productName" VARCHAR(255) NOT NULL,
  "company" VARCHAR(255) NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "nftMintAddress" VARCHAR(255),
  "nftMetadataUri" TEXT,
  "nftExplorerLink" TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

### Batches Table
```sql
CREATE TABLE "Batches" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "productId" UUID REFERENCES "Products"("id"),
  "batchName" VARCHAR(255) NOT NULL,
  "manufacturingFacility" VARCHAR(255),
  "productionLine" VARCHAR(100),
  "nftCollectionAddress" VARCHAR(255),
  "productNftReference" VARCHAR(255),
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

### Items Table
```sql
CREATE TABLE "Items" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "batchId" UUID REFERENCES "Batches"("id"),
  "serialNumber" VARCHAR(100) UNIQUE NOT NULL,
  "rfidTag" VARCHAR(100),
  "nftMintAddress" VARCHAR(255),
  "status" VARCHAR(50) DEFAULT 'manufactured',
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

### FractionalTokens Table
```sql
CREATE TABLE "FractionalTokens" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "originalNftMint" VARCHAR(255) NOT NULL,
  "shareTokenMint" VARCHAR(255) NOT NULL,
  "tokenName" VARCHAR(100),
  "tokenSymbol" VARCHAR(10),
  "totalShares" INTEGER NOT NULL,
  "creatorName" VARCHAR(255),
  "creatorId" VARCHAR(100),
  "metadataUri" TEXT,
  "explorerLink" TEXT,
  "createdAt" TIMESTAMP
);
```

### ShareTransfers Table
```sql
CREATE TABLE "ShareTransfers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "shareTokenMint" VARCHAR(255) NOT NULL,
  "fromWallet" VARCHAR(255) NOT NULL,
  "toWallet" VARCHAR(255) NOT NULL,
  "amount" INTEGER NOT NULL,
  "recipientName" VARCHAR(255),
  "recipientId" VARCHAR(100),
  "transferredBy" VARCHAR(255),
  "transactionSignature" VARCHAR(255),
  "note" TEXT,
  "createdAt" TIMESTAMP
);
```

---

## 🌐 NFT Hierarchy Explained

### Product Master NFT
- **Type**: Non-Collection NFT
- **Purpose**: Represents the product line/model
- **Created**: When product is registered
- **Contains**: Product details, specifications, company info
- **Unique per**: Product model

### Batch Collection NFT
- **Type**: Metaplex Collection NFT
- **Purpose**: Represents a manufacturing batch
- **Created**: When batch is created
- **Contains**: Batch details, manufacturing info, product reference
- **Unique per**: Manufacturing batch
- **Parent**: Product Master NFT (via metadata)

### Item NFT
- **Type**: Collection Member NFT
- **Purpose**: Represents individual product unit
- **Created**: When item is manufactured
- **Contains**: Serial number, RFID, batch reference, product reference
- **Unique per**: Physical product unit
- **Parent**: Batch Collection NFT (verified member)

### Verification Flow

```
1. Create Product → Product Master NFT minted
2. Create Batch → Batch Collection NFT minted (references product)
3. Create Item → Item NFT minted & verified in collection
4. Consumer scans → Verifies on blockchain → Sees full provenance
```

---

## 🎯 Use Cases

### Product Authentication
1. **Luxury Goods**: Prove authenticity of high-value items
2. **Electronics**: Track warranty and prevent counterfeits
3. **Pharmaceuticals**: Ensure supply chain integrity
4. **Automotive Parts**: Verify genuine OEM components

### NFT Fractionalization
1. **Investment**: Multiple investors own shares of valuable NFTs
2. **Collectibles**: Democratize access to expensive NFTs
3. **Real Estate**: Tokenize property ownership
4. **Art**: Share ownership of digital or physical art

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection details in .env
# Test connection
psql -h localhost -U postgres -d hotel_tracking
```

### "Insufficient SOL balance"
```bash
# For devnet
solana airdrop 2 --url devnet

# Check balance
solana balance --url devnet
```

### "Product NFT not found" when creating batch
- Ensure the product was created with `createNFT: true`
- Check product has `nftMintAddress` populated
- Verify the product ID (UUID) is correct

### "Timezone error" in DBeaver
- Update DBeaver connection properties
- Set `timezone` to standard IANA format (e.g., `Asia/Kolkata`)
- Remove any deprecated timezone names

### JSON parsing errors
- Use double quotes (`"`) for all JSON keys and string values
- Validate JSON format before sending requests
- Use Postman or curl for testing

---

## 📚 API Testing with curl

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Test Product",
    "company": "Test Company",
    "category": "Electronics",
    "createNFT": true
  }'
```

### Create Batch
```bash
curl -X POST http://localhost:3000/api/batches \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "YOUR_PRODUCT_UUID",
    "batchName": "Test Batch",
    "manufacturingFacility": "Factory A",
    "productionLine": "Line 1",
    "plannedQuantity": 100
  }'
```

### Create Item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "YOUR_BATCH_UUID",
    "serialNumber": "SN-001",
    "rfidTag": "RFID-001"
  }'
```

### Fractionalize NFT
```bash
curl -X POST http://localhost:3000/api/fractionalize \
  -H "Content-Type: application/json" \
  -d '{
    "nftMintAddress": "YOUR_NFT_ADDRESS",
    "totalShares": 100,
    "tokenName": "My Shares",
    "tokenSymbol": "SHARE",
    "creatorName": "John Doe",
    "creatorId": "user-123"
  }'
```

---

## 📖 Additional Resources

### Solana
- [Solana Documentation](https://docs.solana.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Explorer](https://explorer.solana.com/)

### Metaplex
- [Metaplex Documentation](https://developers.metaplex.com/)
- [Umi Framework](https://github.com/metaplex-foundation/umi)
- [Token Metadata Standard](https://developers.metaplex.com/token-metadata)

### SPL Token
- [SPL Token Documentation](https://spl.solana.com/token)
- [Token Program Guide](https://docs.solana.com/developing/runtime-facilities/programs#token-program)

### Development Tools
- [Swagger Documentation](https://swagger.io/docs/)
- [Sequelize ORM](https://sequelize.org/)
- [Express.js](https://expressjs.com/)

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js and PostgreSQL
- [ ] Clone repository and run `npm install`
- [ ] Create PostgreSQL database
- [ ] Configure `.env` file
- [ ] Set up Solana keypair
- [ ] Start server: `npm run dev`
- [ ] Access Swagger docs: `http://localhost:3000/api-docs`
- [ ] Create your first product with NFT
- [ ] Create a batch and items
- [ ] Try fractionalizing an NFT
- [ ] Test share distribution

---

## 📄 License

MIT License - Feel free to use this project for commercial or personal projects.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review Swagger API documentation
3. Check Solana Explorer for transaction details
4. Review server logs for detailed error messages

---

**Built with ❤️ using Solana, Metaplex, and Express.js**

**Happy Building! 🚀🏭💎**
