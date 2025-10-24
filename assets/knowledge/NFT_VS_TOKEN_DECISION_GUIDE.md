# NFT vs Fungible Token - Complete Decision Guide

## 🎯 Quick Decision

**When building on Solana, which should you use?**

| Use Case | Technology | Reason |
|----------|-----------|--------|
| **Product Tracking** | ✅ NFT (Metaplex) | Each product is unique |
| **Fractionalization** | ✅ Fungible Token (SPL) | Shares are identical |
| **Collectibles** | ✅ NFT (Metaplex) | Each item is unique |
| **Currency/Points** | ✅ Fungible Token (SPL) | All units identical |
| **Membership Cards** | ✅ NFT (Metaplex) | Individual member IDs |
| **Loyalty Rewards** | ✅ Fungible Token (SPL) | Points are fungible |

---

## 📊 Complete Comparison

### NFT (Non-Fungible Token)

**Technology:** Metaplex Token Metadata Program

**Characteristics:**
- Each token is UNIQUE and DIFFERENT
- Has rich metadata (name, description, image, attributes)
- Cannot be divided or exchanged 1:1
- Like: Houses, cars, artwork, identity cards

**Best For:**
✅ Unique items that need individual tracking  
✅ Items with different properties/values  
✅ Authenticity verification needed  
✅ Ownership history important  
✅ Each item needs metadata  

**Examples:**
- Product serial numbers
- Digital art
- Event tickets (numbered seats)
- Real estate deeds
- Identity documents
- Certificates
- Supply chain tracking

---

### Fungible Token

**Technology:** SPL Token Program

**Characteristics:**
- All tokens are IDENTICAL and INTERCHANGEABLE
- Minimal metadata (just name and symbol)
- Can be divided (with decimals) or whole
- Like: Money, shares, points, commodities

**Best For:**
✅ Identical units of value  
✅ Currency or points systems  
✅ Fractional ownership shares  
✅ Commodity trading  
✅ Reward systems  

**Examples:**
- Share tokens (fractionalization)
- Cryptocurrency
- Loyalty points
- Company shares
- Stablecoins
- Game currencies

---

## 🏭 Use Case 1: Product Tracking & Traceability

### Scenario
You're a factory manufacturing products. Each product needs:
- Unique serial number
- Batch tracking
- Quality certification
- Ownership tracking
- Authenticity verification

### ✅ Solution: NFT per Product (Metaplex)

#### Architecture

```
Product Line Collection
    │
    ├─ Batch-2025-Q1-001 (Sub-collection)
    │   ├─ Product NFT #1 (Serial: P-2025-001-0001)
    │   ├─ Product NFT #2 (Serial: P-2025-001-0002)
    │   └─ Product NFT #1000
    │
    └─ Batch-2025-Q1-002 (Sub-collection)
        ├─ Product NFT #1 (Serial: P-2025-002-0001)
        └─ ...
```

#### Metadata Structure

```json
{
  "name": "Product #P-2025-001-0001",
  "symbol": "PROD2025",
  "description": "Factory-manufactured product with blockchain certificate",
  "image": "https://arweave.net/product-image",
  "attributes": [
    {
      "trait_type": "Serial Number",
      "value": "P-2025-001-0001"
    },
    {
      "trait_type": "Batch Number",
      "value": "BATCH-2025-Q1-001"
    },
    {
      "trait_type": "Manufacturing Date",
      "value": "2025-01-15"
    },
    {
      "trait_type": "Factory Location",
      "value": "Factory-A, Building-3, Line-7"
    },
    {
      "trait_type": "Quality Grade",
      "value": "Grade-A"
    },
    {
      "trait_type": "Inspector",
      "value": "John Doe (ID: EMP-123)"
    },
    {
      "trait_type": "Weight",
      "value": "2.5 kg"
    },
    {
      "trait_type": "Warranty Expiry",
      "value": "2027-01-15"
    }
  ],
  "properties": {
    "batch_id": "BATCH-2025-Q1-001",
    "production_line": "Line-7",
    "qr_code_data": "PROD-QR-2025-001-0001",
    "certifications": ["ISO9001", "CE", "RoHS"],
    "materials": ["Steel", "Plastic", "Copper"],
    "inspection_passed": true,
    "defects": []
  }
}
```

#### Workflow

```
1. Batch Created
   └─> Create Batch Collection NFT

2. Product Manufactured
   └─> Create Product NFT
       ├─ Assign unique serial number
       ├─ Add to batch collection
       ├─ Record manufacturing details
       └─ Generate QR code

3. Quality Check
   └─> Update NFT metadata
       └─ Add inspection results

4. Packaging
   └─> Print QR code on product
       └─ Links to NFT on blockchain

5. Shipping
   └─> Transfer NFT ownership
       └─ Factory → Distributor

6. Retail Sale
   └─> Transfer NFT ownership
       └─ Distributor → Customer

7. Customer Verification
   └─> Scan QR code
       ├─ Check NFT on blockchain
       ├─ Verify authenticity
       └─ View product history

8. Resale (Secondary Market)
   └─> Transfer NFT ownership
       └─ Customer → New Owner
       └─ Maintains warranty & history
```

