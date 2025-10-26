# 🎨 Product Master NFT Feature

## Overview

The Product Tracking API now supports a complete NFT hierarchy:

```
Product Master NFT (GTIN-based)
    ↓
Batch Collection NFT (Manufacturing run)
    ↓
Individual Item NFTs (Serial numbers)
```

## ✨ What's New

### 1. **Product Master NFT**
   - Each product (GTIN) can now have its own NFT on Solana blockchain
   - Contains product metadata: name, company, category, specifications, warranty
   - Acts as the master reference for all batches and items

### 2. **Batch Reference to Product NFT**
   - Batches now store a reference to their product's NFT
   - Creates a verifiable chain: Product → Batch → Items

### 3. **Complete Traceability**
   - Product NFT → Batch Collection → Item NFTs
   - Full blockchain verification at every level

---

## 📊 Database Changes

### Product Model
Added new fields:
- `nftMintAddress` - Product Master NFT address on Solana
- `nftMetadataUri` - Arweave/IPFS URI for NFT metadata
- `nftExplorerLink` - Solana Explorer link

### Batch Model
Added new field:
- `productNftReference` - Reference to Product Master NFT address

---

## 🚀 API Endpoints

### Create Product Master NFT

**Endpoint:** `POST /api/products/{gtin}/nft`

