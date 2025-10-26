# 🔨 NFT Fractionalization API Guide

Complete guide for fractionalizing NFTs and distributing shares via API.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Quick Start](#quick-start)
4. [Examples](#examples)
5. [Use Cases](#use-cases)

---

## 🎯 Overview

The Fractionalization API allows you to:
- **Fractionalize NFTs** - Split an NFT into multiple fungible share tokens
- **Distribute Shares** - Send shares to multiple recipients
- **Track Shares** - View share token information and balances

**How it works:**
1. You have an NFT (e.g., a rare collectible)
2. Create 100 share tokens representing fractional ownership
3. Distribute shares to investors/partners/community
4. Each share token represents a percentage of the NFT

---

## 🔗 API Endpoints

### 1. Fractionalize an NFT

```http
POST /api/fractionalize
```

**Request Body:**
```json
{
  "nftMintAddress": "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV",
  "totalShares": 100,
  "shareDecimals": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "NFT fractionalized successfully",
  "data": {
    "nftMintAddress": "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV",
    "shareTokenMint": "8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2",
    "totalShares": 100,
    "decimals": 0,
    "ownerAddress": "YourWalletAddress",
    "ownerBalance": "100",
    "explorerLink": "https://explorer.solana.com/address/...",
    "instructions": {
      "getBalance": "spl-token balance ...",
      "transfer": "spl-token transfer ..."
    }
  }
}
```

---

### 2. Distribute Shares

```http
POST /api/fractionalize/distribute
```

**Request Body:**
```json
{
  "shareTokenMint": "8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2",
  "distributions": [
    {
      "recipient": "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
      "amount": 25
    },
    {
      "recipient": "AnotherWalletAddress",
      "amount": 10
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
    "shareTokenMint": "8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2",
    "totalDistributed": 35,
    "recipientCount": 2,
    "distributions": [
      {
        "recipient": "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
        "amount": 25,
        "status": "success"
      },
      {
        "recipient": "AnotherWalletAddress",
        "amount": 10,
        "status": "success"
      }
    ],
    "senderBalance": {
      "before": "100",
      "after": "65"
    },
    "explorerLinks": [...]
  }
}
```

---

### 3. Get Share Token Info

```http
GET /api/fractionalize/token/{shareTokenMint}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shareTokenMint": "8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2",
    "decimals": 0,
    "totalSupply": "100",
    "ownerAddress": "YourWalletAddress",
    "ownerBalance": "65",
    "explorerLink": "https://explorer.solana.com/address/..."
  }
}
```

---

## 🚀 Quick Start

### Step 1: Fractionalize an NFT

```bash
curl -X POST http://localhost:3000/api/fractionalize \
  -H "Content-Type: application/json" \
  -d '{
    "nftMintAddress": "YOUR_NFT_MINT_ADDRESS",
    "totalShares": 100,
    "shareDecimals": 0
  }'
```

**What happens:**
- Creates a new fungible token (share token)
- Mints 100 shares to your wallet
- Returns share token mint address

---

### Step 2: Distribute Shares

```bash
curl -X POST http://localhost:3000/api/fractionalize/distribute \
  -H "Content-Type: application/json" \
  -d '{
    "shareTokenMint": "YOUR_SHARE_TOKEN_MINT",
    "distributions": [
      {
        "recipient": "WALLET_ADDRESS_1",
        "amount": 25
      },
      {
        "recipient": "WALLET_ADDRESS_2",
        "amount": 15
      }
    ]
  }'
```

**What happens:**
- Sends 25 shares to first recipient
- Sends 15 shares to second recipient
- Your balance decreases by 40
- Creates token accounts for recipients if needed

---

### Step 3: Check Share Info

```bash
curl http://localhost:3000/api/fractionalize/token/YOUR_SHARE_TOKEN_MINT
```

**What you get:**
- Total supply
- Your current balance
- Decimals
- Explorer link

---

## 💡 Examples

### Example 1: Create 100 Shares of an NFT

```bash
# Step 1: Fractionalize
curl -X POST http://localhost:3000/api/fractionalize \
  -H "Content-Type: application/json" \
  -d '{
    "nftMintAddress": "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV",
    "totalShares": 100
  }'

# Response: You now have 100 shares (100% ownership)
```

---

### Example 2: Distribute to 3 Investors

```bash
# Give away 60% (60 shares) to 3 investors
curl -X POST http://localhost:3000/api/fractionalize/distribute \
  -H "Content-Type: application/json" \
  -d '{
    "shareTokenMint": "8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2",
    "distributions": [
      {
        "recipient": "InvestorWallet1",
        "amount": 30
      },
      {
        "recipient": "InvestorWallet2",
        "amount": 20
      },
      {
        "recipient": "InvestorWallet3",
        "amount": 10
      }
    ]
  }'

# Result:
# - Investor 1: 30% ownership
# - Investor 2: 20% ownership
# - Investor 3: 10% ownership
# - You keep: 40% ownership
```

---

### Example 3: Airdrop to Community

```bash
# Create 1000 shares for community airdrop
curl -X POST http://localhost:3000/api/fractionalize \
  -H "Content-Type: application/json" \
  -d '{
    "nftMintAddress": "YOUR_NFT",
    "totalShares": 1000
  }'

# Distribute 1 share each to 500 community members
curl -X POST http://localhost:3000/api/fractionalize/distribute \
  -H "Content-Type: application/json" \
  -d '{
    "shareTokenMint": "SHARE_TOKEN_MINT",
    "distributions": [
      { "recipient": "member1", "amount": 1 },
      { "recipient": "member2", "amount": 1 },
      ...500 members...
    ]
  }'
```

---

## 🎯 Use Cases

### 1. Investment Syndicate
```
Scenario: Group of 5 investors buy expensive NFT together

1. Create 100 shares
2. Distribute:
   - Investor A: 30 shares (30%)
   - Investor B: 25 shares (25%)
   - Investor C: 20 shares (20%)
   - Investor D: 15 shares (15%)
   - Investor E: 10 shares (10%)
```

### 2. Employee Equity
```
Scenario: Company NFT as employee benefit

1. Create 1000 shares
2. Distribute quarterly:
   - Keep 600 for treasury
   - Employee rewards: 400 shares
   - Each employee gets shares based on performance
```

### 3. Community Ownership
```
Scenario: DAO collectively owns NFT

1. Create 10,000 shares
2. Distribute:
   - Airdrop to community: 5,000 shares
   - Treasury: 3,000 shares
   - Team: 2,000 shares
```

### 4. Fractional Real Estate NFT
```
Scenario: Property deed as NFT

1. Property worth $1M
2. Create 1,000,000 shares ($1 per share)
3. Sell shares to investors
4. Each share = 0.0001% ownership
```

---

## ⚙️ Parameters Explained

### `nftMintAddress`
- The mint address of the NFT you want to fractionalize
- Find this on Solana Explorer
- Example: `FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV`

### `totalShares`
- Number of share tokens to create
- Min: 2
- Max: 1,000,000
- Recommended:
  - Small group: 100 shares
  - Community: 1,000-10,000 shares
  - Large distribution: 100,000+ shares

### `shareDecimals`
- Decimal places for shares
- `0` = whole numbers only (recommended)
- `9` = maximum precision
- Example with decimals=2:
  - 100 shares = 10,000 (100.00)
  - Can send 0.01 shares

### `distributions`
- Array of recipients and amounts
- Can send to unlimited recipients
- Each distribution creates token account if needed
- Automatically checks your balance

---

## 🛡️ Security & Validation

The API automatically:
- ✅ Validates wallet addresses
- ✅ Checks sufficient balance before transfer
- ✅ Creates token accounts for recipients
- ✅ Prevents invalid amounts
- ✅ Returns detailed error messages

**Errors you might see:**
- `Insufficient balance` - You don't have enough shares
- `Invalid recipient address` - Wallet address is invalid
- `Amount must be greater than 0` - Can't send 0 shares

---

## 📊 Tracking & Verification

### View on Solana Explorer
Every response includes an `explorerLink`:
```
https://explorer.solana.com/address/SHARE_TOKEN_MINT?cluster=devnet
```

### Check Balance
```bash
# Your balance
curl http://localhost:3000/api/fractionalize/token/SHARE_TOKEN_MINT

# Or use Solana CLI
spl-token balance SHARE_TOKEN_MINT --url devnet
```

### View All Holders
On Solana Explorer:
1. Go to share token address
2. Click "Token Accounts"
3. See all holders and their balances

---

## 🔄 Complete Workflow Example

```bash
# 1. Fractionalize NFT into 100 shares
RESPONSE=$(curl -X POST http://localhost:3000/api/fractionalize \
  -H "Content-Type: application/json" \
  -d '{
    "nftMintAddress": "FiPRJs76NFWtnnPLepmnNpxZDu13vCu6sKSym7YnDzCV",
    "totalShares": 100
  }')

# Extract share token mint from response
SHARE_TOKEN=$(echo $RESPONSE | jq -r '.data.shareTokenMint')

echo "Share Token: $SHARE_TOKEN"

# 2. Check your balance
curl http://localhost:3000/api/fractionalize/token/$SHARE_TOKEN

# 3. Distribute to partners
curl -X POST http://localhost:3000/api/fractionalize/distribute \
  -H "Content-Type: application/json" \
  -d '{
    "shareTokenMint": "'$SHARE_TOKEN'",
    "distributions": [
      {
        "recipient": "7Shg2Wm3nSiEG13FuVJnNmgZM3Tj57KGDSkMJFc1omFM",
        "amount": 25
      }
    ]
  }'

# 4. Check balance again
curl http://localhost:3000/api/fractionalize/token/$SHARE_TOKEN
```

---

## ✨ Tips & Best Practices

### 1. **Choose the Right Share Count**
- Small group (2-10 people): 100-1,000 shares
- Medium community (10-100): 1,000-10,000 shares
- Large airdrop (100+): 10,000-1,000,000 shares

### 2. **Use Decimals Wisely**
- `decimals: 0` for simple ownership (recommended)
- `decimals: 2` for percentage-like precision (25.50%)
- `decimals: 9` for maximum flexibility

### 3. **Batch Distributions**
- You can send to multiple recipients in one call
- Max recommended: 50-100 recipients per call
- For larger distributions, batch into multiple calls

### 4. **Keep Records**
- Save the `shareTokenMint` address
- Store distribution history
- Monitor balances on Explorer

---

## 🎓 Advanced: Integration Example

```typescript
// TypeScript example
import axios from 'axios';

async function fractionalizeAndDistribute() {
  // 1. Fractionalize NFT
  const fractionalizeResponse = await axios.post(
    'http://localhost:3000/api/fractionalize',
    {
      nftMintAddress: 'YOUR_NFT_MINT',
      totalShares: 100,
      shareDecimals: 0
    }
  );

  const shareTokenMint = fractionalizeResponse.data.data.shareTokenMint;
  console.log(`Created ${shareTokenMint}`);

  // 2. Distribute shares
  const recipients = [
    { wallet: 'wallet1', shares: 30 },
    { wallet: 'wallet2', shares: 20 },
    { wallet: 'wallet3', shares: 10 },
  ];

  const distributeResponse = await axios.post(
    'http://localhost:3000/api/fractionalize/distribute',
    {
      shareTokenMint,
      distributions: recipients.map(r => ({
        recipient: r.wallet,
        amount: r.shares
      }))
    }
  );

  console.log(`Distributed to ${recipients.length} recipients`);

  // 3. Check final balance
  const infoResponse = await axios.get(
    `http://localhost:3000/api/fractionalize/token/${shareTokenMint}`
  );

  console.log(`Remaining balance: ${infoResponse.data.data.ownerBalance}`);
}
```

---

## 📖 Related Documentation

- **API Documentation**: http://localhost:3000/api-docs
- **Product Tracking**: `NEW_ARCHITECTURE_SUMMARY.md`
- **Debugging**: `DEBUGGING_GUIDE.md`

---

## ✅ Summary

You can now:
- ✅ Fractionalize any NFT via API
- ✅ Distribute shares to unlimited recipients
- ✅ Track share balances and ownership
- ✅ Integrate fractionalization into your app

**Happy fractionalizing! 🚀**