#### Benefits

**Anti-Counterfeiting:**
- ✅ Each product has unique blockchain identity
- ✅ Cannot duplicate NFT
- ✅ Instant verification via QR code
- ✅ Immutable proof of authenticity

**Supply Chain Tracking:**
- ✅ Complete ownership history on-chain
- ✅ Track journey: Factory → Distributor → Customer
- ✅ All transfers timestamped
- ✅ Transparent and auditable

**Quality Assurance:**
- ✅ Store quality test results on-chain
- ✅ Track inspector approval
- ✅ Record defects or issues
- ✅ Maintain warranty information

**Recall Management:**
- ✅ Identify affected products by batch
- ✅ Find all products from specific batch
- ✅ Contact all current owners
- ✅ Track recall compliance

**Secondary Market:**
- ✅ Verify product authenticity
- ✅ Check complete ownership history
- ✅ Transfer ownership securely
- ✅ Maintain warranty validity

#### Cost Analysis

| Scale | Cost (SOL) | Cost (USD @ $100/SOL) |
|-------|------------|----------------------|
| 100 products | 0.2-0.4 | $20-$40 |
| 1,000 products | 2-4 | $200-$400 |
| 10,000 products | 20-40 | $2,000-$4,000 |

**ROI Considerations:**
- Prevents counterfeits
- Builds brand trust
- Reduces fraud losses
- Enables premium pricing
- Supports warranty claims
- Facilitates recalls

**Suitable for:**
- Luxury goods
- Electronics
- Pharmaceuticals
- Automotive parts
- High-value items

#### ❌ Why NOT Fungible Tokens?

**Problem:**
```
Customer: "Is my product genuine?"
You: "Yes, you have 1 token from Batch-001"
Customer: "But which specific product is it?"
You: "We can't tell... all tokens are identical"
Customer: "How do I verify authenticity?"
You: "Uh... you can't verify individual products"
❌ FAILS!
```