Creates a Product Master NFT for an existing product.

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/products/8901234567890/nft
```

**Example Response:**
```json
{
  "success": true,
  "message": "Product Master NFT created successfully",
  "data": {
    "product": {
      "id": 1,
      "gtin": "8901234567890",
      "productName": "Model-X Pro",
      "company": "TechCorp Industries",
      "category": "Electronics",
      "nftMintAddress": "7xK...xyz",
      "nftMetadataUri": "https://arweave.net/...",
      "nftExplorerLink": "https://explorer.solana.com/address/7xK...xyz?cluster=devnet"
    },
    "blockchain": {
      "nftMintAddress": "7xK...xyz",
      "explorerLink": "https://explorer.solana.com/address/7xK...xyz?cluster=devnet",
      "metadataUri": "https://arweave.net/..."
    }
  }
}
```

---

## 📝 Usage Flow

### Step 1: Create Product
```bash
POST /api/products
{
  "gtin": "8901234567890",
  "productName": "Model-X Pro",
  "company": "TechCorp Industries",
  "category": "Electronics",
  "model": "MXP-2025",
  "description": "Premium electronics product",
  "warrantyMonths": 24,
  "imageUrl": "https://example.com/product.jpg"
}
```

### Step 2: Create Product Master NFT
```bash
POST /api/products/8901234567890/nft
```

This will:
- ✅ Create an NFT on Solana blockchain
- ✅ Upload metadata to Arweave
- ✅ Store NFT address in database
- ✅ Return explorer link

### Step 3: Create Batch (with Product NFT Reference)
```bash
POST /api/batches
{
  "productId": '550e8400-e29b-41d4-a716-446655440000',
  "batchName": "2025-Q1-Factory-A",
  "manufacturingFacility": "Factory-A, Mumbai",
  "productionLine": "Line-1",
  "startDate": "2025-01-15",
  "plannedQuantity": 1000
}
```

This will:
- ✅ Create a Batch Collection NFT
- ✅ Reference the Product Master NFT
- ✅ Link batch to product on blockchain

**Response includes:**
```json
{
  "blockchain": {
    "productNft": "7xK...xyz",                    // Product Master NFT
    "productNftExplorer": "https://...",
    "batchCollectionAddress": "8yL...abc",       // Batch Collection
    "batchExplorerLink": "https://...",
    "batchMetadataUri": "https://arweave.net/..."
  }
}
```

### Step 4: Create Individual Item NFTs
```bash
POST /api/items
{
  "batchId": 1,
  "serialNumber": "PROD-2025-BATCH001-00001",
  "manufacturingDate": "2025-01-16",
  "manufacturingOperator": "John Doe",
  "qualityStatus": "PASSED",
  "qualityInspector": "Jane Smith"
}
```

This will:
- ✅ Create individual item NFT
- ✅ Link to batch collection
- ✅ Complete the hierarchy: Product → Batch → Item

---

## 🔍 Verification & Tracking

### Check Product NFT
```bash
GET /api/products/8901234567890
```

Response includes NFT information:
```json
{
  "nftMintAddress": "7xK...xyz",
  "nftMetadataUri": "https://arweave.net/...",
  "nftExplorerLink": "https://explorer.solana.com/..."
}
```

### Check Batch with Product Reference
```bash
GET /api/batches/1
```

Response includes:
```json
{
  "productNftReference": "7xK...xyz",          // Product Master NFT
  "nftCollectionAddress": "8yL...abc",         // Batch Collection
  "metadata": {
    "productNft": "7xK...xyz",
    "productNftExplorer": "https://..."
  }
}
```

### Verify Item Chain
```bash
GET /api/items/:serial/verify
```

Returns complete verification chain:
- Item NFT → Batch Collection → Product Master NFT

---

## 🎯 Benefits

### 1. **Complete Traceability**
   - Every item can be traced back to the master product definition
   - Verifiable on blockchain at every level

### 2. **Product Authentication**
   - Product Master NFT serves as proof of authenticity
   - Batches and items inherit from verified product

### 3. **Supply Chain Transparency**
   - Track product from definition → manufacturing → individual items
   - All data verifiable on Solana blockchain

### 4. **Counterfeit Prevention**
   - Only authorized products have NFTs
   - Batches must reference valid product NFTs
   - Items must belong to valid batches

---

## 📦 Metadata Structure

### Product Master NFT Metadata
```json
{
  "name": "Model-X Pro",
  "symbol": "PROD567890",
  "description": "Master product definition for Model-X Pro (GTIN: 8901234567890) by TechCorp Industries",
  "image": "https://example.com/product.jpg",
  "attributes": [
    { "trait_type": "GTIN", "value": "8901234567890" },
    { "trait_type": "Company", "value": "TechCorp Industries" },
    { "trait_type": "Category", "value": "Electronics" },
    { "trait_type": "Model", "value": "MXP-2025" },
    { "trait_type": "Warranty", "value": "24 months" }
  ],
  "properties": {
    "category": "product_master",
    "gtin": "8901234567890",
    "company": "TechCorp Industries",
    "product_category": "Electronics",
    "model": "MXP-2025",
    "warranty_months": 24
  }
}
```

---

## 🛠️ Technical Details

### Service Function
- **Function:** `createProductMasterNFT()`
- **Location:** `src/services/product.ts`
- **Uses:** Metaplex Token Metadata Program
- **Storage:** Arweave (via Umi)

### Controller
- **Function:** `createProductNFT()`
- **Location:** `api/controllers/productController.ts`
- **Validation:** Checks if product exists and doesn't already have NFT

### Models Updated
1. **Product** - Added NFT fields
2. **Batch** - Added productNftReference field

---

## ⚠️ Important Notes

1. **Create Product First**
   - You must create the product before creating its NFT
   - Product must have a valid GTIN

2. **One NFT Per Product**
   - Each product can only have one master NFT
   - Attempting to create a second NFT returns error 409

3. **Optional for Batches**
   - Batches can be created without a product NFT
   - But having a product NFT creates a verified chain

4. **Blockchain Costs**
   - Creating NFTs requires SOL for transaction fees
   - Uses devnet by default (free test SOL)

---

## 🧪 Testing

### Test the Complete Flow

1. **Create Product**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "gtin": "8901234567890",
    "productName": "Model-X Pro",
    "company": "TechCorp Industries",
    "category": "Electronics"
  }'
```

2. **Create Product NFT**
```bash
curl -X POST http://localhost:3000/api/products/8901234567890/nft
```

3. **Create Batch** (references product NFT automatically)
```bash
curl -X POST http://localhost:3000/api/batches \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "batchName": "2025-Q1-A",
    "manufacturingFacility": "Factory-A",
    "productionLine": "Line-1",
    "startDate": "2025-01-15",
    "plannedQuantity": 100
  }'
```

4. **Create Item NFT**
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": 1,
    "serialNumber": "PROD-2025-Q1A-00001",
    "manufacturingDate": "2025-01-16",
    "manufacturingOperator": "John Doe"
  }'
```

---

## 📚 Resources

- **Swagger Docs:** http://localhost:3000/api-docs
- **Solana Explorer:** https://explorer.solana.com/?cluster=devnet
- **Metaplex Docs:** https://docs.metaplex.com/

---

## 🎊 Summary

You now have a complete 3-tier NFT hierarchy:

1. **Product Master NFT** - The source of truth for the product
2. **Batch Collection NFT** - Manufacturing run linked to product
3. **Item NFTs** - Individual items linked to batch and product

All verifiable on Solana blockchain! 🚀



