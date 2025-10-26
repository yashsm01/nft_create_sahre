# NFT Fractionalization Guide

## 🎯 What is NFT Fractionalization?

**Fractionalization** allows you to split an NFT into multiple fungible token "shares" that can be owned and traded independently. This enables:

- **Shared Ownership**: Multiple people can own parts of a valuable NFT
- **Liquidity**: Easier to trade portions rather than the whole NFT
- **Accessibility**: Lower barrier to entry for expensive NFTs
- **Governance**: Share holders can vote on NFT-related decisions

---

## 🏗️ How It Works

```
Original NFT (1 unique token)
        ↓
  Fractionalize
        ↓
100 Share Tokens (fungible)
        ↓
   Distribute
        ↓
Multiple Owners (each with X shares)
```

### Example

You have an NFT worth 10 SOL:
1. **Fractionalize** it into 100 shares
2. Each share represents 1% ownership
3. **Distribute** shares to different wallets
4. Each person owns a fraction of the NFT

---

## 🚀 Quick Start

### Step 1: Fractionalize Your NFT

Make sure `NFT_ADDRESS` is set in your `.env` file.

```bash
npm run fractionalize:nft
```

**What happens:**
- Creates 100 fungible "share" tokens
- Each share represents fractional ownership
- All shares are initially in your wallet
- You get a `SHARE_TOKEN_MINT` address

**Output:**
```
✅ NFT fractionalized successfully!
   Share Token Mint: ABC123...
   Total Shares Created: 100
```

### Step 2: Update .env

Add the share token mint to your `.env`:

```env
SHARE_TOKEN_MINT=<your-share-token-mint-address>
```

### Step 3: Distribute Shares

Edit `src/scripts/distribute-shares.ts` and add recipient addresses:

```typescript
const distributions: ShareDistribution[] = [
  {
    recipient: "Wallet1Address...",
    amount: 10, // 10% ownership
  },
  {
    recipient: "Wallet2Address...",
    amount: 20, // 20% ownership
  },
  {
    recipient: "Wallet3Address...",
    amount: 30, // 30% ownership
  },
];
```

Then run:

```bash
npm run distribute:shares
```

---

## 📋 Detailed Example

Let's say you created an NFT art piece and want to share it with 3 friends:

### 1. Create the NFT (if you haven't)

```bash
npm run create:nft
```

### 2. Fractionalize it into 100 shares

```bash
npm run fractionalize:nft
```

### 3. Edit distribution script

```typescript
// src/scripts/distribute-shares.ts
const distributions: ShareDistribution[] = [
  {
    recipient: "Friend1WalletAddress",
    amount: 25, // Friend 1 gets 25%
  },
  {
    recipient: "Friend2WalletAddress",
    amount: 25, // Friend 2 gets 25%
  },
  {
    recipient: "Friend3WalletAddress",
    amount: 25, // Friend 3 gets 25%
  },
  // You keep 25 shares (25%) in your wallet
];
```

### 4. Distribute

```bash
npm run distribute:shares
```

---

## ⚙️ Customization

### Change Number of Shares

Edit `src/scripts/fractionalize-nft.ts`:

```typescript
const fractionalizeConfig: FractionalizeConfig = {
  nftMint: UmiPublicKey(envConfig.nftAddress!),
  totalShares: 1000, // ← Change this (100, 1000, 10000, etc.)
  shareName: "My NFT Shares",
  shareSymbol: "MNFTS",
};
```

### Change Share Name/Symbol

```typescript
shareName: "Cool Art Shares",  // ← Customize name
shareSymbol: "COOLART",         // ← Customize symbol
```

### Set Price Per Share

```typescript
pricePerShare: 0.01, // 0.01 SOL per share
```

---

## 🔧 Use Cases

### 1. **Community Ownership**
Create a DAO where members own shares of valuable NFTs.

### 2. **Investment Pools**
Allow multiple investors to co-own expensive NFTs.

