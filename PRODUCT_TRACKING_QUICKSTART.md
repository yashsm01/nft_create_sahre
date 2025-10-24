# Product Tracking System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
```bash
# Already have from main project
npm install         ← Dependencies installed
solana-keygen new   ← Wallet created
solana airdrop 2    ← Funded with SOL
```

---

## 📝 Step-by-Step Guide

### Step 1: Create Batch Collection (1 minute)

```bash
npm run product:batch
```

**What it does:**
- Creates a batch collection NFT
- Groups all products from same manufacturing batch
- Stores batch-level information

**Customize in:** `src/scripts/create-batch-collection.ts`
```typescript
const batchConfig: BatchConfig = {
  batchId: "BATCH-2025-Q1-001",           // YOUR BATCH ID
  productLine: "Electronics",              // YOUR PRODUCT LINE
  productModel: "Model-X Pro",             // YOUR MODEL
  totalUnits: 1000,                        // EXPECTED UNITS
  manufacturingDate: "2025-01-15",         // TODAY'S DATE
  factoryLocation: "Factory-A",            // YOUR FACTORY
};
```

**Save output:**
```env
# Add to .env file
BATCH_COLLECTION_ADDRESS=<address-from-output>
```

---

### Step 2: Create Products (2 minutes)

**Option A: Single Product**
```bash
npm run product:create
```

**Option B: Multiple Products (Recommended)**
```bash
npm run product:create-batch
```

**Customize in:** `src/scripts/create-products-batch.ts`
```typescript
const count = 10;          // How many products
const startSequence = 1;   // Starting number
```

**Each product gets:**
- ✅ Unique serial number (PROD-2025-BATCH001-00001)
- ✅ Manufacturing details
- ✅ Quality inspection data
- ✅ Complete traceability

---

### Step 3: Verify Products (1 minute)

```bash
npm run product:verify
```

**Add to .env:**
```env
PRODUCT_NFT_ADDRESS=<product-nft-from-step-2>
```

**What verification does:**
- ✅ Links product to batch officially
- ✅ Marks as verified on blockchain
- ✅ Ready for customer verification

---

### Step 4: Generate QR Codes (1 minute)

**Use the explorer link from output:**
```
https://explorer.solana.com/address/<PRODUCT_NFT>?cluster=devnet
```

**Generate QR code:**
- Online: qr-code-generator.com
- Code: Use any QR library
- Print: Attach to products

**Customer scans → Verifies on blockchain!**

---

## 💡 Real-World Example

### Electronics Factory Workflow

**Morning:** Create batch for today's production
```bash
npm run product:batch
# BATCH-2025-01-23-ELECTRONICS
```

**During Manufacturing:** Create products as they're made
```bash
npm run product:create-batch
# Creates 100 products with serials
```

**Quality Check:** Verify products that pass QC
```bash
npm run product:verify
# Marks as verified
```

**Packaging:** Print QR codes, attach to products

**Shipping:** Products ready with blockchain certificates!

**Customer:** Scans QR → Instant verification ✅

---

## 📊 What Each Product Contains

```json
{
  "serial_number": "PROD-2025-BATCH001-00001",
  "batch_id": "BATCH-2025-Q1-001",
  "product_model": "Model-X Pro",
  "manufacturing_date": "2025-01-15",
  "factory": "Factory-A, Building-3, Line-7",
  "production_line": "Line-7",
  "operator": "John Doe (EMP-123)",
  "quality_grade": "A",
  "inspector": "Jane Smith (QA-456)",
  "weight": "250g",
  "dimensions": "150x80x10mm",
  "materials": ["Aluminum", "PCB", "LCD"],
  "warranty": "2 years"
}
```

---

## 🎯 Use Cases

### ✅ Anti-Counterfeiting
Customer scans QR → Blockchain verification → Authentic!

### ✅ Warranty Claims
NFT proves purchase date and authenticity

### ✅ Product Recalls
Find all products from affected batch instantly

### ✅ Supply Chain Tracking
Factory → Distributor → Customer (all on-chain)

### ✅ Secondary Market
Buyer verifies product history before purchase

---

## 💰 Cost (Devnet Free, Mainnet ~$0.40/product)

| Operation | Cost (SOL) | Cost (USD) |
|-----------|------------|------------|
| Batch Collection | 0.002 | $0.20 |
| Per Product NFT | 0.003 | $0.30 |
| Verification | 0.000005 | $0.0005 |

**1,000 Products:** ~$200-400 (protects against fraud & counterfeits!)

---

## 🔄 Complete Commands

```bash
# 1. Create batch
npm run product:batch

# 2. Create 10 products
npm run product:create-batch

# 3. Verify each product
npm run product:verify

# 4. View on explorer
# Use links from output
```

---

## 📖 Full Documentation

- **Architecture:** `PRODUCT_TRACKING_ARCHITECTURE.md` (800+ lines)
- **Decision Guide:** `assets/knowledge/NFT_VS_TOKEN_DECISION_GUIDE.md`
- **Main README:** `README.md`

---

## ✅ That's It!

You now have:
- ✅ Batch collection on blockchain
- ✅ Products with unique NFTs
- ✅ Complete traceability
- ✅ Anti-counterfeiting system
- ✅ Customer verification

**Next:** Integrate into your manufacturing process! 🚀
