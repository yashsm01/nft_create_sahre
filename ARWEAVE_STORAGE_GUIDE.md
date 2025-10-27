# 🌐 Arweave Storage Configuration Guide

## Your Arweave Wallet

**Address:** `i1my-YLe7oes8B9244h6SY-UgFwtJ0E3xUmbrHZHAB4`

**Explorer:** https://viewblock.io/arweave/address/i1my-YLe7oes8B9244h6SY-UgFwtJ0E3xUmbrHZHAB4

---

## 📦 How Storage Works

Your system uses **Irys (formerly Bundlr)** to upload data permanently to Arweave. Here's the workflow:

```
Your API → Irys Service → Arweave Blockchain
   ↓           ↓              ↓
 (SOL)    (Bundling)    (Permanent Storage)
```

### Key Components:

1. **Solana Keypair** (`/home/user/.config/solana/id.json`)
   - Used to sign transactions
   - Used to pay for Irys uploads (with SOL)
   - Identifies your Irys account

2. **Irys Service** (`https://devnet.irys.xyz`)
   - Bundles small uploads efficiently
   - Handles Arweave posting
   - Accepts SOL as payment

3. **Arweave Network**
   - Stores data permanently (forever!)
   - Returns URLs like: `https://arweave.net/[transaction-id]`

---

## 💰 Funding Your Irys Account

### Devnet (Testing):
```bash
# Get free devnet SOL
solana airdrop 2

# Your Irys account is automatically funded when you upload
# (uses SOL from your Solana wallet)
```

### Mainnet (Production):

1. **Fund with SOL:**
   - Visit: https://irys.xyz
   - Connect your Solana wallet
   - Deposit SOL to your Irys balance

2. **Check Balance:**
   ```bash
   # Visit the Irys website or use their CLI
   npm install -g @irys/sdk
   irys balance [your-solana-address] -n mainnet -t solana
   ```

---

## 📊 Cost Estimates

### Current Rates (Approximate):
- **NFT Metadata** (~2KB): **~0.00001 SOL** ($0.000002 USD)
- **Product Image** (~500KB): **~0.0025 SOL** ($0.0005 USD)
- **Large Image** (~2MB): **~0.01 SOL** ($0.002 USD)

### Formula:
```
Cost (SOL) ≈ Size (KB) × 0.000005
```

> **Note:** Costs vary based on network conditions. Devnet costs are usually lower or free.

---

## 🔍 Verify Your Uploads

### 1. Check Arweave Configuration:
```bash
curl http://localhost:3000/api/products/arweave/config
```

### 2. View Uploaded Metadata:
```bash
# Get NFT details
curl http://localhost:3000/api/products/nft/[MINT_ADDRESS]

# Get metadata from URI
curl "http://localhost:3000/api/products/metadata?uri=https://arweave.net/[TX_ID]"
```

### 3. View on Arweave Explorer:
- **ViewBlock:** https://viewblock.io/arweave
- **Arweave:** https://arweave.net/[transaction-id]

---

## 🚀 How Your System Uses Arweave

### Product Creation:
```
1. Create Product → Upload metadata to Arweave (via Irys)
2. Get permanent URI → Store in NFT on-chain
3. NFT points to → Immutable Arweave data
```

### Data Stored:
```json
{
  "name": "Samsung Galaxy S23",
  "description": "Premium smartphone",
  "image": "https://arweave.net/image-id",
  "attributes": [
    { "trait_type": "GTIN", "value": "8801643828486" },
    { "trait_type": "Company", "value": "Samsung" },
    { "trait_type": "Category", "value": "Electronics" }
  ],
  "properties": {
    "gtin": "8801643828486",
    "manufacturer": "Samsung",
    "warranty_months": 12,
    "batch_id": "uuid-here"
  }
}
```

---

## 🔧 Technical Details

### Environment Variables:
```bash
# Already configured in /home/user/hotel/.env
ARWEAVE_WALLET_ADDRESS=i1my-YLe7oes8B9244h6SY-UgFwtJ0E3xUmbrHZHAB4
IRYS_URL=https://devnet.irys.xyz
SOLANA_CLUSTER=devnet
```

