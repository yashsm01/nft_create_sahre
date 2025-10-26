# 🔨 NFT Fractionalization with Metadata Guide

## 📋 Overview

This guide explains how to use the enhanced fractionalization API that now includes:
- **Token Name & Symbol** for share tokens
- **Creator Information** (name and ID)
- **Rich Metadata** (description, image, attributes)
- **Transfer Tracking** (recipient name/ID, notes)
- **Database Storage** for all fractionalization and transfer records

---

## 🆕 What's New?

### 1. **Token Metadata**
Share tokens now have full Metaplex metadata including:
- Custom name and symbol
- Description
- Image URL
- Creator information
- On-chain attributes (original NFT, total shares, creator, timestamp)

### 2. **Transfer Tracking**
All share distributions are now tracked with:
- Recipient name and ID
- Transfer notes
- Complete history in database
- Easy querying and reporting

### 3. **Database Integration**
Two new tables:
- `fractional_tokens` - Stores fractionalized NFT information
- `share_transfers` - Tracks all share token transfers

---

## 🚀 API Endpoints

### **1. Fractionalize NFT with Metadata**

**Endpoint:** `POST /api/fractionalize`

**Request Body:**
```json
{
  "nftMintAddress": "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV",
  "tokenName": "Premium Art Shares",
  "tokenSymbol": "PARTSH",
  "creatorName": "John Doe",
  "creatorId": "CREATOR-001",
  "description": "Fractional ownership of premium digital art",
  "imageUrl": "https://arweave.net/your-image",
  "totalShares": 100,
  "shareDecimals": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "NFT fractionalized successfully with metadata",
  "data": {
    "nftMintAddress": "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV",
    "shareTokenMint": "8Xyz...",
    "tokenName": "Premium Art Shares",
    "tokenSymbol": "PARTSH",
    "totalShares": 100,
    "decimals": 0,
    "creator": {
      "address": "2f7CJ8DWT8zJbVnC95rooMUoeh7yb7wewZha1hTAjU45",
      "name": "John Doe",
      "id": "CREATOR-001"
    },
    "metadata": {
      "description": "Fractional ownership of premium digital art",
      "imageUrl": "https://arweave.net/your-image",
      "metadataUri": "https://arweave.net/metadata-json"
    },
    "ownerAddress": "2f7CJ8DWT8zJbVnC95rooMUoeh7yb7wewZha1hTAjU45",
    "ownerBalance": "100",
    "explorerLink": "https://explorer.solana.com/address/8Xyz...?cluster=devnet"
  }
}
```

---

### **2. Distribute Shares with Tracking**

**Endpoint:** `POST /api/fractionalize/distribute`

**Request Body:**
```json
{
  "shareTokenMint": "8Xyz...",
  "distributions": [
    {
      "recipient": "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
      "recipientName": "Alice Johnson",
      "recipientId": "USER-001",
      "amount": 25,
      "note": "Initial distribution"
    },
    {
      "recipient": "9AbC...",
      "recipientName": "Bob Smith",
      "recipientId": "USER-002",
      "amount": 25,
      "note": "Co-owner allocation"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Shares distributed successfully",
  "data": {
    "shareTokenMint": "8Xyz...",
    "tokenName": "Premium Art Shares",
    "tokenSymbol": "PARTSH",
    "totalDistributed": 50,
    "recipientCount": 2,
    "successCount": 2,
    "distributions": [
      {
        "recipient": "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
        "recipientName": "Alice Johnson",
        "recipientId": "USER-001",
        "amount": 25,
        "status": "success",
        "signature": "5Jxy..."
      },
      {
        "recipient": "9AbC...",
        "recipientName": "Bob Smith",
        "recipientId": "USER-002",
        "amount": 25,
        "status": "success",
        "signature": "6Kyz..."
      }
    ],
    "senderBalance": {
      "before": "100",
      "after": "50"
    },
    "explorerLinks": [
      "https://explorer.solana.com/tx/5Jxy...?cluster=devnet",
      "https://explorer.solana.com/tx/6Kyz...?cluster=devnet"
    ]
  }
}
```

---

### **3. Get Share Token Info**