**Issues:**
- ❌ Cannot distinguish individual products
- ❌ No unique serial numbers
- ❌ Cannot verify specific product authenticity
- ❌ Products become interchangeable (they shouldn't be!)
- ❌ No individual metadata
- ❌ No ownership history per product

---

## 💰 Use Case 2: NFT Fractionalization

### Scenario
You own a valuable NFT and want to split ownership into 100 shares that people can trade.

### ✅ Solution: Fungible Share Tokens (SPL Token)

#### Architecture

```
Original NFT (Unique artwork)
    ↓
Creates 100 Fungible Share Tokens
    ↓
Distributes to investors
    - Investor A: 40 shares (40%)
    - Investor B: 30 shares (30%)
    - Investor C: 20 shares (20%)
    - Investor D: 10 shares (10%)
```

#### How It Works

```typescript
// 1. Create SPL Token (share tokens)
const mint = await createMint(
  connection,
  payer,
  payer.publicKey,  // Mint authority
  null,             // Freeze authority
  0                 // 0 decimals - whole shares only
);

// 2. Mint 100 shares to creator
await mintTo(
  connection,
  payer,
  mint,
  creatorTokenAccount,
  payer,
  100  // Total shares
);

// 3. Distribute shares to investors
await transfer(
  connection,
  payer,
  creatorTokenAccount,
  investorTokenAccount,
  payer,
  40  // 40 shares to Investor A
);
```

#### Benefits

**For Investors:**
- ✅ Own fraction of expensive NFT
- ✅ Trade shares on DEX
- ✅ Liquid investment
- ✅ Lower entry cost

**For NFT Owner:**
- ✅ Raise capital
- ✅ Share ownership
- ✅ Maintain some ownership
- ✅ Enable price discovery

**Technical:**
- ✅ Standard SPL Token
- ✅ Works with all DEXs
- ✅ Compatible with all wallets
- ✅ Low transaction costs
- ✅ Simple implementation

#### Cost Analysis

| Operation | Cost (SOL) | Cost (USD @ $100/SOL) |
|-----------|------------|----------------------|
| Create share token | 0.002 | $0.20 |
| Transfer shares | 0.000005 | $0.0005 |
| 100 transfers | 0.0005 | $0.05 |

**Much cheaper than using NFTs for shares!**

#### ❌ Why NOT NFTs for Shares?

**Problems:**
- ❌ Each share would be different (but they should be identical!)
- ❌ Higher costs (metadata overhead)
- ❌ Not standard for DEXs
- ❌ Complex trading
- ❌ Unnecessary features (metadata, collections)
- ❌ Non-standard approach

**All shares should be equal:**
- Share #1 = Share #2 = Share #3
- All have same value
- All are interchangeable
- Like stock certificates

---

## 🏭 Real-World Examples

### NFT Use Cases (Metaplex)

**1. LVMH (Louis Vuitton)**
- Uses: Aura blockchain for luxury goods
- Each bag = 1 NFT
- Tracks: Manufacturing, ownership, authenticity
- Result: Reduced counterfeits by 80%

**2. Nike**
- Uses: NFT certificates for sneakers
- Each pair = 1 NFT with unique ID
- Enables: Authenticity verification, resale tracking
- Result: Trust in secondary market

**3. Breitling Watches**
- Uses: Digital passports for watches
- Each watch = 1 NFT
- Includes: Manufacturing date, warranty, service history
- Result: Enhanced customer trust

**4. Mercedes-Benz**
- Uses: NFTs for car parts
- Each part = 1 NFT
- Tracks: Manufacturing, installation, recalls
- Result: Improved safety & traceability

**5. Walmart Food Tracking**
- Uses: NFTs for produce batches
- Each batch = 1 NFT
- Tracks: Farm origin, transport, storage
- Result: Faster recall response (7 days → 2 seconds)

### Fungible Token Use Cases (SPL Token)

**1. Bridgesplit**
- Uses: Fractional NFT ownership
- Share tokens = SPL Token
- Enables: Multiple investors per NFT
- Result: $50M+ in fractionalized NFTs

**2. Fraction.art**
- Uses: NFT fractionalization platform
- Share tokens = SPL Token
- Features: DEX integration, governance
- Result: Liquid NFT markets

**3. Solvent**
- Uses: NFT liquidity protocol
- Share tokens = SPL Token
- Enables: Instant NFT liquidity
- Result: Better price discovery

**4. USDC on Solana**
- Uses: Stablecoin
- Token = SPL Token
- Features: All dollars identical
- Result: Standard currency

**5. Bonk (Meme Coin)**
- Uses: Community token
- Token = SPL Token
- Features: Fungible, tradeable
- Result: Wide adoption, DEX integration

---

## 🎯 Decision Framework

### Ask These Questions:

#### 1. **Are items unique or identical?**
- **Unique** → NFT ✅
- **Identical** → Fungible Token ✅

#### 2. **Need individual tracking?**
- **Yes** → NFT ✅
- **No** → Fungible Token ✅

#### 3. **Need rich metadata per item?**
- **Yes** → NFT ✅
- **No** → Fungible Token ✅

#### 4. **Items interchangeable?**
- **No** → NFT ✅
- **Yes** → Fungible Token ✅

#### 5. **Need ownership history?**
- **Per item** → NFT ✅
- **Just balance** → Fungible Token ✅

#### 6. **Cost sensitivity?**
- **High value items** → NFT ✅ (worth the cost)
- **Low value/high volume** → Fungible Token ✅ (cheaper)

---

## 💻 Technical Comparison

### Creating NFT (Metaplex)

```typescript
import { createNft } from "@metaplex-foundation/mpl-token-metadata";

const nft = await createNft(umi, {
  mint: nftMint,
  name: "Product #12345",
  symbol: "PROD",
  uri: "https://arweave.net/metadata.json",
  sellerFeeBasisPoints: percentAmount(0),
  creators: [
    {
      address: umi.identity.publicKey,
      verified: true,
      share: 100,
    },
  ],
  collection: {
    key: collectionMint.publicKey,
    verified: false,
  },
}).sendAndConfirm(umi);

// Cost: ~0.002-0.004 SOL per NFT
// Features: Rich metadata, collections, verification
// Use for: Unique items
```

### Creating Fungible Token (SPL Token)

```typescript
import { createMint, mintTo } from "@solana/spl-token";

const mint = await createMint(
  connection,
  payer,
  mintAuthority,
  freezeAuthority,
  0  // decimals
);

await mintTo(
  connection,
  payer,
  mint,
  destination,
  authority,
  100  // amount
);

// Cost: ~0.002 SOL per token type (not per unit!)
// Features: Simple, fungible, DEX-compatible
// Use for: Identical units
```

---

## 📊 Cost Comparison

### Scenario: 1000 Items

**Option 1: NFTs (Unique Products)**
```
Create 1000 NFTs:
- Cost: 1000 × 0.003 SOL = 3 SOL (~$300)
- Each item tracked individually
- Rich metadata per item
- Individual ownership history
```

**Option 2: Fungible Tokens (Shares)**
```
Create 1 token type, mint 1000 units:
- Cost: 0.002 SOL (~$0.20) for token creation
- All units identical
- Simple metadata
- Balance tracking only
```

**Conclusion:**
- NFTs cost more per item → Use for high-value, unique items
- Fungible tokens cost less → Use for identical units

---

## 🛠️ Implementation Guide

### For Product Tracking (NFTs)

**Scripts Needed:**
1. `create-batch-collection.ts` - Create batch collection
2. `create-product-nft.ts` - Mint individual product NFTs
3. `update-product-nft.ts` - Add quality check data
4. `transfer-product.ts` - Transfer ownership
5. `verify-product.ts` - Verify authenticity

**Metadata Template:**
```json
{
  "name": "Product #{SERIAL}",
  "symbol": "{PRODUCT_CODE}",
  "description": "{PRODUCT_DESCRIPTION}",
  "image": "{PRODUCT_IMAGE_URL}",
  "attributes": [
    { "trait_type": "Serial Number", "value": "{SERIAL}" },
    { "trait_type": "Batch", "value": "{BATCH}" },
    { "trait_type": "Date", "value": "{DATE}" },
    { "trait_type": "Factory", "value": "{FACTORY}" },
    { "trait_type": "Inspector", "value": "{INSPECTOR}" }
  ]
}
```

### For Fractionalization (Fungible Tokens)

**Scripts Needed:**
1. `fractionalize-nft.ts` - Create share tokens
2. `distribute-shares.ts` - Send shares to investors
3. `check-ownership.ts` - View share distribution

**Example:**
```bash
# Create 100 share tokens
npm run fractionalize:simple

# Distribute to investors
npm run distribute:program
```

---

## ⚠️ Common Mistakes

### Mistake 1: Using Fungible Tokens for Unique Items
```
❌ WRONG: Creating fungible tokens for products
Result: Cannot track individual products
Fix: Use NFTs instead
```

### Mistake 2: Using NFTs for Identical Shares
```
❌ WRONG: Creating 100 different NFTs for share tokens
Result: Higher costs, DEX incompatibility
Fix: Use fungible tokens instead
```

### Mistake 3: Using Metaplex for Simple Tokens
```
❌ WRONG: Using createFungible() for share tokens
Result: "Incorrect account owner" errors
Fix: Use SPL Token createMint() instead
```

---

## 🎓 Key Takeaways

### NFTs (Metaplex) - Use When:
✅ Each item is UNIQUE  
✅ Need individual tracking  
✅ Need rich metadata  
✅ Authenticity verification important  
✅ High-value items  

**Examples:** Products, collectibles, certificates, memberships

### Fungible Tokens (SPL) - Use When:
✅ All units are IDENTICAL  
✅ Need DEX compatibility  
✅ Lower costs important  
✅ Simple balance tracking  
✅ High-volume transactions  

**Examples:** Shares, currency, points, commodities

---

## 📚 Additional Resources

### Documentation
- [Solana SPL Token Program](https://spl.solana.com/token)
- [Metaplex Token Metadata](https://developers.metaplex.com/)
- [Umi Framework](https://github.com/metaplex-foundation/umi)

### Tools
- [Solana Explorer](https://explorer.solana.com/)
- [Metaplex NFT Standard](https://docs.metaplex.com/programs/token-metadata/)
- [SPL Token CLI](https://spl.solana.com/token#command-line-utility)

### Examples
- This project's NFT creation: `src/scripts/create-nft.ts`
- This project's fractionalization: `src/scripts/fractionalize-nft-simple.ts`
- This project's distribution: `src/scripts/distribute-shares-programmatic.ts`

---

## 🤝 Contributing

Found a new use case? Have questions? Want to add examples?

Update this guide and help others make the right decision!

---

**Last Updated:** October 23, 2025  
**Version:** 1.0  
**Status:** ✅ Complete Reference Guide

---

## 📞 Quick Reference Card

```
═════════════════════════════════════════════════════════════
                    QUICK DECISION TREE
═════════════════════════════════════════════════════════════

Question: Are all items IDENTICAL?
    │
    ├─ YES → Use Fungible Token (SPL Token)
    │        Examples: Shares, currency, points
    │
    └─ NO → Are items UNIQUE?
            │
            └─ YES → Use NFT (Metaplex)
                     Examples: Products, art, certificates

═════════════════════════════════════════════════════════════
                    TECHNOLOGY MAPPING
═════════════════════════════════════════════════════════════

Product Tracking        → NFT (Metaplex) ✅
NFT Fractionalization   → Fungible Token (SPL) ✅
Digital Collectibles    → NFT (Metaplex) ✅
Reward Points          → Fungible Token (SPL) ✅
Membership Cards       → NFT (Metaplex) ✅
Company Shares         → Fungible Token (SPL) ✅

═════════════════════════════════════════════════════════════
```