### Upload Process (Code):
```typescript
// 1. Create metadata
const metadata = {
  name: "Product Name",
  description: "Product description",
  image: imageUrl,
  attributes: [...]
};

// 2. Upload via Umi (uses Irys automatically)
const metadataUri = await umi.uploader.uploadJson(metadata);

// 3. Result: https://arweave.net/[transaction-id]
console.log(`Uploaded: ${metadataUri}`);
```

---

## ⚡ Quick Start

### 1. Check Configuration:
```bash
curl http://localhost:3000/api/products/arweave/config
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "arweaveWallet": {
      "address": "i1my-YLe7oes8B9244h6SY-UgFwtJ0E3xUmbrHZHAB4",
      "isConfigured": true,
      "explorerLink": "https://viewblock.io/arweave/address/..."
    },
    "irysConfig": {
      "network": "devnet",
      "endpoint": "https://devnet.irys.xyz",
      "paymentToken": "SOL"
    },
    "estimatedCosts": {
      "metadataUpload": {
        "sizeKB": 2,
        "costSOL": 0.00001
      }
    }
  }
}
```

### 2. Create a Product (Auto-uploads to Arweave):
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Test Product",
    "company": "Your Company",
    "category": "Electronics",
    "description": "This metadata will be stored on Arweave!"
  }'
```

### 3. Verify Upload:
```bash
# Get the product
curl http://localhost:3000/api/products/[PRODUCT_ID]

# Check the nftMetadataUri field
# Visit that URL in browser - it's on Arweave!
```

---

## 🛡️ Data Permanence

### Why Arweave?
- ✅ **Permanent Storage** - Pay once, store forever
- ✅ **Immutable** - Data cannot be changed or deleted
- ✅ **Decentralized** - No single point of failure
- ✅ **Verifiable** - All data is cryptographically verified

### What This Means for Your Products:
- NFT metadata is **permanent** and **cannot be altered**
- Product information is **tamper-proof**
- Your data survives even if your API goes offline
- Complete **audit trail** on blockchain

---

## 📱 API Endpoints

### Get Arweave Configuration:
```bash
GET /api/products/arweave/config
```

### Get NFT Details (includes Arweave URIs):
```bash
GET /api/products/nft/{mintAddress}
```

### Get Metadata from Arweave URI:
```bash
GET /api/products/metadata?uri={arweaveUri}
```

---

## 🔗 Useful Links

- **Your Arweave Wallet:** https://viewblock.io/arweave/address/i1my-YLe7oes8B9244h6SY-UgFwtJ0E3xUmbrHZHAB4
- **Irys Devnet:** https://devnet.irys.xyz
- **Irys Mainnet:** https://irys.xyz
- **Arweave Explorer:** https://viewblock.io/arweave
- **Irys Documentation:** https://docs.irys.xyz
- **Swagger API Docs:** http://localhost:3000/api-docs

---

## ❓ FAQ

### Q: Do I need an Arweave wallet file (.json)?
**A:** No! Irys handles the Arweave interaction. You just need:
- SOL in your Solana wallet
- The address tracked for reference (already configured)

### Q: How do I fund uploads?
**A:** 
- **Devnet:** Automatic when you have devnet SOL
- **Mainnet:** Visit https://irys.xyz and deposit SOL

### Q: Can I change uploaded metadata?
**A:** No, Arweave data is permanent. You can:
- Upload new metadata (creates new URI)
- Update NFT to point to new URI
- Old URI remains accessible forever

### Q: What if I run out of SOL?
**A:**
- **Devnet:** Run `solana airdrop 2`
- **Mainnet:** Buy SOL and deposit to Irys

### Q: How much SOL do I need?
**A:** For typical use:
- 100 product NFTs ≈ 0.001 SOL
- 1000 products ≈ 0.01 SOL
- Very affordable!

---

## 🎯 Next Steps

1. ✅ **Arweave wallet configured**
2. ✅ **Irys uploader active**
3. ✅ **API endpoints ready**

**You're all set!** Every NFT you create will automatically store its metadata on Arweave through Irys. 🚀

For questions or issues, check the Swagger docs at: http://localhost:3000/api-docs