**Endpoint:** `GET /api/fractionalize/token/:shareTokenMint`

**Response:**
```json
{
  "success": true,
  "message": "Share token info retrieved successfully",
  "data": {
    "shareTokenMint": "8Xyz...",
    "supply": "100",
    "decimals": 0,
    "mintAuthority": null,
    "freezeAuthority": null,
    "explorerLink": "https://explorer.solana.com/address/8Xyz...?cluster=devnet"
  }
}
```

---

## 📊 Database Schema

### **fractional_tokens Table**
```sql
CREATE TABLE fractional_tokens (
  id SERIAL PRIMARY KEY,
  nft_mint_address VARCHAR(255) UNIQUE NOT NULL,
  share_token_mint VARCHAR(255) UNIQUE NOT NULL,
  token_name VARCHAR(32) NOT NULL,
  token_symbol VARCHAR(10) NOT NULL,
  total_shares INTEGER NOT NULL,
  decimals INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url VARCHAR(255),
  metadata_address VARCHAR(255),
  metadata_uri VARCHAR(255),
  creator_address VARCHAR(255) NOT NULL,
  creator_name VARCHAR(255) NOT NULL,
  creator_id VARCHAR(255),
  explorer_link VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### **share_transfers Table**
```sql
CREATE TABLE share_transfers (
  id SERIAL PRIMARY KEY,
  share_token_mint VARCHAR(255) NOT NULL,
  token_name VARCHAR(255) NOT NULL,
  token_symbol VARCHAR(255) NOT NULL,
  from_address VARCHAR(255) NOT NULL,
  from_name VARCHAR(255),
  from_id VARCHAR(255),
  to_address VARCHAR(255) NOT NULL,
  to_name VARCHAR(255),
  to_id VARCHAR(255),
  amount VARCHAR(255) NOT NULL,
  signature VARCHAR(255) UNIQUE NOT NULL,
  explorer_link VARCHAR(255) NOT NULL,
  note TEXT,
  transferred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

---

## 🔍 Querying Transfer History

### **Get all transfers for a token:**
```sql
SELECT 
  token_name,
  token_symbol,
  from_address,
  from_name,
  to_address,
  to_name,
  amount,
  note,
  transferred_at,
  explorer_link
FROM share_transfers
WHERE share_token_mint = '8Xyz...'
ORDER BY transferred_at DESC;
```

### **Get recipient history:**
```sql
SELECT 
  token_name,
  token_symbol,
  amount,
  from_name,
  note,
  transferred_at
FROM share_transfers
WHERE to_address = '7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM'
ORDER BY transferred_at DESC;
```

### **Get sender history:**
```sql
SELECT 
  token_name,
  token_symbol,
  amount,
  to_name,
  note,
  transferred_at
FROM share_transfers
WHERE from_address = '2f7CJ8DWT8zJbVnC95rooMUoeh7yb7wewZha1hTAjU45'
ORDER BY transferred_at DESC;
```

---

## 💡 Use Cases

### **1. Investment Syndicates**
```json
{
  "tokenName": "Startup Equity Shares",
  "tokenSymbol": "STARTUP",
  "creatorName": "Investment Fund LLC",
  "creatorId": "FUND-001",
  "description": "Fractional equity in Tech Startup XYZ",
  "distributions": [
    {
      "recipientName": "Investor A",
      "recipientId": "INV-001",
      "amount": 30
    },
    {
      "recipientName": "Investor B",
      "recipientId": "INV-002",
      "amount": 20
    }
  ]
}
```

### **2. Community NFTs**
```json
{
  "tokenName": "Community Art Shares",
  "tokenSymbol": "COMART",
  "creatorName": "Community DAO",
  "creatorId": "DAO-001",
  "description": "Community-owned digital artwork",
  "distributions": [
    {
      "recipientName": "Community Member 1",
      "recipientId": "MEMBER-001",
      "amount": 10,
      "note": "Participation reward"
    }
  ]
}
```

### **3. Employee Equity**
```json
{
  "tokenName": "Company Equity Tokens",
  "tokenSymbol": "EQUITY",
  "creatorName": "TechCorp Inc",
  "creatorId": "COMPANY-001",
  "description": "Employee equity distribution",
  "distributions": [
    {
      "recipientName": "John Doe",
      "recipientId": "EMP-001",
      "amount": 500,
      "note": "Q1 2025 vesting"
    }
  ]
}
```

---

## ✅ Best Practices

### **1. Token Naming**
- Use clear, descriptive names (max 32 characters)
- Use uppercase symbols (max 10 characters)
- Example: "Premium Art Shares" / "PARTSH"

### **2. Creator Information**
- Always provide creator name
- Use consistent ID format (e.g., "CREATOR-001")
- Useful for tracking and accountability

### **3. Transfer Notes**
- Document the reason for transfer
- Examples: "Initial distribution", "Q1 vesting", "Sale"
- Helps with auditing and compliance

### **4. Recipient IDs**
- Use consistent ID scheme
- Examples: "USER-001", "INV-001", "EMP-001"
- Makes querying and reporting easier

---

## 🛠️ Testing

### **1. Create a fractionalized token:**
```bash
curl -X POST http://localhost:3000/api/fractionalize \
  -H "Content-Type: application/json" \
  -d '{
    "nftMintAddress": "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV",
    "tokenName": "Test Shares",
    "tokenSymbol": "TEST",
    "creatorName": "Test User",
    "creatorId": "TEST-001",
    "description": "Testing fractionalization",
    "totalShares": 100
  }'
```

### **2. Distribute shares:**
```bash
curl -X POST http://localhost:3000/api/fractionalize/distribute \
  -H "Content-Type: application/json" \
  -d '{
    "shareTokenMint": "YOUR_SHARE_TOKEN_MINT",
    "distributions": [
      {
        "recipient": "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
        "recipientName": "Test Recipient",
        "recipientId": "REC-001",
        "amount": 25,
        "note": "Test distribution"
      }
    ]
  }'
```

### **3. Check token info:**
```bash
curl http://localhost:3000/api/fractionalize/token/YOUR_SHARE_TOKEN_MINT
```

---

## 🎯 Complete System Architecture

```
╔═══════════════════════════════════════════════════════════════╗
║                FRACTIONALIZATION SYSTEM                       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  📦 Input: NFT Mint Address                                   ║
║  ├─ Token Name & Symbol                                       ║
║  ├─ Creator Info (Name & ID)                                  ║
║  ├─ Metadata (Description & Image)                            ║
║  └─ Total Shares                                              ║
║                                                               ║
║  🔨 Processing:                                               ║
║  ├─ Upload metadata to Arweave                                ║
║  ├─ Create fungible token with Metaplex                       ║
║  ├─ Mint shares to creator                                    ║
║  └─ Store record in database                                  ║
║                                                               ║
║  📤 Distribution:                                             ║
║  ├─ Transfer shares to recipients                             ║
║  ├─ Track recipient info (Name & ID)                          ║
║  ├─ Log transfer notes                                        ║
║  └─ Store transfer history                                    ║
║                                                               ║
║  💾 Database:                                                 ║
║  ├─ fractional_tokens (token metadata)                        ║
║  └─ share_transfers (transfer history)                        ║
║                                                               ║
║  ⛓️  Blockchain:                                              ║
║  ├─ SPL Token (fungible shares)                               ║
║  ├─ Metaplex Metadata (token info)                            ║
║  └─ Arweave (permanent storage)                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📚 Additional Resources

- **Swagger API Docs:** http://localhost:3000/api-docs
- **Solana Explorer:** https://explorer.solana.com/?cluster=devnet
- **Metaplex Docs:** https://docs.metaplex.com/

---

## ✨ Summary

Your fractionalization system now includes:

1. ✅ **Rich Token Metadata** (name, symbol, description, image)
2. ✅ **Creator Tracking** (name and ID)
3. ✅ **Transfer Attribution** (recipient name/ID, notes)
4. ✅ **Database Storage** (complete history)
5. ✅ **Blockchain Integration** (Solana + Metaplex)
6. ✅ **REST API** (full CRUD operations)
7. ✅ **Validation** (express-validator)
8. ✅ **Documentation** (Swagger)

**Ready for production use!** 🎊