### 3. **Creator Royalties**
Give collaborators shares of the NFT representing their contribution.

### 4. **Fundraising**
Sell shares of an NFT to raise funds for a project.

### 5. **Gaming Assets**
Share powerful in-game items among team members.

---

## 📊 Architecture

The fractionalization feature adds:

```
src/
├── types/
│   └── fractionalize.ts        # Fractionalization types
├── services/
│   └── fractionalize.ts        # Fractionalization logic
└── scripts/
    ├── fractionalize-nft.ts    # Fractionalize an NFT
    └── distribute-shares.ts    # Send shares to recipients
```

---

## 🔍 Under the Hood

### What Happens During Fractionalization?

1. **Create Fungible Token**: A new SPL token is created to represent shares
2. **Set Metadata**: Share token gets metadata linking to original NFT
3. **Mint Shares**: Total number of shares minted to your wallet
4. **Distribution**: Transfer shares to different wallets

### Share Token Properties

- **Type**: SPL Fungible Token
- **Decimals**: 0 (whole shares only)
- **Supply**: Fixed (e.g., 100 shares total)
- **Tradeable**: Yes, like any SPL token

---

## ⚠️ Important Notes

### This is a Simplified Implementation

This implementation creates share tokens but:

- ✅ **Creates** fungible tokens representing shares
- ✅ **Distributes** shares to multiple wallets
- ✅ **Tracks** ownership via token balances
- ❌ **Doesn't lock** the original NFT in a vault
- ❌ **Doesn't enforce** governance rules
- ❌ **Doesn't handle** redemption (combining shares back to NFT)

### For Production Use

For a full fractional NFT platform, consider:

1. **Use a Vault Program**: Lock the NFT so it can't be sold separately
2. **Governance System**: Vote on NFT decisions based on share ownership
3. **Redemption Mechanism**: Allow share holders to recombine shares → NFT
4. **Price Oracle**: Track share value vs. NFT value
5. **Audited Contracts**: Use tested, audited programs

**Recommended Protocols:**
- [Bridgesplit](https://www.bridgesplit.com/) - NFT fractionalization protocol
- [Solvent Protocol](https://solvent.xyz/) - NFT liquidity and fractionalization
- Custom vault program with governance

---

## 📚 Commands Reference

| Command | Description |
|---------|-------------|
| `npm run fractionalize:nft` | Split NFT into shares |
| `npm run distribute:shares` | Send shares to recipients |

---

## 💡 Example Scenarios

### Scenario 1: 50/50 Partnership

You and a partner want to co-own an NFT:

```typescript
const distributions = [
  { recipient: "PartnerWallet", amount: 50 },
  // You keep 50 shares
];
```

### Scenario 2: Team Rewards

Reward team members with shares:

```typescript
const distributions = [
  { recipient: "Developer1", amount: 20 },
  { recipient: "Developer2", amount: 20 },
  { recipient: "Designer", amount: 15 },
  { recipient: "Marketer", amount: 15 },
  // You keep 30 shares
];
```

### Scenario 3: Public Sale

Sell shares to the community:

```typescript
// Keep selling shares from your wallet
// Recipients buy shares via a marketplace or DEX
```

---

## 🎯 Next Steps

1. **Fractionalize** your NFT
2. **Distribute** shares to recipients
3. **Track** ownership via Solana Explorer
4. **Consider** implementing a vault for production
5. **Explore** governance and voting mechanisms

---

## 🆘 Troubleshooting

### "SHARE_TOKEN_MINT not set"
→ Add `SHARE_TOKEN_MINT` to `.env` after fractionalizing

### "Placeholder addresses detected"
→ Update recipient addresses in `distribute-shares.ts`

### "Insufficient shares"
→ You're trying to distribute more shares than you own

### "Account not found"
→ Recipient may need to create a token account first

---

**Happy Fractionalizing! 🎨🔀**

